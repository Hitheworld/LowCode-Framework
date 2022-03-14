import React, { useState, useEffect, useContext, useReducer } from 'react';
import cx from 'classnames';
import { Form } from 'antd';
import { Renderer } from '@/factory';
import { isVisible, bulkBindFunctions } from '@/utils/helper';
import { RootStoreContext } from '@/store';

function FormRenderer(props: any) {
  const {
    wrapWithPanel,
    render,
    title,
    store,
    panelClassName,
    headerClassName,
    footerClassName,
    footerWrapClassName,
    actionsClassName,
    bodyClassName,
    // classnames: cx,
    affixFooter,
    lazyLoad,
    // translate: __,
    footer,
  } = props;

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      这是表单
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {
          render(
            'body',
            {
              type: 'panel',
              title: title,
            },
            {
              // className: cx(panelClassName, 'Panel--form'),
              // children: body,
              // actions: this.buildActions(),
              // onAction: this.handleAction,
              // onQuery: this.handleQuery,
              // disabled: store.loading,
              // btnDisabled: store.loading || store.validating,
              // headerClassName,
              // footer,
              // footerClassName,
              // footerWrapClassName,
              // actionsClassName,
              // bodyClassName,
              // affixFooter,
            }
          ) as JSX.Element
        }
      </Form>
    </>
  );
}

export default Renderer({
  type: 'form',
  isolateScope: true,
})(FormRenderer);
