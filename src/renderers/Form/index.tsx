import React, { useState, useEffect, useContext, useReducer } from 'react';
import cx from 'classnames';
import { Form } from 'antd';
import { Renderer } from '@/factory';
import LazyComponent from '@/components/LazyComponent';
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

  const renderChild = (
    control: Schema.SchemaNode,
    key: any = '',
    otherProps: Partial<Form.FormProps> = {},
    region: string = ''
  ): React.ReactNode => {
    if (!control) {
      return null;
    } else if (typeof control === 'string') {
      control = {
        type: 'tpl',
        tpl: control,
      };
    }
    const currProps = {
      ...props,
      ...otherProps,
    };
    const form = props?.store;
    const {
      render,
      mode,
      horizontal,
      store,
      disabled,
      controlWidth,
      resolveDefinitions,
      lazyChange,
      formLazyChange,
    } = currProps;
    const subProps = {
      formStore: form,
      data: store?.data,
      key: `${(control as Schema.Schema).name || ''}-${
        (control as Schema.Schema).type
      }-${key}`,
      formInited: form?.inited,
      formSubmited: form?.submited,
      formMode: mode,
      formHorizontal: horizontal,
      controlWidth,
      disabled:
        disabled || (control as Schema.Schema).disabled || form?.loading,
      btnDisabled: form?.loading || form?.validating,
      // onAction: this.handleAction,
      // onQuery: this.handleQuery,
      // onChange: this.handleChange,
      // onBulkChange: this.handleBulkChange,
      // addHook: this.addHook,
      // removeHook: this.removeHook,
      // renderFormItems: this.renderFormItems,
      formPristine: form?.pristine,
      // value: (control as any)?.name
      //   ? getVariable(form.data, (control as any)?.name, canAccessSuperData)
      //   : (control as any)?.value,
      // defaultValue: (control as any)?.value
    };
    let subSchema: any = {
      ...control,
    };
    if (subSchema.$ref) {
      subSchema = {
        ...resolveDefinitions(subSchema.$ref),
        ...subSchema,
      };
    }
    lazyChange === false && (subSchema.changeImmediately = true);
    return render(`${region ? `${region}/` : ''}${key}`, subSchema, subProps);
  };

  const renderChildren = (
    children: Array<any>,
    region: string,
    otherProps: Partial<Form.FormProps> = {}
  ) => {
    children = children || [];

    if (!Array.isArray(children)) {
      children = [children];
    }

    if (props.mode === 'row') {
      const ns = props.classPrefix;

      children = flatten(children).filter((item) => {
        if (
          (item as Schema.Schema).hidden ||
          (item as Schema.Schema).visible === false
        ) {
          return false;
        }

        const exprProps = getExprProperties(
          item as Schema.Schema,
          props.store?.data,
          undefined,
          props
        );
        if (exprProps.hidden || exprProps.visible === false) {
          return false;
        }

        return true;
      });

      if (!children.length) {
        return null;
      }

      return (
        <div className={`${ns}Form-row`}>
          {children.map((control, key) =>
            ~['hidden', 'formula'].indexOf((control as any).type) ||
            (control as any).mode === 'inline' ? (
              renderChild(control, key, otherProps)
            ) : (
              <div
                key={key}
                className={cx(
                  `${ns}Form-col`,
                  (control as Schema.Schema).columnClassName
                )}
              >
                {renderChild(control, '', {
                  ...otherProps,
                  mode: 'row',
                })}
              </div>
            )
          )}
        </div>
      );
    }

    return children.map((control, key) =>
      renderChild(control, key, otherProps, region)
    );
  };

  const renderFormItems = (
    schema: Partial<Form.FormSchema> & {
      controls?: Array<any>;
    },
    region: string = '',
    otherProps: Partial<Form.FormProps> = {}
  ) => {
    let body: Array<any> = Array.isArray(schema.body)
      ? schema.body
      : schema.body
      ? [schema.body]
      : [];

    // 旧用法，让 wrapper 走走 compat 逻辑兼容旧用法
    // 后续可以删除。
    if (!body.length && schema.controls) {
      console.warn('请用 body 代替 controls');
      body = [
        {
          size: 'none',
          type: 'wrapper',
          wrap: false,
          controls: schema.controls,
        },
      ];
    }

    return renderChildren(body, region, otherProps);
  };

  const renderBody = () => {
    return (
      <>
        {renderFormItems({
          body: props.body,
        })}
      </>
    );
  };

  let body: JSX.Element = renderBody();

  if (wrapWithPanel) {
    body = render(
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
    ) as JSX.Element;
  }

  if (lazyLoad) {
    body = <LazyComponent>{body}</LazyComponent>;
  }

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
        {body}
      </Form>
    </>
  );
}

export default Renderer({
  type: 'form',
  isolateScope: true,
})(FormRenderer);
