import React from 'react';
import ReactDOM from 'react-dom';
import * as dayjs from 'dayjs';
import * as isLeapYear from 'dayjs/plugin/isLeapYear'; // import plugin
import 'dayjs/locale/zh-cn'; // import locale
import { mainRender } from './factory';
import { fetcherApi, isCancel } from './api/fetcher';
import { isCurrentUrl, jumpTo, updateLocation } from './routes/routeUtils';
import { history } from '@/utils/appUtils';
import './index.less';

import '@/renderers/App';
import '@/renderers/Page';
import '@/renderers/Tpl';
import '@/renderers/Nav';
import '@/renderers/Breadcrumb';
import '@/renderers/Dialog';
import '@/renderers/Drawer';
import '@/renderers/Remark';
import '@/renderers/Action';

// 临时解决 antd "findDOMNode" 问题,生产环境不影响
// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (errObj, ...args) => {
  if (
    process.env.NODE_ENV === 'development' &&
    typeof errObj.message === 'string' &&
    args.includes('findDOMNode')
  ) {
    // 返回；
    // 控制台错误（errObj ， ... args;
  }
};

dayjs.extend(isLeapYear); // use plugin
dayjs.locale('zh-cn'); // use locale

export function embed(
  container: string | HTMLElement,
  schema: any,
  props: any,
  env: any
) {
  if (typeof container === 'string') {
    container = document.querySelector(container) as HTMLElement;
  }
  if (!container) {
    console.error('选择器不对，页面上没有此元素');
    return;
  } else if (container.tagName === 'BODY') {
    let div = document.createElement('div');
    container.appendChild(div);
    container = div;
  }

  const defaultEnv = {
    fetcher: (api: any) => fetcherApi(defaultEnv, api),
    isCancel,
    isCurrentUrl,
    jumpTo,
    updateLocation,
    ...env,
  };

  function createElements(props: any) {
    const newProps = {
      location: history,
      ...props,
    };
    return (
      <React.StrictMode>
        {mainRender(schema, newProps, defaultEnv)}
      </React.StrictMode>
    );
  }

  ReactDOM.render(createElements(props), container);
}
