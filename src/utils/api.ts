import { tokenize, dataMapping } from './tpl-builtin';
import { evalExpression } from './tpl';
import {
  isObject,
  isObjectShallowModified,
  hasFile,
  object2formData,
  qsstringify,
  cloneObject,
  createObject,
  qsparse,
} from './helper';

const rSchema = /(?:^|raw\:)(get|post|put|delete|patch|options|head):/i;

export function normalizeApi(
  api: Api,
  defaultMethod: string = 'get'
): ApiObject {
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

export function isValidApi(api: string) {
  return (
    api &&
    /^(?:(https?|wss?|taf):\/\/[^\/]+)?(\/?[^\s\/\?]*){1,}(\?.*)?$/.test(api)
  );
}

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

export function isApiOutdated(
  prevApi: Api | undefined,
  nextApi: Api | undefined,
  prevData: any,
  nextData: any
): nextApi is Api {
  if (!nextApi) {
    return false;
  } else if (!prevApi) {
    return true;
  }

  nextApi = normalizeApi(nextApi);

  if (nextApi.autoRefresh === false) {
    return false;
  }

  const trackExpression = nextApi.trackExpression ?? nextApi.url;

  if (typeof trackExpression !== 'string' || !~trackExpression.indexOf('$')) {
    return false;
  }
  prevApi = normalizeApi(prevApi);

  let isModified = false;

  if (nextApi.trackExpression || prevApi.trackExpression) {
    isModified =
      tokenize(prevApi.trackExpression || '', prevData) !==
      tokenize(nextApi.trackExpression || '', nextData);
  } else {
    prevApi = buildApi(prevApi as Api, prevData as object, {
      ignoreData: true,
    });
    nextApi = buildApi(nextApi as Api, nextData as object, {
      ignoreData: true,
    });
    isModified = prevApi.url !== nextApi.url;
  }

  return !!(
    isModified &&
    isValidApi(nextApi.url) &&
    (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextData))
  );
}

export function buildApi(
  api: Api,
  data?: object,
  options: {
    autoAppend?: boolean;
    ignoreData?: boolean;
    [propName: string]: any;
  } = {}
): ApiObject {
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
