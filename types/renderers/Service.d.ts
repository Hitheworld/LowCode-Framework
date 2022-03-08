declare namespace Service {
  /**
   * Service 服务类控件。
   * 文档：
   */
  interface ServiceSchema extends Schema.BaseSchema {
    /**
     * 指定为 Service 数据拉取控件。
     */
    type: 'service';

    /**
     * 页面初始化的时候，可以设置一个 API 让其取拉取，发送数据会携带当前 data 数据（包含地址栏参数），获取得数据会合并到 data 中，供组件内使用。
     */
    api?: Schema.SchemaApi;

    /**
     * WebScocket 地址，用于实时获取数据
     */
    ws?: string;

    /**
     * 内容区域
     */
    body?: Schema.SchemaCollection;

    /**
     * @deprecated 改成 api 的 sendOn。
     */
    fetchOn?: Schema.SchemaExpression;

    /**
     * 是否默认就拉取？
     */
    initFetch?: boolean;

    /**
     * 是否默认就拉取？通过表达式来决定.
     *
     * @deprecated 改成 api 的 sendOn。
     */
    initFetchOn?: Schema.SchemaExpression;

    /**
     * 用来获取远程 Schema 的 api
     */
    schemaApi?: Schema.SchemaApi;

    /**
     * 是否默认加载 schemaApi
     */
    initFetchSchema?: boolean;

    /**
     * 用表达式来配置。
     * @deprecated 改成 api 的 sendOn。
     */
    initFetchSchemaOn?: Schema.SchemaExpression;

    /**
     * 是否轮询拉取
     */
    interval?: number;

    /**
     * 是否静默拉取
     */
    silentPolling?: boolean;

    /**
     * 关闭轮询的条件。
     */
    stopAutoRefreshWhen?: Schema.SchemaExpression;

    messages?: Schema.SchemaMessage;

    name?: Schema.SchemaName;
  }

  interface ServiceProps
    extends Renderer.RendererProps,
      Omit<ServiceSchema, 'type' | 'className'> {
    // store: IServiceStore;
    messages: SchemaMessage;
  }
}
