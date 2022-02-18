import axios from 'axios';
import qs from 'qs';

async function attachmentAdpator(response: any) {
  if (response?.headers?.['content-disposition']) {
    const disposition = response.headers['content-disposition'];
    let filename = '';

    if (disposition && disposition.indexOf('attachment') !== -1) {
      // disposition 有可能是 attachment; filename="??.xlsx"; filename*=UTF-8''%E4%B8%AD%E6%96%87.xlsx
      // 这种情况下最后一个才是正确的文件名
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)$/;

      let matches = disposition.match(filenameRegex);
      if (matches && matches.length) {
        filename = matches[1].replace(`UTF-8''`, '').replace(/['"]/g, '');
      }

      // 很可能是中文被 url-encode 了
      if (filename && filename.replace(/[^%]/g, '').length > 2) {
        filename = decodeURIComponent(filename);
      }

      let type = response.headers['content-type'];
      let blob =
        response.data.toString() === '[object Blob]'
          ? response.data
          : new Blob([response.data], { type: type });
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
      } else {
        let URL = window.URL || (window as any).webkitURL;
        let downloadUrl = URL.createObjectURL(blob);
        if (filename) {
          // use HTML5 a[download] attribute to specify filename
          let a = document.createElement('a');
          // safari doesn't support this yet
          if (typeof a.download === 'undefined') {
            (window as any).location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        } else {
          (window as any).location = downloadUrl;
        }
        setTimeout(function () {
          URL.revokeObjectURL(downloadUrl);
        }, 100); // cleanup
      }
    }

    return {
      ...response,
      data: {
        status: 0,
        msg: '文件即将开始下载...',
      },
    };
  }
  if (response?.data?.toString() === '[object Blob]') {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const text = reader.result as string;

        try {
          resolve({
            ...response,
            data: {
              ...JSON.parse(text),
            },
          });
        } catch (e) {
          reject(e);
        }
      });
      reader.readAsText(response.data);
    });
  }
  return response;
}

function responseAdaptor(env: Env.RendererEnv, api: any, res: any) {
  let response = res.data || {}; // blob 下可能会返回内容为空？
  // 之前拼写错了，需要兼容
  // if (env && env.responseAdpater) {
  //   env.responseAdaptor = env.responseAdpater;
  // }
  if (env?.responseAdaptor) {
    const url = api.url;
    const idx = api.url.indexOf('?');
    const query = ~idx ? qs.parse(api.url.substring(idx)) : {};
    const request = {
      ...api,
      query: query,
      body: api.data,
    };
    response = env?.responseAdaptor(api, response, query, request);
  } else {
    if (response.hasOwnProperty('errno')) {
      response.status = response.errno;
      response.msg = response.errmsg;
    } else if (response.hasOwnProperty('no')) {
      response.status = response.no;
      response.msg = response.error;
    }
  }
  const result = {
    ...res,
    data: response,
  };
  return result;
}

/**
 * 请求适配器
 */
function requestAdaptor(env: Env.RendererEnv, config: any) {
  const fn =
    env && typeof env?.requestAdaptor === 'function'
      ? env?.requestAdaptor?.bind()
      : (config: any) => config;
  const request = fn(config) || config;
  return request;
}

/**
 * 请求API
 */
export async function fetcherApi(env: Env.RendererEnv, api: any) {
  const { url, method, data, responseType, config, headers } = api;
  let _data = data;
  let _config = config || {};
  _config.url = url;
  _config.withCredentials = true;
  responseType && (_config.responseType = responseType);

  if (_config.cancelExecutor) {
    _config.cancelToken = new (axios as any).CancelToken(
      _config.cancelExecutor
    );
  }

  _config.headers = headers || {};
  _config.method = method;
  _config.data = data;

  _config = requestAdaptor(env, _config);

  if (method === 'get' && data) {
    _config.params = data;
  } else if (data && data instanceof FormData) {
    // config.headers['Content-Type'] = 'multipart/form-data';
  } else if (
    data &&
    typeof data !== 'string' &&
    !(data instanceof Blob) &&
    !(data instanceof ArrayBuffer)
  ) {
    _data = JSON.stringify(data);
    config.headers['Content-Type'] = 'application/json';
  }

  // 支持返回各种报错信息
  config.validateStatus = function (status: any) {
    return true;
  };

  console.log('请求config:', _config);

  let response = await axios(_config);
  response = await attachmentAdpator(response);
  response = responseAdaptor(env, api, response);
  if (response?.status >= 400) {
    if (response?.data) {
      // 主要用于 raw: 模式下，后端自己校验登录，
      if (
        response.status === 401 &&
        response.data.location &&
        response.data.location.startsWith('http')
      ) {
        location.href = response.data.location.replace(
          '{{redirect}}',
          encodeURIComponent(location.href)
        );
        return new Promise(() => {});
      } else if (response.data.msg) {
        throw new Error(response.data.msg);
      } else {
        throw new Error('接口报错：' + JSON.stringify(response.data, null, 2));
      }
    } else {
      throw new Error(`接口出错，状态码是 ${response.status}`);
    }
  }
  console.log('请求response:', response);
  return response;
  // return new Promise(function (resolve, reject) {
  //   reject(response);
  // });
}

/**
 * 是否取消请求
 */
export function isCancel(value: any) {
  (axios as any).isCancel(value);
}
