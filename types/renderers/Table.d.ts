declare namespace Table {
  /**
   * 表格列，不指定类型时默认为文本类型。
   */
  type TableColumnObject = {
    /**
     * 列标题
     */
    label: string;

    /**
     * 配置是否固定当前列
     */
    fixed?: 'left' | 'right' | 'none';

    /**
     * 绑定字段名
     */
    name?: string;

    /**
     * 配置查看详情功能
     */
    popOver?: SchemaPopOver;

    /**
     * 配置快速编辑功能
     */
    quickEdit?: SchemaQuickEdit;

    /**
     * 作为表单项时，可以单独配置编辑时的快速编辑面板。
     */
    quickEditOnUpdate?: SchemaQuickEdit;

    /**
     * 配置点击复制功能
     */
    copyable?: SchemaCopyable;

    /**
     * 配置是否可以排序
     */
    sortable?: boolean;

    /**
     * 是否可快速搜索
     */
    searchable?: boolean;

    /**
     * 配置是否默认展示
     */
    toggled?: boolean;

    /**
     * 列宽度
     */
    width?: number | string;

    /**
     * todo
     */
    filterable?:
      | boolean
      | {
          source?: string;
          options?: Array<any>;
        };

    /**
     * 结合表格的 footable 一起使用。
     * 填写 *、xs、sm、md、lg指定 footable 的触发条件，可以填写多个用空格隔开
     */
    breakpoint?: '*' | 'xs' | 'sm' | 'md' | 'lg';

    /**
     * 提示信息
     */
    remark?: SchemaRemark;
  };

  type TableColumnWithType = Schema.SchemaObject & TableColumnObject;

  type TableColumn = TableColumnWithType | TableColumnObject;

  interface TableSchema extends Schema.BaseSchema {
    /**
     * 指定为表格渲染器。
     */
    type: 'table' | 'static-table';

    /**
     * 是否固定表头
     */
    affixHeader?: boolean;

    /**
     * 表格的列信息
     */
    columns?: Array<TableColumn>;

    /**
     * 展示列显示开关，自动即：列数量大于或等于5个时自动开启
     */
    columnsTogglable?: boolean | 'auto';

    /**
     * 是否开启底部展示功能，适合移动端展示
     */
    footable?:
      | boolean
      | {
          expand?: 'first' | 'all' | 'none';

          /**
           * 是否为手风琴模式
           */
          accordion?: boolean;
        };

    /**
     * 底部外层 CSS 类名
     */
    footerClassName?: SchemaClassName;

    /**
     * 顶部外层 CSS 类名
     */
    headerClassName?: SchemaClassName;

    /**
     * 占位符
     */
    placeholder?: string;

    /**
     * 是否显示底部
     */
    showFooter?: boolean;

    /**
     * 是否显示头部
     */
    showHeader?: boolean;

    /**
     * 数据源：绑定当前环境变量
     */
    source?: SchemaTokenizeableString;

    /**
     * 表格 CSS 类名
     */
    tableClassName?: SchemaClassName;

    /**
     * 标题
     */
    title?: string;

    /**
     * 工具栏 CSS 类名
     */
    toolbarClassName?: SchemaClassName;

    /**
     * 合并单元格配置，配置数字表示从左到右的多少列自动合并单元格。
     */
    combineNum?: number;

    /**
     * 合并单元格配置，配置从第几列开始合并。
     */
    combineFromIndex?: number;

    /**
     * 顶部总结行
     */
    prefixRow?: Array<SchemaObject>;

    /**
     * 底部总结行
     */
    affixRow?: Array<SchemaObject>;
  }

  interface TableProps extends Renderer.RendererProps {
    title?: string; // 标题
    header?: SchemaNode;
    footer?: SchemaNode;
    actions?: Action[];
    className?: string;
    headerClassName?: string;
    footerClassName?: string;
    store: ITableStore;
    columns?: Array<any>;
    headingClassName?: string;
    toolbarClassName?: string;
    headerToolbarClassName?: string;
    footerToolbarClassName?: string;
    tableClassName?: string;
    source?: string;
    selectable?: boolean;
    selected?: Array<any>;
    maxKeepItemSelectionLength?: number;
    valueField?: string;
    draggable?: boolean;
    columnsTogglable?: boolean | 'auto';
    affixHeader?: boolean;
    affixColumns?: boolean;
    combineNum?: number | string;
    combineFromIndex?: number;
    footable?:
      | boolean
      | {
          expand?: 'first' | 'all' | 'none';
          expandAll?: boolean;
          accordion?: boolean;
        };
    expandConfig?: {
      expand?: 'first' | 'all' | 'none';
      expandAll?: boolean;
      accordion?: boolean;
    };
    itemCheckableOn?: string;
    itemDraggableOn?: string;
    itemActions?: Array<Action>;
    onSelect: (
      selectedItems: Array<object>,
      unSelectedItems: Array<object>
    ) => void;
    onPristineChange?: (data: object, rowIndexe: string) => void;
    onSave?: (
      items: Array<object> | object,
      diff: Array<object> | object,
      rowIndexes: Array<string> | string,
      unModifiedItems?: Array<object>,
      rowOrigins?: Array<object> | object,
      resetOnFailed?: boolean
    ) => void;
    onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
    onQuery: (values: object) => void;
    onImageEnlarge?: (data: any, target: any) => void;
    buildItemProps?: (item: any, index: number) => any;
    checkOnItemClick?: boolean;
    hideCheckToggler?: boolean;
    rowClassName?: string;
    rowClassNameExpr?: string;
    popOverContainer?: any;
    canAccessSuperData?: boolean;
    reUseRow?: boolean;
  }
}
