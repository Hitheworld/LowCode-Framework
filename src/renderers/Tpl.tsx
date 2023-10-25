import { Renderer } from '@/factory';

const enginers: {
  [propName: string]: Tpl.Enginer;
} = {};
function filter(tpl?: any, data: object = {}, ...rest: Array<any>): string {
  if (!tpl || typeof tpl !== 'string') {
    return '';
  }

  let keys = Object.keys(enginers);
  for (let i = 0, len = keys.length; i < len; i++) {
    let enginer = enginers[keys[i]];
    if (enginer.test(tpl)) {
      return enginer.compile(tpl, data, ...rest);
    } else if (enginer.removeEscapeToken) {
      tpl = enginer.removeEscapeToken(tpl);
    }
  }

  return tpl;
}

const entityMap: {
  [propName: string]: string;
} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};
export const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });

export function formatDuration(value: number): string {
  const unit = ['秒', '分', '时', '天', '月', '季', '年'];
  const steps = [1, 60, 3600, 86400, 2592000, 7776000, 31104000];
  let len = steps.length;
  const parts = [];

  while (len--) {
    if (steps[len] && value >= steps[len]) {
      parts.push(Math.floor(value / steps[len]) + unit[len]);
      value %= steps[len];
    } else if (len === 0 && value) {
      parts.push((value.toFixed ? value.toFixed(2) : '0') + unit[0]);
    }
  }

  return parts.join('');
}

function Tpl(props: any) {
  const { tpl, html, text, raw, data, placeholder, wrapperComponent, inline } =
    props;
  const getContent = () => {
    // const value = getPropValue(props);
    const value = '';
    if (raw) {
      console.log("==============1,raw:", raw);
      return raw;
    } else if (html) {
      console.log("==============2,html:", html, data);
      return filter(html, data);
    } else if (tpl) {
      console.log("==============3,html:", tpl, data);
      return filter(tpl, data);
    } else if (text) {
      console.log("==============4,html:", text, data);
      return escapeHtml(filter(text, data));
    } else {
      console.log("==============5,value:", value);
      return value == null || value === ''
        ? `<span class="text-muted">${placeholder}</span>`
        : typeof value === 'string'
        ? value
        : JSON.stringify(value);
    }
  };
  const Component = wrapperComponent || (inline ? 'span' : 'div');

  return <Component>{getContent()}</Component>;
}

export default Renderer({
  test: /(^|\/)(?:tpl|html)$/,
  name: 'tpl',
})(Tpl);
