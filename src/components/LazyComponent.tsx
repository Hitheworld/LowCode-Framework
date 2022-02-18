import React, { useState, useEffect, useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Spin } from 'antd';

function LazyComponent(props: LazyComponent.LazyComponentProps) {
  const {
    placeholder,
    unMountOnHidden,
    childProps,
    visiblilityProps,
    partialVisibility,
    children,
    ...rest
  } = props;

  const [component, setComponent] = useState<React.ReactNode | string>(
    props.component
  );
  const [visible, setVisible] = useState<boolean>(false);
  const mounted = useRef<boolean>(false);
  useEffect(() => {
    mounted.current = true;
    setComponent(props?.component);
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleVisibleChange = (is: boolean) => {
    setVisible(is);
    if (!is || component || !props.getComponent) {
      return;
    }
    props
      .getComponent()
      .then(
        (_comp) =>
          mounted.current &&
          typeof _comp === 'function' &&
          setComponent(() => _comp)
      )
      .catch(
        (reason) =>
          mounted.current &&
          setComponent(() => (
            <div className="alert alert-danger">{String(reason)}</div>
          ))
      );
  };

  console.log('Component:', props?.component);

  const Component = component;
  // 需要监听从可见到不可见。
  if (unMountOnHidden) {
    return (
      <VisibilitySensor
        {...visiblilityProps}
        partialVisibility={partialVisibility}
        onChange={handleVisibleChange}
      >
        <div className="visibility-sensor">
          {Component && visible ? (
            <Component {...rest} {...childProps} />
          ) : children && visible ? (
            children
          ) : (
            placeholder
          )}
        </div>
      </VisibilitySensor>
    );
  }

  if (!visible) {
    return (
      <VisibilitySensor
        {...visiblilityProps}
        partialVisibility={partialVisibility}
        onChange={handleVisibleChange}
      >
        <div className="visibility-sensor">{placeholder}</div>
      </VisibilitySensor>
    );
  } else if (Component) {
    // 只监听不可见到可见，一旦可见了，就销毁检查。
    return <Component {...rest} {...childProps} />;
  } else if (children) {
    return children;
  }

  return <div>{placeholder}</div>;
}

LazyComponent.defaultProps = {
  placeholder: <Spin />,
  unMountOnHidden: false,
  partialVisibility: true,
};

export default LazyComponent;
