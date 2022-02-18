import { useState } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import { Renderer } from '@/factory';
import { filter } from '@/utils/tpl';

export function filterContents(
  tooltip:
    | string
    | undefined
    | { title?: string; render?: any; content?: string; body?: string },
  data: any
) {
  if (typeof tooltip === 'string') {
    return filter(tooltip, data);
  } else if (tooltip) {
    return tooltip.title
      ? {
          render: tooltip.render ? () => tooltip.render(data) : undefined,
          title: filter(tooltip.title, data),
          content:
            tooltip.content || tooltip.body
              ? filter(tooltip.content || tooltip.body || '', data)
              : undefined,
        }
      : tooltip.content || tooltip.body
      ? filter(tooltip.content || tooltip.body || '', data)
      : undefined;
  }
  return tooltip;
}

function RemarkRenderer(props: Remark.RemarkProps) {
  const {
    className,
    icon,
    label,
    tooltip,
    placement,
    rootClose,
    trigger,
    container,
    classPrefix: ns,
    content,
    data,
    env,
    tooltipClassName,
  } = props;

  const finalIcon = tooltip?.icon ?? icon;
  const finalLabel = tooltip?.label ?? label;

  return (
    <>
      <div
        className={classNames(
          `Remark`,
          (tooltip && tooltip.className) || className || `Remark--warning`
        )}
      >
        {finalLabel ? <span>{finalLabel}</span> : null}
        {/* 
        {finalIcon ? (
          hasIcon(finalIcon) ? (
            <span className={classNames('Remark-icon')}>
              <Icon icon={finalIcon} />
            </span>
          ) : (
            <i className={classNames('Remark-icon', finalIcon)} />
          )
        ) : finalIcon === false && finalLabel ? null : (
          <span className={classNames('Remark-icon icon')}>
            <Icon icon="question-mark" />
          </span>
        )}
        */}
      </div>
    </>
  );
}

RemarkRenderer.defaultProps = {
  icon: '',
  trigger: ['hover', 'focus'] as Array<'hover' | 'click' | 'focus'>,
};

export default Renderer({
  type: 'remark',
})(RemarkRenderer);
