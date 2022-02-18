declare namespace Renderer {
  interface TestFunc {
    (
      path: string,
      schema?: Types.Schema,
      resolveRenderer?: (
        path: string,
        schema?: Types.Schema,
        props?: any
      ) => null | RendererConfig
    ): boolean;
  }

  interface RendererBasicConfig {
    test?: RegExp | TestFunc;
    type?: string;
    name?: string;
    // shouldSyncSuperStore?: (
    //   store: any,
    //   props: any,
    //   prevProps: any
    // ) => boolean | undefined;
    // storeExtendsData?: boolean | ((props: any) => boolean); // 是否需要继承上层数据。
    weight?: number; // 权重，值越低越优先命中。
    isolateScope?: boolean;
    isFormItem?: boolean;
    // [propName:string]:any;
  }

  interface RendererProps {
    render: (
      region: string,
      node: Types.SchemaNode,
      props?: any
    ) => JSX.Element;
    env: Env.RendererEnv;
    $path: string; // 当前组件所在的层级信息
    $schema: any; // 原始 schema 配置
    syncSuperStore?: boolean;
    data: {
      [propName: string]: any;
    };
    defaultData?: object;
    className?: any;
    [propName: string]: any;
  }

  type RendererComponent = React.ComponentType<RendererProps> & {
    propsList?: Array<any>;
  };

  interface RendererConfig extends RendererBasicConfig {
    component: RendererComponent;
    Renderer?: RendererComponent; // 原始组件
  }
}
