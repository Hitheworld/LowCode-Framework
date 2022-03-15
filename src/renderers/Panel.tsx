import React from 'react';
import { Card } from 'antd';
import { Renderer, registerRenderer } from '@/factory';

export function PanelRenderer(props: Panel.PanelProps) {
  const {
    type,
    className,
    data,
    header,
    body,
    render,
    bodyClassName,
    headerClassName,
    actionsClassName,
    footerClassName,
    footerWrapClassName,
    children,
    title,
    footer,
    affixFooter,
    classPrefix: ns,
    classnames: cx,
    ...rest
  } = props;

  const subProps = {
    data,
    ...rest,
  };

  const renderBody = () => {
    return children
      ? typeof children === 'function'
        ? children(this.props)
        : children
      : body
      ? render('body', body, subProps)
      : null;
  };

  return <Card>{renderBody()}</Card>;
}

export default Renderer({
  type: 'panel',
  isolateScope: true,
})(PanelRenderer);
