import qs from 'qs';
import {
  isObject,
  isObjectShallowModified,
  hasFile,
  object2formData,
  qsstringify,
  cloneObject,
  createObject,
  qsparse,
} from '@/utils/helper';
import { tokenize, dataMapping, escapeHtml } from '@/utils/tpl-builtin';

// 规范化Api
const rSchema = /(?:^|raw\:)(get|post|put|delete|patch|options|head):/i;
export function normalizeApi(
  api: Types.Api,
  defaultMethod: string = 'get'
): Types.ApiObject {
  if (typeof api === 'string') {
    let method = rSchema.test(api) ? RegExp.$1 : '';
    method && (api = api.replace(method + ':', ''));

    api = {
      method: (method || defaultMethod) as any,
      url: api,
    };
  } else {
    api = {
      ...api,
    };
  }
  return api;
}

/**
 * 字符串转方法
 */
export function str2function(
  contents: string,
  ...args: Array<string>
): Function | null {
  try {
    let fn = new Function(...args, contents);
    return fn;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

/**
 * 构建Api
 */
export function buildApi(
  api: Types.Api,
  data?: object,
  options: {
    autoAppend?: boolean;
    ignoreData?: boolean;
    [propName: string]: any;
  } = {}
): Types.ApiObject {
  api = normalizeApi(api, options.method);
  const { autoAppend, ignoreData, ...rest } = options;

  api.config = {
    ...rest,
  };
  api.method = (api.method || (options as any).method || 'get').toLowerCase();

  if (!data) {
    return api;
  } else if (
    data instanceof FormData ||
    data instanceof Blob ||
    data instanceof ArrayBuffer
  ) {
    api.data = data;
    return api;
  }

  const raw = (api.url = api.url || '');
  const idx = api.url.indexOf('?');

  if (~idx) {
    const hashIdx = api.url.indexOf('#');
    const params = qsparse(
      api.url.substring(idx + 1, ~hashIdx ? hashIdx : undefined)
    );
    api.url =
      tokenize(api.url.substring(0, idx + 1), data, '| url_encode') +
      qsstringify((api.query = dataMapping(params, data))) +
      (~hashIdx ? api.url.substring(hashIdx) : '');
  } else {
    api.url = tokenize(api.url, data, '| url_encode');
  }

  if (ignoreData) {
    return api;
  }

  if (api.data) {
    api.body = api.data = dataMapping(api.data, data);
  } else if (api.method === 'post' || api.method === 'put') {
    api.body = api.data = cloneObject(data);
  }

  // get 类请求，把 data 附带到 url 上。
  if (api.method === 'get') {
    if (!~raw.indexOf('$') && !api.data && autoAppend) {
      api.query = api.data = data;
    } else if (
      api.attachDataToQuery === false &&
      api.data &&
      !~raw.indexOf('$') &&
      autoAppend
    ) {
      const idx = api.url.indexOf('?');
      if (~idx) {
        let params = (api.query = {
          ...qsparse(api.url.substring(idx + 1)),
          ...data,
        });
        api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
      } else {
        api.query = data;
        api.url += '?' + qsstringify(data);
      }
    }

    if (api.data && api.attachDataToQuery !== false) {
      const idx = api.url.indexOf('?');
      if (~idx) {
        let params = (api.query = {
          ...qsparse(api.url.substring(idx + 1)),
          ...api.data,
        });
        api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
      } else {
        api.query = api.data;
        api.url += '?' + qsstringify(api.data);
      }
      delete api.data;
    }
  }

  if (api.headers) {
    api.headers = dataMapping(api.headers, data);
  }

  if (api.requestAdaptor && typeof api.requestAdaptor === 'string') {
    api.requestAdaptor = str2function(api.requestAdaptor, 'api') as any;
  }

  if (api.adaptor && typeof api.adaptor === 'string') {
    api.adaptor = str2function(
      api.adaptor,
      'payload',
      'response',
      'api'
    ) as any;
  }

  return api;
}

/**
 * 是否相同的Api
 */
export function isSameApi(
  apiA: Types.ApiObject | Types.ApiCacheConfig,
  apiB: Types.ApiObject | Types.ApiCacheConfig
): boolean {
  return (
    apiA.method === apiB.method &&
    apiA.url === apiB.url &&
    !isObjectShallowModified(apiA.data, apiB.data, false)
  );
}

/**
 * 获取Api缓存
 */
const apiCaches: Array<Types.ApiCacheConfig> = [];
export function getApiCache(
  api: Types.ApiObject
): Types.ApiCacheConfig | undefined {
  // 清理过期cache
  const now = Date.now();
  let result: Types.ApiCacheConfig | undefined;

  for (let idx = 0, len = apiCaches.length; idx < len; idx++) {
    const apiCache = apiCaches[idx];

    if (now - apiCache.requestTime > (apiCache.cache as number)) {
      apiCaches.splice(idx, 1);
      len--;
      idx--;
      continue;
    }

    if (isSameApi(api, apiCache)) {
      result = apiCache;
      break;
    }
  }

  return result;
}

/**
 * 响应适配器
 * TODO 响应问题
 */

export function responseAdaptor(
  ret: Types.FetcherResult,
  api: Types.ApiObject
) {
  const data = ret.data;
  let hasStatusField = true;
  if (!data) {
    throw new Error('Response is empty!');
  }
  // 兼容几种常见写法
  if (data.hasOwnProperty('errorCode')) {
    // 阿里 Java 规范
    data.status = data.errorCode;
    data.msg = data.errorMessage;
  } else if (data.hasOwnProperty('errno')) {
    data.status = data.errno;
    data.msg = data.errmsg || data.errstr || data.msg;
  } else if (data.hasOwnProperty('no')) {
    data.status = data.no;
    data.msg = data.error || data.msg;
  } else if (data.hasOwnProperty('error')) {
    // Google JSON guide
    // https://google.github.io/styleguide/jsoncstyleguide.xml#error
    if (typeof data.error === 'object' && data.error.hasOwnProperty('code')) {
      data.status = data.error.code;
      data.msg = data.error.message;
    } else {
      data.status = data.error;
      data.msg = data.errmsg || data.msg;
    }
  }
  if (!data.hasOwnProperty('status')) {
    hasStatusField = false;
  }
  const payload: Types.Payload = {
    ok: hasStatusField === false || data.status == 0,
    status: hasStatusField === false ? 0 : data.status,
    msg: data.msg || data.message,
    msgTimeout: data.msgTimeout,
    data: !data.data && !hasStatusField ? data : data.data, // 兼容直接返回数据的情况
  };
  // 兼容返回 schema 的情况，用于 app 模式
  if (data && data.type) {
    payload.data = data;
  }
  if (payload.status == 422) {
    payload.errors = data.errors;
  }
  if (payload.ok && api.responseData) {
    payload.data = dataMapping(
      api.responseData,
      createObject(
        { api },
        (Array.isArray(payload.data)
          ? {
              items: payload.data,
            }
          : payload.data) || {}
      )
    );
  }
  return payload;
}

/**
 * 缠绕接头
 */
export function wrapAdaptor(
  promise: Promise<Types.FetcherResult>,
  api: Types.ApiObject
) {
  const adaptor = api.adaptor;
  return adaptor
    ? promise
        .then(async (response) => {
          let result = adaptor((response as any).data, response, api);

          if (result?.then) {
            result = await result;
          }

          return {
            ...response,
            data: result,
          };
        })
        .then((ret) => responseAdaptor(ret, api))
    : promise.then((ret) => responseAdaptor(ret, api));
}

/**
 * 设置Api缓存
 */
export function setApiCache(
  api: Types.ApiObject,
  promise: Promise<any>
): Promise<any> {
  apiCaches.push({
    ...api,
    cachedPromise: promise,
    requestTime: Date.now(),
  });
  return promise;
}

/**
 * 包取器
 */
export function wrapFetcher(
  fn: (config: Fetcher.FetcherConfig) => Promise<Types.FetcherResult>
): (
  api: Types.Api,
  data: object,
  options?: object
) => Promise<Types.Payload | void> {
  return function (api, data, options) {
    api = buildApi(api, data, options) as Types.ApiObject;
    api.requestAdaptor && (api = api.requestAdaptor(api) || api);
    if (api.data && (hasFile(api.data) || api.dataType === 'form-data')) {
      api.data =
        api.data instanceof FormData
          ? api.data
          : object2formData(api.data, api.qsOptions);
    } else if (
      api.data &&
      typeof api.data !== 'string' &&
      api.dataType === 'form'
    ) {
      api.data = qsstringify(api.data, api.qsOptions) as any;
      api.headers = api.headers || (api.headers = {});
      api.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (
      api.data &&
      typeof api.data !== 'string' &&
      api.dataType === 'json'
    ) {
      api.data = JSON.stringify(api.data) as any;
      api.headers = api.headers || (api.headers = {});
      api.headers['Content-Type'] = 'application/json';
    }

    if (typeof api.cache === 'number' && api.cache > 0) {
      const apiCache = getApiCache(api);
      return wrapAdaptor(
        apiCache
          ? (apiCache as Types.ApiCacheConfig).cachedPromise
          : setApiCache(api, fn(api)),
        api
      );
    }
    return wrapAdaptor(fn(api), api);
  };
}
