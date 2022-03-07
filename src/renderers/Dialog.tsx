import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { Renderer } from '@/factory';

function Dialog(props: Dialog.DialogProps) {
  const {
    actions,
    body,
    bodyClassName,
    closeOnEsc,
    closeOnOutside,
    name,
    size,
    title,
    header,
    headerClassName,
    footer,
    confirm,
    showCloseButton,
    showErrorMsg,
    onClose,
    onConfirm,
    children,
    store,
    show,
    lazyRender,
    lazySchema,
    wrapperComponent,
    render,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(show);

  const handleOk = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCancel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderBody = (key?: any): React.ReactNode => {
    if (Array.isArray(body)) {
      return body?.map((body, key) => renderBody(key));
    }
    let subProps: any = {
      key,
      // disabled: (body && (body as any).disabled) || store.loading,
      // onAction: handleAction,
      // onFinished: handleChildFinished,
      // popOverContainer: getPopOverContainer,
      // affixOffsetTop: 0,
      // onChange: handleFormChange,
      // onInit: handleFormInit,
      // onSaved: handleFormSaved,
    };

    if (!(body as Types.Schema)?.type) {
      return render(`body${key ? `/${key}` : ''}`, body, subProps);
    }

    let schema: Types.Schema = body as Types.Schema;

    if (schema?.type === 'form') {
      schema = {
        mode: 'horizontal',
        wrapWithPanel: false,
        submitText: null,
        ...schema,
      };
    }
    console.log('dialog=====2');

    return render(`body${key ? `/${key}` : ''}`, schema, subProps);
  };

  return (
    <Modal
      title="Basic Modal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {renderBody('body')}
    </Modal>
  );
}

Dialog.propsList = [
  'title',
  'size',
  'closeOnEsc',
  'closeOnOutside',
  'children',
  'bodyClassName',
  'headerClassName',
  'confirm',
  'onClose',
  'onConfirm',
  'show',
  'body',
  'showCloseButton',
  'showErrorMsg',
  'actions',
  'popOverContainer',
];

Dialog.defaultProps = {
  title: '弹框',
  bodyClassName: '',
  confirm: true,
  show: false,
  lazyRender: false,
  showCloseButton: true,
  wrapperComponent: Modal,
  closeOnEsc: false,
  closeOnOutside: false,
  showErrorMsg: true,
};

export default Renderer({
  type: 'dialog',
  // storeType: ModalStore.name,
  // storeExtendsData: false,
  // isolateScope: true,
  // shouldSyncSuperStore: (store: IServiceStore, props: any, prevProps: any) =>
  //   !!(
  //     (store.dialogOpen || props.show) &&
  //     (props.show !== prevProps.show ||
  //       isObjectShallowModified(prevProps.data, props.data))
  //   ),
})(Dialog);
