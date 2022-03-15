declare namespace Panel {
  interface PanelSchema extends Schema.BaseSchema {
    /**
     * 指定为Panel渲染器。
     */
    type: 'panel';

    /**
     * 按钮集合
     */
    actions?: Array<Action.ActionSchema>;

    /**
     * 按钮集合外层类名
     */
    actionsClassName?: Schema.SchemaClassName;

    /**
     * 内容区域
     */
    body?: Schema.SchemaCollection;

    /**
     * 配置 Body 容器 className
     */
    bodyClassName?: Schema.SchemaClassName;

    /**
     * 底部内容区域
     */
    footer?: Schema.SchemaCollection;

    /**
     * 配置 footer 容器 className
     */
    footerClassName?: Schema.SchemaClassName;

    /**
     * footer 和 actions 外层 div 类名。
     */
    footerWrapClassName?: Schema.SchemaClassName;

    /**
     * 头部内容, 和 title 二选一。
     */
    header?: Schema.SchemaCollection;

    /**
     * 配置 header 容器 className
     */
    headerClassName?: Schema.SchemaClassName;

    /**
     * Panel 标题
     */
    title?: Schema.SchemaTpl;

    /**
     * 固定底部, 想要把按钮固定在底部的时候配置。
     */
    affixFooter?: boolean | 'always';

    /**
     * 配置子表单项默认的展示方式。
     */
    subFormMode?: 'normal' | 'inline' | 'horizontal';
    /**
     * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
     */
    subFormHorizontal?: Form.FormSchemaHorizontal;
  }

  interface PanelProps
    extends Renderer.RendererProps,
      Omit<
        PanelSchema,
        'type' | 'className' | 'panelClassName' | 'bodyClassName'
      > {}
}
