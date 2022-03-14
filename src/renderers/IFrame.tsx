import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useReducer,
} from 'react';
import cx from 'classnames';
import { Table } from 'antd';
import { Renderer } from '@/factory';
import { isVisible, bulkBindFunctions } from '@/utils/helper';
import { buildApi, isApiOutdated } from '@/utils/api';
import { isPureVariable, resolveVariableAndFilter } from '@/utils/tpl-builtin';
import { RootStoreContext } from '@/store';

function IFrameRenderer(props: IFrame.IFrameProps) {
  const {
    events,
    onAction,
    data,
    src,
    width,
    height,
    className,
    frameBorder,
    style,
  } = props;

  const [currWidth, setCurrWidth] = useState('');
  const [currHeight, setCurrHeight] = useState('');
  const onMessage = (e: MessageEvent) => {
    if (typeof e?.data?.type !== 'string' || !events) {
      return;
    }
    const [prefix, type] = e.data.type.split(':');
    if (prefix !== 'amis' || !type) {
      return;
    }
    if (type === 'resize' && e.data.data) {
      setCurrWidth(e.data.data.width || '100%');
      setCurrHeight(e.data.data.height || '100%');
    } else {
      const action = events[type];
      action && onAction(e, action, createObject(data, e.data.data));
    }
  };

  const onLoad = () => {
    src && postMessage('init', data);
  };

  const iFrameRef = useRef(null);
  const postMessage = (type: string, data: any) => {
    (iFrameRef.current as HTMLIFrameElement)?.contentWindow?.postMessage(
      {
        type: `amis:${type}`,
        data,
      },
      '*'
    );
  };

  const receive = (values: object) => {
    const newData = createObject(data, values);
    postMessage('receive', newData);
    if (isApiOutdated(src, src, data, newData)) {
      (iFrameRef.current as HTMLIFrameElement).src = buildApi(src, newData).url;
    }
  };

  const reload = (subpath?: any, query?: any) => {
    if (query) {
      return receive(query);
    }
    if (src) {
      (iFrameRef.current as HTMLIFrameElement).src = buildApi(src, data).url;
    }
  };

  useEffect(() => {
    setCurrWidth(width || '100%');
    setCurrHeight(height || '100%');
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useEffect(() => {
    postMessage('update', data);
  }, [data]);

  useEffect(() => {
    setCurrWidth(width || '100%');
    setCurrHeight(height || '100%');
  }, [width, height]);

  let tempStyle: any = {};

  width !== void 0 && (tempStyle.width = width);
  height !== void 0 && (tempStyle.height = height);

  const currStyle = {
    ...tempStyle,
    ...style,
  };

  if (isPureVariable(src)) {
    src = resolveVariableAndFilter(src, data, '| raw');
  }

  const finalSrc = src ? buildApi(src, data).url : undefined;

  if (
    typeof finalSrc === 'string' &&
    finalSrc &&
    !/^(\.\/|\.\.\/|\/|https?\:\/\/|\/\/)/.test(finalSrc)
  ) {
    return <p>请填写合法的 iframe 地址</p>;
  }

  return (
    <iframe
      className={className}
      frameBorder={frameBorder}
      style={currStyle}
      ref={iFrameRef}
      onLoad={onLoad}
      src={finalSrc}
    />
  );
}

export default Renderer({
  type: 'iframe',
})(IFrameRenderer);
