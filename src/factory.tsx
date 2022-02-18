import { createContext } from 'react';
import { Alert } from 'antd';
import Root from './Root';
import { defaultOptions } from './api/defaultOptions';
import { wrapFetcher } from './api/fetcherUtils';
import { findIndex, string2regExp } from '@/utils/helper';
// import { HocStoreFactory } from './HocStoreFactory';

let anonymousIndex = 1;
const rendererNames: Array<string> = [];
const renderers: Array<Renderer.RendererConfig> = [];
export function registerRenderer(
  config: Renderer.RendererConfig
): Renderer.RendererConfig {
  if (!config.test && !config.type) {
    throw new TypeError('please set config.test or config.type');
  } else if (!config.component) {
    throw new TypeError('config.component is required');
  }

  if (typeof config.type === 'string' && config.type) {
    config.type = config.type.toLowerCase();
    config.test =
      config.test || new RegExp(`(^|\/)${string2regExp(config.type)}$`, 'i');
  }

  config.weight = config.weight || 0;
  config.Renderer = config.component;
  config.name = config.name || config.type || `anonymous-${anonymousIndex++}`;

  if (~rendererNames.indexOf(config.name)) {
    throw new Error(`名为“${config.name}”的呈现程序已存在，请尝试其他名称!`);
  }

  // if (config.storeType && config.component) {
  //   config.component = HocStoreFactory({
  //     storeType: config.storeType,
  //     extendsData: config.storeExtendsData,
  //     shouldSyncSuperStore: config.shouldSyncSuperStore,
  //   })(config.component, props);
  // }

  // if (config.isolateScope) {
  //   config.component = Scoped(config.component);
  // }

  const idx = findIndex(
    renderers,
    (item) => (config.weight as number) < item.weight
  );
  ~idx ? renderers.splice(idx, 0, config) : renderers.push(config);
  rendererNames.push(config.name);
  return config;
}

let cache: { [propName: string]: Renderer.RendererConfig } = {};
export function resolveRenderer(
  path: string,
  schema?: Types.Schema
): null | Renderer.RendererConfig {
  const type = typeof schema?.type == 'string' ? schema.type.toLowerCase() : '';

  if (type && cache[type]) {
    return cache[type];
  } else if (cache[path]) {
    return cache[path];
  } else if (path && path.length > 1024) {
    throw new Error('Path太长是不是死循环了？');
  }

  let renderer: null | Renderer.RendererConfig = null;

  renderers.some((item) => {
    let matched = false;

    // 直接匹配类型，后续注册渲染都应该用这个方式而不是之前的判断路径。
    if (item.type && type) {
      matched = item.type === type;

      // 如果是type来命中的，那么cache的key直接用 type 即可。
      if (matched) {
        cache[type] = item;
      }
    } else if (typeof item.test === 'function') {
      // 不应该搞得这么复杂的，让每个渲染器唯一 id，自己不晕别人用起来也不晕。
      matched = item.test(path, schema, resolveRenderer);
    } else if (item.test instanceof RegExp) {
      matched = item.test.test(path);
    }

    if (matched) {
      renderer = item;
    }

    return matched;
  });

  // 只能缓存纯正则表达式的后者方法中没有用到第二个参数的，
  // 因为自定义 test 函数的有可能依赖 schema 的结果
  if (
    renderer !== null &&
    ((renderer as Renderer.RendererConfig).type ||
      (renderer as Renderer.RendererConfig).test instanceof RegExp ||
      (typeof (renderer as Renderer.RendererConfig).test === 'function' &&
        ((renderer as Renderer.RendererConfig).test as Function).length < 2))
  ) {
    cache[path] = renderer;
  }
  return renderer;
}

export function Renderer(config: Renderer.RendererBasicConfig) {
  return function <T extends Renderer.RendererComponent>(component: T): T {
    const renderer = registerRenderer({
      ...config,
      component: component,
    });
    return renderer.component as T;
  };
}

/**
 * 找不到对应的渲染器
 */
export function loadRenderer(schema: Types.Schema, path: string) {
  return (
    <Alert
      showIcon
      type="error"
      message={<p>Error: 找不到对应的渲染器</p>}
      description={
        <>
          <p>Path: {path}</p>
          <pre>
            <code>{JSON.stringify(schema, null, 2)}</code>
          </pre>
        </>
      }
    ></Alert>
  );
}

export const EnvContext = createContext<Env.RendererEnv | void>(undefined);

export function mainRender(
  schema: Types.Schema,
  props: Root.RootRenderProps = {},
  options: Root.RenderOptions = {},
  pathPrefix: string = ''
) {
  options = {
    ...defaultOptions,
    ...options,
    loadRenderer,
    fetcher: options.fetcher
      ? wrapFetcher(options.fetcher)
      : defaultOptions.fetcher,
    // confirm: promisify(
    //   options.confirm || defaultOptions.confirm || window.confirm
    // ),
  } as any;

  console.log('factory-options:', options);

  let theme = props?.theme || options?.theme || 'cxd';

  const env = {
    ...options,
  };
  console.log('EnvContext:', env);
  return (
    <EnvContext.Provider value={env}>
      <Root
        {...props}
        schema={schema}
        pathPrefix={pathPrefix}
        // rootStore={store}
        env={env}
        theme={theme}
      />
    </EnvContext.Provider>
  );
}
