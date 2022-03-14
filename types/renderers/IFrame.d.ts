declare namespace IFrame {
  interface IFrameSchema extends Schema.BaseSchema {
    type: 'iframe';

    /**
     * 页面地址
     */
    src: SchemaUrlPath;

    /**
     * 事件相应，配置后当 iframe 通过 postMessage 发送事件时，可以触发 AMIS 内部的动作。
     */
    events?: {
      [eventName: string]: ActionSchema;
    };

    width?: number | string;
    height?: number | string;
  }

  interface IFrameProps
    extends Renderer.RendererProps,
      Omit<IFrameSchema, 'type' | 'className'> {}
}
