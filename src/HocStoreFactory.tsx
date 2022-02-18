import { useState, useRef, useEffect } from 'react';

export function HocStoreFactory(renderer: HocStoreFactory.Renderer) {
  // HocStoreFactory.Props
  return function <T>(
    Component: HocStoreFactory.Comp<T>,
    props: HocStoreFactory.Props
  ): T | null {
    const renderChild = (
      region: string,
      node: Types.SchemaNode,
      subProps: HocStoreFactory.SubProps = {}
    ) => {
      return props.render(region, node, {
        // data: this.store.data,
        // dataUpdatedAt: this.store.updatedAt,
        ...subProps,
        // scope: this.store.data,
        // store: this.store,
      });
    };

    const { detectField, ...rest } = props;

    let exprProps: any = {};
    if (!detectField || detectField === 'data') {
      // exprProps = getExprProperties(rest, this.store.data, undefined, rest);

      if (exprProps.hidden || exprProps.visible === false) {
        return null;
      }
    }
    return <Component {...rest} {...exprProps} render={renderChild} />;
  };
}
