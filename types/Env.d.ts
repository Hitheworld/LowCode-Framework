declare namespace Env {
  interface RendererEnv {
    fetcher: (
      api: Types.Api,
      data?: any,
      options?: object
    ) => Promise<Types.Payload>;
    isCancel: (val: any) => boolean;
    jumpTo: (to: string, action?: any, ctx?: object) => void;
    updateLocation: (location: any, replace?: boolean) => void;
    isCurrentUrl: (link: string, ctx?: any) => boolean | { params?: object };
    [propName: string]: any;
  }
}
