declare namespace Drawer {
  interface DrawerSchema extends BaseSchema {
    type: 'drawer';

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

    name?: SchemaName;

    /**
     * Dialog 大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';

    /**
     * 请通过配置 title 设置标题
     */
    title?: SchemaCollection;

    /**
     * 从什么位置弹出
     */
    position?: 'left' | 'right' | 'top' | 'bottom';

    /**
     * 头部
     */
    header?: SchemaCollection;

    /**
     * 底部
     */
    footer?: SchemaCollection;

    /**
     * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
     */
    confirm?: boolean;

    /**
     * 是否可以拖动弹窗大小
     */
    resizable?: boolean;

    /**
     * 是否显示蒙层
     */
    overlay?: boolean;

    /**
     * 点击外部的时候是否关闭弹框。
     */
    closeOnOutside?: boolean;

    /**
     * 是否显示错误信息
     */
    showErrorMsg?: boolean;
  }

  type DrawerSchemaBase = Omit<DrawerSchema, 'type'>;

  interface DrawerProps extends RendererProps, Omit<DrawerSchema, 'className'> {
    onClose: () => void;
    onConfirm: (
      values: Array<object>,
      action: Action,
      ctx: object,
      targets: Array<any>
    ) => void;
    children?: React.ReactNode | ((props?: any) => React.ReactNode);
    wrapperComponent: React.ElementType;
    lazySchema?: (props: DrawerProps) => SchemaCollection;
    store: IModalStore;
    show?: boolean;
    drawerContainer?: () => HTMLElement;
  }
}
