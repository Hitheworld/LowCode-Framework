import React, { useState, useEffect, useContext, useReducer } from 'react';
import cx from 'classnames';
import { Renderer } from '@/factory';
// import { isApiOutdated, isEffectiveApi } from '@/utils/api';
import { isVisible, bulkBindFunctions } from '@/utils/helper';
import { RootStoreContext } from '@/store';

function ServiceRenderer(props: Service.ServiceProps) {
  const {
    render,
    body: schema,
    schemaApi,
    initFetchSchema,
    api,
    ws,
    initFetch,
    initFetchOn,
    store,
    messages: { fetchSuccess, fetchFailed },
    onAction,
    formStore,
    onChange,
  } = props;

  const [state, dispatch] = useContext(RootStoreContext);

  const getInitFetch = () => {
    // if (isEffectiveApi(schemaApi, store.data, initFetchSchema)) {
    //   store
    //     .fetchSchema(schemaApi, store.data, {
    //       successMessage: fetchSuccess,
    //       errorMessage: fetchFailed,
    //     })
    //     .then(this.afterSchemaFetch);
    // }
    // if (isEffectiveApi(api, store.data, initFetch, initFetchOn)) {
    //   store
    //     .fetchInitData(api, store.data, {
    //       successMessage: fetchSuccess,
    //       errorMessage: fetchFailed,
    //     })
    //     .then(this.afterDataFetch);
    // }
    // if (ws) {
    //   this.socket = store.fetchWSData(ws, this.afterDataFetch);
    // }
  };

  useEffect(() => {
    getInitFetch();
  }, []);

  const handleQuery = (query: any) => {
    if (props.api || props.schemaApi) {
      // this.receive(query);
    } else {
      props.onQuery?.(query);
    }
  };

  const handleAction = (
    e: React.UIEvent<any> | void,
    action: Action,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) => {
    if (api && action.actionType === 'ajax') {
      // store.setCurrentAction(action);
      // store
      //   .saveRemote(action.api as string, data, {
      //     successMessage: __(action.messages && action.messages.success),
      //     errorMessage: __(action.messages && action.messages.failed)
      //   })
      //   .then(async (payload: any) => {
      //     this.afterDataFetch(payload);
      //     if (action.feedback && isVisible(action.feedback, store.data)) {
      //       await this.openFeedback(action.feedback, store.data);
      //     }
      //     const redirect =
      //       action.redirect && filter(action.redirect, store.data);
      //     redirect && env.jumpTo(redirect, action);
      //     action.reload && this.reloadTarget(action.reload, store.data);
      //   })
      //   .catch(() => {});
    } else {
      // onAction(e, action, data, throwErrors, delegate || this.context);
    }
  };

  const handleChange = (
    value: any,
    name: string,
    submit?: boolean,
    changePristine?: boolean
  ) => {
    // form 触发的 onChange,直接忽略
    if (typeof name !== 'string') {
      return;
    }

    // (store as IIRendererStore).changeValue?.(name, value);

    // 如果在form底下，则继续向上派送。
    formStore && onChange?.(value, name, submit, changePristine);
  };

  return (
    <>
      <div>{/*  错误提示 */}</div>
      <div className="Service-body">
        {/* {
          render('body', state.schema || schema, {
            key: state.schemaKey || 'body',
            onQuery: handleQuery,
            onAction: handleAction,
            onChange: handleChange,
          }) as JSX.Element
        } */}
      </div>
    </>
  );
}

ServiceRenderer.defaultProps = {
  messages: {
    fetchFailed: 'fetchFailed',
  },
};

ServiceRenderer.propsList = [];

export default Renderer({
  type: 'service',
  isolateScope: true,
})(ServiceRenderer);
