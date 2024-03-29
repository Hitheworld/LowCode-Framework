import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import omit from 'lodash/omit';
import { loadRenderer, resolveRenderer, filterSchema } from '@/factory';
import { renderChild, renderChildren } from '@/Root';
import getExprProperties from '@/utils/filter-schema';
import { SimpleMap } from '@/utils/SimpleMap';
import LazyComponent from '@/components/LazyComponent';

const defaultOmitList = [
  'type',
  'name',
  '$ref',
  'className',
  'data',
  'children',
  'ref',
  'visible',
  'visibleOn',
  'hidden',
  'hiddenOn',
  'disabled',
  'disabledOn',
  'component',
  'detectField',
  'defaultValue',
  'defaultData',
  'required',
  'requiredOn',
  'syncSuperStore',
  'mode',
  'body',
];

const componentCache: SimpleMap = new SimpleMap();

// 占位符组件 - 防止报错
function PlaceholderComponent(props: any) {
  const { renderChildren, ...rest } = props;
  if (typeof props.renderChildren === 'function') {
    return props.renderChildren(rest);
  }
  return null;
}

function SchemaRenderer(props: SchemaRenderer.SchemaRendererProps, ref: any) {
  const renderer = useRef<Renderer.RendererConfig | null>(null);
  const rendererKey = useRef('');
  // 这个方法用于依据 path 匹配组件
  const currRenderer = (skipResolve = false): any => {
    let schema = props.schema;
    let path = props.$path;

    if (schema && schema.$ref) {
      schema = {
        ...props.resolveDefinitions(schema.$ref),
        ...schema,
      };

      path = path.replace(/(?!.*\/).*/, schema.type);
    }

    if (
      schema?.type &&
      (skipResolve ||
        !renderer.current ||
        rendererKey.current !== `${schema.type}-${schema.$$id}`)
    ) {
      const rendererResolver = props?.env?.rendererResolver || resolveRenderer;
      renderer.current = rendererResolver(path, schema);
      rendererKey.current = `${schema.type}-${schema.$$id}`;
    } else {
      // 自定义组件如果在节点设置了 label name 什么的，就用 formItem 包一层
      // 至少自动支持了 valdiations, label, description 等逻辑。
      if (schema.children && !schema.component && schema.asFormItem) {
        schema.component = PlaceholderComponent;
        schema.renderChildren = schema.children;
        delete schema.children;
      }
      if (
        schema.component &&
        !schema.component.wrapedAsFormItem &&
        schema.asFormItem
      ) {
        const cache = componentCache.get(schema.component);

        if (cache) {
          schema.component = cache;
        } else {
          // const cache = asFormItem({
          //   strictMode: false,
          //   ...schema.asFormItem,
          // })(schema.component);
          componentCache.set(schema.component, cache);
          cache.wrapedAsFormItem = true;
          schema.component = cache;
        }
      }
    }

    return { path, schema };
  };

  const currRenderChild = (
    region: string,
    node?: Types.SchemaNode,
    subProps: {
      data?: object;
      [propName: string]: any;
    } = {}
  ) => {
    let { schema: _, $path: __, env, ...rest } = props;
    let { path: $path } = currRenderer();
    const omitList = defaultOmitList.concat();
    if (renderer.current) {
      const Component = renderer.current.component;
      Component.propsList &&
        omitList.push.apply(omitList, Component.propsList as Array<string>);
    }

    return renderChild(`${$path}${region ? `/${region}` : ''}`, node || '', {
      ...omit(rest, omitList),
      ...subProps,
      data: subProps.data || rest.data,
      env: env,
    });
  };

  const reRender = () => {
    currRenderer(true);
  };

  let { $path: _, schema: __, ...rest } = props;

  if (__ == null) {
    return null;
  }

  let { path: $path, schema } = currRenderer();

  const {
    data: defaultData,
    value: defaultValue,
    activeKey: defaultActiveKey,
    ...restSchema
  } = schema;

  if (Array.isArray(schema)) {
    return renderChildren($path, schema as any, rest) as JSX.Element;
  }

  const detectData =
    schema &&
    (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);

  const exprProps: any = detectData
    ? getExprProperties(schema, detectData, undefined, rest)
    : {};

  if (
    exprProps &&
    (exprProps.hidden ||
      exprProps.visible === false ||
      schema.hidden ||
      schema.visible === false ||
      rest.hidden ||
      rest.visible === false)
  ) {
    (rest as any).invisible = true;
  }

  const refFn = useRef(null);
  if (schema.children) {
    return rest.invisible
      ? null
      : React.isValidElement(schema.children)
      ? schema.children
      : (schema.children as Function)({
          ...rest,
          ...exprProps,
          $path: $path,
          $schema: schema,
          render: currRenderChild,
          // forwardedRef: refFn.current,
          forwardedRef: ref,
        });
  }

  // if (typeof schema.component === 'function') {
  //   const isSFC = !(schema.component.prototype instanceof React.Component);
  //   // const {
  //   //   data: defaultData,
  //   //   value: defaultValue,
  //   //   activeKey: defaultActiveKey,
  //   //   ...restSchema
  //   // } = schema;
  //   return rest.invisible
  //     ? null
  //     : React.createElement(schema.component as any, {
  //         ...rest,
  //         ...restSchema,
  //         ...exprProps,
  //         defaultData,
  //         defaultValue,
  //         defaultActiveKey,
  //         $path: $path,
  //         $schema: schema,
  //         ref: isSFC ? undefined : refFn.current,
  //         forwardedRef: isSFC ? refFn.current : undefined,
  //         render: currRenderChild,
  //       });
  // }

  if (Object.keys(schema).length === 0) {
    return null;
  }

  if (!renderer.current) {
    return rest.invisible ? null : (
      <LazyComponent
        {...rest}
        {...exprProps}
        getComponent={async () => {
          const result = await rest.env.loadRenderer(schema, $path, reRender);
          if (result && typeof result === 'function') {
            return result;
          } else if (result && React.isValidElement(result)) {
            return () => result;
          }
          reRender();
          return () => loadRenderer(schema, $path);
        }}
        $path={$path}
        $schema={schema}
        retry={reRender}
      />
    );
  }

  schema = filterSchema(schema, renderer.current, rest);
  // const {
  //   data: defaultData,
  //   value: defaultValue,
  //   activeKey: defaultActiveKey,
  //   ...restSchema
  // } = schema;

  // 原来表单项的 visible: false 和 hidden: true 表单项的值和验证是有效的
  // 而 visibleOn 和 hiddenOn 是无效的，
  // 这个本来就是个bug，但是已经被广泛使用了
  // 我只能继续实现这个bug了
  if (
    rest.invisible &&
    (exprProps.hidden ||
      exprProps.visible === false ||
      !renderer.current.isFormItem ||
      (schema.visible !== false && !schema.hidden))
  ) {
    return null;
  }

  const Component = renderer.current?.component;

  return (
    <Component
      {...props}
      {...restSchema}
      // {...chainEvents(rest, restSchema)}
      {...exprProps}
      defaultData={restSchema.defaultData ?? defaultData}
      defaultValue={restSchema.defaultValue ?? defaultValue}
      defaultActiveKey={defaultActiveKey}
      $path={$path}
      $schema={{ ...schema, ...exprProps }}
      // ref={refFn}
      ref={ref}
      render={currRenderChild}
    />
  );
}

export default forwardRef(SchemaRenderer);