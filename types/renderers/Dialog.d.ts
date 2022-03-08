declare namespace Dialog {
  interface DialogSchema extends BaseSchema {
    type: 'dialog';

    /**
     * 默认不用填写，自动会创建确认和取消按钮。
     */
    actions?: Array<ActionSchema>;

    /**
     * 内容区域
     */
    body?: SchemaCollection;

    /**
     * 配置 Body 容器 className
     */
    bodyClassName?: SchemaClassName;

    /**
     * 是否支持按 ESC 关闭 Dialog
     */
    closeOnEsc?: boolean;

    /**
     * 是否支持点其它区域关闭 Dialog
     */
    closeOnOutside?: boolean;

    name?: SchemaName;

    /**
     * Dialog 大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

    /**
     * 请通过配置 title 设置标题
     */
    title?: SchemaCollection;

    header?: SchemaCollection;
    headerClassName?: SchemaClassName;

    footer?: SchemaCollection;

    /**
     * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
     */
    confirm?: boolean;

    /**
     * 是否显示关闭按钮
     */
    showCloseButton?: boolean;

    /**
     * 是否显示错误信息
     */
    showErrorMsg?: boolean;
  }

  interface DialogProps
    extends Renderer.RendererProps,
      Omit<DialogSchema, 'className'> {
    onClose: () => void;
    onConfirm: (
      values: Array<object>,
      action: Action,
      ctx: object,
      targets: Array<any>
    ) => void;
    children?: React.ReactNode | ((props?: any) => React.ReactNode);
    store: IModalStore;
    show?: boolean;
    lazyRender?: boolean;
    lazySchema?: (props: DialogProps) => SchemaCollection;
    wrapperComponent: React.ElementType;
  }
}
