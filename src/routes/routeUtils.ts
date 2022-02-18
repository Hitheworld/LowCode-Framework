import { match } from 'path-to-regexp';
import qs from 'qs';
import { normalizeLink } from '@/utils/normalizeLink';

/**
 * 判断是否为当前Url
 */
export function isCurrentUrl(to: string, ctx?: any) {
  const link = normalizeLink(to);
  const location = window.location;
  let pathname = link;
  let search = '';
  const idx = link.indexOf('?');
  if (~idx) {
    pathname = link.substring(0, idx);
    search = link.substring(idx);
  }
  if (search) {
    if (pathname !== location.pathname || !location.search) {
      return false;
    }
    const query = qs.parse(search.substring(1));
    const currentQuery = qs.parse(location.search.substring(1));
    return Object.keys(query).every((key) => query[key] === currentQuery[key]);
  } else if (pathname === location.pathname) {
    return true;
  } else if (!~pathname.indexOf('http') && ~pathname.indexOf(':')) {
    return match(link, {
      decode: decodeURIComponent,
      strict: ctx?.strict ?? true,
    })(location.pathname);
  }
  return false;
}

/**
 * 跳转
 */
export function jumpTo(to: string, action?: any) {
  if (to === 'goBack') {
    return window.history.back();
  }
  to = normalizeLink(to);
  if (action && action.actionType === 'url') {
    action.blank === false ? (window.location.href = to) : window.open(to);
    return;
  }
  // 主要是支持 nav 中的跳转
  if (action && to && action.target) {
    window.open(to, action.target);
    return;
  }
  if (/^https?:\/\//.test(to)) {
    window.location.replace(to);
  } else {
    location.href = to;
  }
}

/**
 * 刷新路由
 */
export function updateLocation(to: any, replace: boolean) {
  if (to === 'goBack') {
    return window.history.back();
  }
  if (replace && window.history.replaceState) {
    window.history.replaceState('', document.title, to);
    return;
  }
  location.href = normalizeLink(to);
}
