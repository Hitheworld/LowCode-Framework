declare namespace Scoped {
  interface IScopedContext {
    parent?: AliasIScopedContext;
    registerComponent: (component: ScopedComponentType) => void;
    unRegisterComponent: (component: ScopedComponentType) => void;
    getComponentByName: (name: string) => ScopedComponentType;
    getComponents: () => Array<ScopedComponentType>;
    reload: (target: string, ctx: RendererData) => void;
    send: (target: string, ctx: RendererData) => void;
    close: (target: string) => void;
  }
  type AliasIScopedContext = IScopedContext;

  interface RendererData {
    [propsName: string]: any;
    __prev?: RendererDataAlias;
    __super?: RendererData;
  }
  type RendererDataAlias = RendererData;

  interface ScopedComponentType extends React.Component<RendererProps> {
    focus?: () => void;
    doAction?: (
      action: Types.Action,
      data: RendererData,
      throwErrors?: boolean
    ) => void;
    receive?: (values: RendererData, subPath?: string) => void;
    reload?: (
      subPath?: string,
      query?: RendererData | null,
      ctx?: RendererData
    ) => void;
    context: any;
  }

  interface IScopedContext {
    parent?: AliasIScopedContext;
    registerComponent: (component: ScopedComponentType) => void;
    unRegisterComponent: (component: ScopedComponentType) => void;
    getComponentByName: (name: string) => ScopedComponentType;
    getComponents: () => Array<ScopedComponentType>;
    reload: (target: string, ctx: RendererData) => void;
    send: (target: string, ctx: RendererData) => void;
    close: (target: string) => void;
  }
}
