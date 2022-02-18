declare namespace Action {
  interface ButtonSchema extends BaseSchema {
    /**
     * 是否为块状展示，默认为内联。
     */
    block?: boolean;

    /**
     * 禁用时的文案提示。
     */
    disabledTip?: string;

    /**
     * 按钮图标， iconfont 的类名
     */
    icon?: SchemaIcon;

    /**
     * icon 上的css 类名
     */
    iconClassName?: SchemaClassName;

    /**
     * 右侧按钮图标， iconfont 的类名
     */
    rightIcon?: SchemaIcon;

    /**
     * 右侧 icon 上的 css 类名
     */
    rightIconClassName?: SchemaClassName;

    /**
     * 按钮文字
     */
    label?: string;

    /**
     * 按钮样式
     */
    level?:
      | 'info'
      | 'success'
      | 'warning'
      | 'danger'
      | 'link'
      | 'primary'
      | 'dark'
      | 'light';

    /**
     * @deprecated 通过 level 来配置
     */
    primary?: boolean;

    /**
     * 按钮大小
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';

    tooltip?: SchemaTooltip;
    tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';

    /**
     * 指定按钮类型，支持 button、submit或者reset三种类型。
     */
    type: 'button' | 'submit' | 'reset';

    /**
     * 提示文字，配置了操作前会要求用户确认。
     */
    confirmText?: string;

    /**
     * 如果按钮在form中，配置此属性会要求用户把指定的字段通过验证后才会触发行为。
     */
    required?: Array<string>;

    /**
     * 激活状态时的样式
     */
    activeLevel?: string;

    /**
     * 激活状态时的类名
     */
    activeClassName?: string;

    /**
     * 如果按钮在弹框中，可以配置这个动作完成后是否关闭弹窗，或者指定关闭目标弹框。
     */
    close?: boolean | string;

    /**
     * 当按钮时批量操作按钮时，默认必须有勾选元素才能可点击，如果此属性配置成 false，则没有点选成员也能点击。
     */
    requireSelected?: boolean;

    /**
     * 是否将弹框中数据 merge 到父级作用域。
     */
    mergeData?: boolean;

    /**
     * 可以指定让谁来触发这个动作。
     */
    target?: string;

    /**
     * 点击后的禁止倒计时（秒）
     */
    countDown?: number;

    /**
     * 倒计时文字自定义
     */
    countDownTpl?: string;

    /**
     * 角标
     */
    badge?: BadgeSchema;
  }

  interface AjaxActionSchema extends ButtonSchema {
    /**
     * 指定为发送 ajax 的行为。
     */
    actionType: 'ajax';

    /**
     * 配置 ajax 发送地址
     */
    api: SchemaApi;

    feedback?: FeedbackDialog;

    reload?: SchemaReload;
    redirect?: string;
    ignoreConfirm?: boolean;
  }

  interface UrlActionSchema extends ButtonSchema {
    /**
     * 指定为打开链接
     */
    actionType: 'url';

    /**
     * 是否新窗口打开
     */
    blank?: boolean;

    /**
     * 打开的目标地址
     */
    url: string;
  }

  interface DialogActionSchema extends ButtonSchema {
    /**
     * 指定为打开弹窗
     */
    actionType: 'dialog';

    /**
     * 弹框详情
     * 文档：https://baidu.gitee.io/amis/docs/components/dialog
     */
    dialog: DialogSchemaBase;

    /**
     * 是否有下一个的表达式，正常可以不用配置，如果想要刷掉某些数据可以配置这个。
     */
    nextCondition?: SchemaExpression;
    reload?: SchemaReload;
    redirect?: string;
  }

  interface DrawerActionSchema extends ButtonSchema {
    /**
     * 指定为打开弹窗，抽出式弹窗
     */
    actionType: 'drawer';

    /**
     * 抽出式弹框详情
     * 文档：https://baidu.gitee.io/amis/docs/components/drawer
     */
    drawer: DrawerSchemaBase;

    /**
     * 是否有下一个的表达式，正常可以不用配置，如果想要刷掉某些数据可以配置这个。
     */
    nextCondition?: SchemaExpression;
    reload?: SchemaReload;
    redirect?: string;
  }

  interface CopyActionSchema extends ButtonSchema {
    /**
     * 指定为复制内容行为
     */
    actionType: 'copy';

    /**
     * 复制啥内容由此配置，支持模板语法。
     */
    copy: SchemaTpl;
  }

  interface LinkActionSchema extends ButtonSchema {
    /**
     * 指定为打开链接行为，跟 url 不同的时这个行为为单页模式。
     */
    actionType: 'link';

    /**
     * 跳转到哪？支持配置相对路径。
     */
    link: string;
  }

  interface ReloadActionSchema extends ButtonSchema {
    /**
     * 指定为刷新目标组件。
     */
    actionType: 'reload';

    /**
     * 指定目标组件。
     */
    target?: SchemaReload;
  }

  interface EmailActionSchema extends ButtonSchema {
    /**
     * 指定为打开邮箱行为
     */
    actionType: 'email';

    /**
     * 收件人邮箱
     */
    to: string;

    /**
     * 抄送邮箱
     */
    cc?: string;

    /**
     * 匿名抄送邮箱
     */
    bcc?: string;

    /**
     * 邮件主题
     */
    subject?: string;

    /**
     * 邮件正文
     */
    body?: string;
  }

  interface OtherActionSchema extends ButtonSchema {
    actionType:
      | 'prev'
      | 'next'
      | 'cancel'
      | 'close'
      | 'submit'
      | 'confirm'
      | 'add'
      | 'reset'
      | 'reset-and-submit';
    [propName: string]: any;
  }

  interface VanillaAction extends ButtonSchema {
    actionType?: string;
  }

  type ActionSchema =
    | AjaxActionSchema
    | UrlActionSchema
    | LinkActionSchema
    | DialogActionSchema
    | DrawerActionSchema
    | CopyActionSchema
    | ReloadActionSchema
    | EmailActionSchema
    | OtherActionSchema
    | VanillaAction;

  interface ActionProps
    extends Omit<
        ButtonSchema,
        'className' | 'iconClassName' | 'rightIconClassName'
      >,
      ThemeProps,
      Omit<
        AjaxActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        UrlActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        LinkActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        DialogActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        DrawerActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        CopyActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        ReloadActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        EmailActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      >,
      Omit<
        OtherActionSchema,
        'type' | 'className' | 'iconClassName' | 'rightIconClassName'
      > {
    actionType: any;
    onAction?: (
      e: React.MouseEvent<any> | void | null,
      action: ActionSchema
    ) => void;
    isCurrentUrl?: (link: string) => boolean;
    onClick?:
      | ((e: React.MouseEvent<any>, props: any) => void)
      | string
      | Function
      | null;
    componentClass: React.ReactType;
    tooltipContainer?: any;
    data?: any;
    isMenuItem?: boolean;
    active?: boolean;
  }

  type ActionRendererProps = RendererProps &
    Omit<ActionProps, 'onAction' | 'isCurrentUrl' | 'tooltipContainer'> & {
      onAction: (
        e: React.MouseEvent<any> | void | null,
        action: object,
        data: any
      ) => void;
      btnDisabled?: boolean;
    };
}
