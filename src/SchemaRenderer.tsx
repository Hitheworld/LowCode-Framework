import React, { useEffect, useRef } from 'react';
import omit from 'lodash/omit';
import { loadRenderer, resolveRenderer } from '@/factory';
import { renderChild, renderChildren } from '@/Root';
import getExprProperties from '@/utils/filter-schema';
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

// 占位符组件 - 防止报错
function PlaceholderComponent(props: any) {
  const { renderChildren, ...rest } = props;
  if (typeof props.renderChildren === 'function') {
    return props.renderChildren(rest);
  }
  return null;
}

export function SchemaRenderer(props: SchemaRenderer.SchemaRendererProps) {
  const renderer = useRef<Renderer.RendererConfig | null>(null);
  // 这个方法用于依据 path 匹配组件
  const currRenderer = (skipResolve = false): any => {
    let schema = props.schema;
    let path = props.$path;

    if (schema?.type && !renderer.current && !skipResolve) {
      // const rendererResolver = props?.env?.rendererResolver || resolveRenderer;
      // const rendererResolver = resolveRenderer;
      renderer.current = resolveRenderer(path, schema);
    } else {
      schema.component = PlaceholderComponent;
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
      // ...rest,
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
          forwardedRef: refFn.current,
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

  const Component = renderer.current?.component;

  return (
    <Component
      {...props}
      {...restSchema}
      $path={$path}
      $schema={{ ...schema }}
      render={currRenderChild}
    />
  );
}
