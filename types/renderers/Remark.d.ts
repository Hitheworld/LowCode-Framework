declare namespace Remark {
  interface RemarkSchema extends BaseSchema {
    /**
     * 指定为提示类型
     */
    type: 'remark';

    label?: string;

    icon?: SchemaIcon;

    tooltipClassName?: SchemaClassName;

    /**
     * 触发规则
     */
    trigger?: Array<'click' | 'hover' | 'focus'>;

    /**
     * 提示标题
     */
    title?: string;

    /**
     * 提示内容
     */
    content: SchemaTpl;

    /**
     * 显示位置
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';

    /**
     * 点击其他内容时是否关闭弹框信息
     */
    rootClose?: boolean;
  }

  type SchemaRemark = string | Omit<RemarkSchema, 'type'>;

  interface RemarkProps
    extends RendererProps,
      Omit<RemarkSchema, 'type' | 'className'> {
    icon: string;
    trigger: Array<'hover' | 'click' | 'focus'>;
  }
}
