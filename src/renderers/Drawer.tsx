import React, { useState } from 'react';
import { Drawer } from 'antd';
import { Renderer } from '@/factory';

function DrawerRenderer(props: Drawer.DrawerProps) {
  const {
    actions,
    body,
    bodyClassName,
    closeOnEsc,
    name,
    size,
    title,
    position,
    header,
    footer,
    confirm,
    resizable,
    overlay,
    closeOnOutside,
    showErrorMsg,
    onClose,
    onConfirm,
    children,
    wrapperComponent,
    lazySchema,
    store,
    show,
    drawerContainer,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(show);

  const handleOk = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCancel = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <Drawer
      title="Basic Modal"
      placement={position}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      Drawer弹出层
    </Drawer>
  );
}

DrawerRenderer.propsList = [
  'title',
  'size',
  'closeOnEsc',
  'closeOnOutside',
  'children',
  'bodyClassName',
  'confirm',
  'position',
  'onClose',
  'onConfirm',
  'show',
  'resizable',
  'overlay',
  'body',
  'popOverContainer',
  'showErrorMsg',
];

DrawerRenderer.defaultProps = {
  title: '',
  bodyClassName: '',
  confirm: true,
  position: 'right',
  resizable: false,
  overlay: true,
  closeOnEsc: false,
  closeOnOutside: false,
  showErrorMsg: true,
};

export default Renderer({
  type: 'drawer',
  // storeType: ModalStore.name,
  // storeExtendsData: false,
  // isolateScope: true,
  // shouldSyncSuperStore: (store: IServiceStore, props: any, prevProps: any) =>
  //   !!(
  //     (store.drawerOpen || props.show) &&
  //     (props.show !== prevProps.show ||
  //       isObjectShallowModified(prevProps.data, props.data))
  //   )
})(DrawerRenderer);
