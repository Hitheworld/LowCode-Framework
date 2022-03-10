import isPlainObject from 'lodash/isPlainObject';
import { useState, useRef, useEffect, useReducer } from 'react';
import { SchemaRenderer } from './SchemaRenderer';
import { RootRenderer } from './RootRenderer';
import {
  RootStoreContext,
  combineReducers,
  multipleReducer,
  multipleState,
} from '@/store';

export function renderChildren(
  prefix: string,
  node: Types.SchemaNode,
  props: Root.RenderChildProps
): Root.ReactElement {
  if (Array.isArray(node)) {
    return node.map((node, index) =>
      renderChild(`${prefix}/${index}`, node, {
        ...props,
        key: `${props.key ? `${props.key}-` : ''}${index}`,
      })
    );
  }
  return renderChild(prefix, node, props);
}

export function renderChild(
  prefix: string,
  node: Types.SchemaNode,
  props: Root.RenderChildProps
): Root.ReactElement {
  if (Array.isArray(node)) {
    return renderChildren(prefix, node, props);
  }
  const typeofnode = typeof node;
  if (typeofnode === 'undefined' || node === null) {
    return null;
  }
  let schema: Types.Schema =
    typeofnode === 'string' || typeofnode === 'number'
      ? { type: 'tpl', tpl: String(node) }
      : (node as Types.Schema);

  return (
    <SchemaRenderer
      {...props}
      schema={schema}
      $path={`${prefix ? `${prefix}/` : ''}${(schema && schema.type) || ''}`}
    />
  );
}

// 再将多个reduce通过combineReducers方法合并
const reducer = combineReducers(multipleReducer);

export default function Root(props: Root.RootProps) {
  const {
    schema,
    rootStore,
    env,
    pathPrefix,
    location,
    data,
    // locale,
    // translate,
    ...rest
  } = props;

  const resolveDefinitions = (name: string) => {
    const definitions = (schema as Schema.Schema).definitions;
    if (!name || isEmpty(definitions)) {
      return {};
    }
    return definitions && definitions[name];
  };

  const theme = env?.theme;
  let themeName = props.theme || 'cxd';
  if (themeName === 'default') {
    themeName = 'cxd';
  }

  const [state, dispatch] = useReducer(multipleReducer, multipleState);

  return (
    <RootStoreContext.Provider value={[state, dispatch]}>
      <RootRenderer
        pathPrefix={pathPrefix || ''}
        schema={
          isPlainObject(schema)
            ? {
                type: 'page',
                ...(schema as any),
              }
            : schema
        }
        {...rest}
        rootStore={rootStore}
        resolveDefinitions={resolveDefinitions}
        location={location}
        data={data}
        env={env}
        classnames={theme?.classnames}
        classPrefix={theme?.classPrefix}
        // locale={locale}
        // translate={translate}
      />
    </RootStoreContext.Provider>
  );
}
