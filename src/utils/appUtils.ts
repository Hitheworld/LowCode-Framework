import { createBrowserHistory, createHashHistory } from 'history';
import { normalizeLink } from '@/utils/normalizeLink';

// 如果想用 browserHistory 请切换下这处代码, 其他不用变
// const history = createBrowserHistory();
export const history = createHashHistory();

/**
 * 适用于app应用
 */

export const updateLocation = (location: any, replace?: boolean) => {
  location = normalizeLink(location, history.location);
  if (location === 'goBack') {
    // return history.goBack();
    return history.back();
  } else if (
    (!/^https?\:\/\//.test(location) &&
      location === history.location.pathname + history.location.search) ||
    location === history.location.href
  ) {
    // 目标地址和当前地址一样，不处理，免得重复刷新
    return;
  } else if (/^https?\:\/\//.test(location) || !history) {
    return (window.location.href = location);
  }

  history[replace ? 'replace' : 'push'](location);
};

export const jumpTo = (to: string, action?: Types.Action) => {
  if (to === 'goBack') {
    // return history.goBack();
    return history.back();
  }
  to = normalizeLink(to, history.location);
  if (isCurrentUrl(to)) {
    console.log('通过-001');
    return;
  }
  if (action?.actionType === 'url') {
    console.log('通过-002');
    action.blank === false
      ? (window.location.href = to)
      : window.open(to, '_blank');
    return;
  } else if (action?.blank) {
    console.log('通过-003');
    window.open(to, '_blank');
    return;
  }
  if (/^https?:\/\//.test(to)) {
    console.log('通过-004');
    window.location.href = to;
  } else if (
    (!/^https?\:\/\//.test(to) &&
      to === history.pathname + history.location.search) ||
    to === history.location.href
  ) {
    console.log('通过-005');
    // do nothing
  } else {
    console.log('通过-006');
    history.push(to);
  }
};

export const isCurrentUrl = (to: string, ctx?: any) => {
  if (!to) {
    return false;
  }
  const pathname = history.location.pathname;
  const link = normalizeLink(to, {
    // ...location,
    ...history.location,
    pathname,
    hash: '',
  });

  if (!~link.indexOf('http') && ~link.indexOf(':')) {
    let strict = ctx && ctx.strict;
    return match(link, {
      decode: decodeURIComponent,
      strict: typeof strict !== 'undefined' ? strict : true,
    })(pathname);
  }

  return decodeURI(pathname) === link;
};
