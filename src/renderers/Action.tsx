import { useState, useEffect } from 'react';
import { Button } from 'antd';
import pick from 'lodash/pick';
import classNames from 'classnames';
import { Renderer } from '@/factory';
import { filter } from '@/utils/tpl';
import { filterContents } from './Remark';

const ActionProps = [
  'dialog',
  'drawer',
  'url',
  'link',
  'confirmText',
  'tooltip',
  'disabledTip',
  'className',
  'asyncApi',
  'redirect',
  'size',
  'level',
  'primary',
  'feedback',
  'api',
  'blank',
  'tooltipPlacement',
  'to',
  'cc',
  'bcc',
  'subject',
  'body',
  'content',
  'required',
  'type',
  'actionType',
  'label',
  'icon',
  'rightIcon',
  'reload',
  'target',
  'close',
  'messages',
  'mergeData',
  'index',
  'copy',
  'payload',
  'requireSelected',
];

const allowedType = ['button', 'submit', 'reset'];

function Action(props: Action.ActionProps) {
  const {
    type,
    icon,
    iconClassName,
    rightIcon,
    rightIconClassName,
    primary,
    size,
    level,
    countDownTpl,
    block,
    className,
    componentClass,
    tooltip,
    disabledTip,
    tooltipPlacement,
    actionType,
    link,
    data,
    translate: __,
    activeClassName,
    isCurrentUrl,
    isMenuItem,
    active,
    activeLevel,
    tooltipContainer,
    onAction,
    disabled,
    countDown,
  } = props;

  const localStorageKey = 'amis-countdownend-' + (props.name || '');
  // 是否在倒计时
  const [inCountDown, setInCountDown] = useState<boolean>(false);
  // 倒计时结束的精确时间
  const [countDownEnd, setCountDownEnd] = useState<number>(0);
  // 倒计时剩余时间
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const _countDownEnd = parseInt(
      localStorage.getItem(localStorageKey) || '0'
    );
    if (_countDownEnd && props.countDown) {
      if (Date.now() < _countDownEnd) {
        setInCountDown(true);
        setCountDownEnd(_countDownEnd);
        setTimeLeft(Math.floor((_countDownEnd - Date.now()) / 1000));
        handleCountDown();
      }
    }
  }, []);

  const handleCountDown = () => {
    // setTimeout 一般会晚于 1s，经过几十次后就不准了，所以使用真实时间进行 diff
    const _timeLeft = Math.floor((countDownEnd - Date.now()) / 1000);
    if (_timeLeft <= 0) {
      setInCountDown(false);
      setTimeLeft(_timeLeft);
    } else {
      setTimeLeft(_timeLeft);
      setTimeout(() => {
        handleCountDown();
      }, 1000);
    }
  };

  const handleAction = async (e: React.MouseEvent<any>) => {
    // https://reactjs.org/docs/legacy-event-pooling.html
    e.persist();
    let onClick = props.onClick;
    if (typeof onClick === 'string') {
      onClick = str2AsyncFunction(onClick, 'event', 'props');
    }
    const result: any = onClick && (await onClick(e, props));
    if (
      disabled ||
      e.isDefaultPrevented() ||
      result === false ||
      !onAction ||
      inCountDown
    ) {
      return;
    }

    e.preventDefault();
    const action = pick(props, ActionProps) as Action.ActionSchema;
    onAction(e, action);

    if (countDown) {
      const _countDownEnd = Date.now() + countDown * 1000;
      setInCountDown(true);
      setCountDownEnd(_countDownEnd);
      setTimeLeft(countDown);
      localStorage.setItem(localStorageKey, String(_countDownEnd));
      setTimeout(() => {
        handleCountDown();
      }, 1000);
    }
  };

  let label = props?.label;
  // let disabled = props?.disabled || false;
  let isActive = !!active;

  if (actionType === 'link' && !isActive && link && isCurrentUrl) {
    isActive = isCurrentUrl(link);
  }

  // 倒计时
  if (inCountDown) {
    label = filterContents(countDownTpl, {
      ...data,
      timeLeft: timeLeft,
    }) as string;
    // disabled = true;
  }

  // const iconElement = generateIcon(cx, icon, 'Button-icon', iconClassName);
  // const rightIconElement = generateIcon(
  //     cx,
  //     rightIcon,
  //     'Button-icon',
  //     rightIconClassName
  //   );

  return (
    <Button
      className={classNames(className, {
        [activeClassName || 'is-active']: isActive,
      })}
      size={size}
      type={type && ~allowedType.indexOf(type) ? type : 'button'}
      // disabled={disabled}
      onClick={handleAction}
    >
      {label ? <span>{filter(String(label), data)}</span> : null}
    </Button>
  );
}

Action.defaultProps = {
  type: 'button' as 'button',
  componentClass: 'button' as React.ReactType,
  tooltipPlacement: 'bottom' as 'bottom',
  activeClassName: 'is-active',
  countDownTpl: 'Action.countDown',
  countDown: 0,
};

function ActionRenderer(props: Action.ActionRendererProps) {
  const { env, disabled, btnDisabled, ...rest } = props;

  const handleAction = (
    e: React.MouseEvent<any> | void | null,
    action: any
  ) => {
    const { onAction, data, ignoreConfirm } = props;

    if (!ignoreConfirm && action.confirmText && env.confirm) {
      env
        .confirm(filter(action.confirmText, data))
        .then((confirmed: boolean) => confirmed && onAction(e, action, data));
    } else {
      if (onAction) onAction(e, action, data);
    }
  };

  const isCurrentAction = (link: string) => {
    return env.isCurrentUrl(filter(link, props.data));
  };

  return (
    <Action
      {...(rest as any)}
      disabled={disabled || btnDisabled}
      onAction={handleAction}
      isCurrentUrl={isCurrentAction}
      tooltipContainer={
        env.getModalContainer ? env.getModalContainer : undefined
      }
    />
  );
}

export const buttonRenderer = Renderer({
  type: 'button',
})(ActionRenderer);

export const submitRenderer = Renderer({
  type: 'submit',
})(ActionRenderer);

export const resetRenderer = Renderer({
  type: 'reset',
})(ActionRenderer);
