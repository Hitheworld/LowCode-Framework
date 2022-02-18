/// <reference path="Root.d.ts" />

// export = LowCode;

// export as namespace LowCode;

// declare namespace LowCode {
//   type ISchemaNode = ISchema | string | Array<ISchema | string>;

//   interface IRenderProps {
//     location?: Location;
//     [propName: string]: any;
//   }

//   interface IRenderOptions {
//     [propName: string]: any;
//   }

//   interface IRendererEnv {
//     [propName: string]: any;
//   }

//   interface IRendererProps {
//     render: (region: string, node: ISchemaNode, props?: any) => JSX.Element;
//     env: IRendererEnv;
//     $path: string; // 当前组件所在的层级信息
//     $schema: any; // 原始 schema 配置
//     syncSuperStore?: boolean;
//     data: {
//       [propName: string]: any;
//     };
//     defaultData?: object;
//     className?: any;
//     [propName: string]: any;
//   }

//   interface IRenderChildProps extends Partial<IRendererProps> {
//     env: IRendererEnv;
//   }

//   interface ISchema {
//     type: string;
//     children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null;
//     [propName: string]: any;
//   }

//   function renderChildren(
//     prefix: string,
//     node: ISchemaNode,
//     props: any
//   ): JSX.Element;

//   function renderChild(
//     prefix: string,
//     node: ISchemaNode,
//     props: IRenderChildProps
//   ): JSX.Element;
// }
