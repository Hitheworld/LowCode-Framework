import React, { useState, useEffect, useContext, useReducer } from 'react';
import cx from 'classnames';
import { Form } from 'antd';
import { Renderer } from '@/factory';
import { isVisible, bulkBindFunctions } from '@/utils/helper';
import { RootStoreContext } from '@/store';

function FormRenderer(props: any) {
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
      ></Form>
    </>
  );
}

export default Renderer({
  type: 'form',
  isolateScope: true,
})(FormRenderer);
