import React, { useState, useEffect, useContext, useReducer } from 'react';
import cx from 'classnames';
import { Layout, Menu, Breadcrumb, Modal } from 'antd';
import { Renderer } from '@/factory';
import { isVisible, bulkBindFunctions } from '@/utils/helper';
import { RootStoreContext } from '@/store';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function PageRenderer(props: any) {
  const {
    title,
    subTitle,
    remark,
    remarkPlacement,
    headerClassName,
    toolbarClassName,
    toolbar,
    // store,
    env,

    className,
    store,
    body,
    bodyClassName,
    render,
    aside,
    asideClassName,
    header,
    showErrorMsg,
    initApi,
    regions,
    style,
    data,
    asideResizor,
    translate: __,

    name,
    value,
    defaultValue,
  } = props;

  const [state, dispatch] = useContext(RootStoreContext);

  // Dislog
  const handleDialogConfirm = (
    values: object[],
    action: Action,
    ...rest: Array<any>
  ) => {
    // super.handleDialogConfirm(values, action, ...rest);
    const scoped = context;
    const store = props.store;
    const dialogAction = store.action as Action;
    const reload = action.reload ?? dialogAction.reload;
    if (reload) {
      scoped.reload(reload, store.data);
    } else {
      // 没有设置，则自动让页面中 crud 刷新。
      scoped
        .getComponents()
        .filter((item: any) => item.props.type === 'crud')
        .forEach((item: any) => item.reload && item.reload());
    }
  };

  const handleDialogClose = () => {
    props?.store?.closeDialog();
  };

  const openFeedback = (dialog: any, ctx: any) => {
    return new Promise((resolve) => {
      store.setCurrentAction({
        type: 'button',
        actionType: 'dialog',
        dialog: dialog,
      });
      store.openDialog(ctx, undefined, (confirmed) => {
        resolve(confirmed);
      });
    });
  };

  const handleAction = (
    e: React.UIEvent<any> | void,
    action: Types.Action,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: Scoped.IScopedContext
  ) => {
    const { env, store, messages, onAction } = props;
    if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(ctx);
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(ctx);
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
      return store
        .saveRemote(action.api as string, ctx, {
          successMessage:
            (action.messages && action.messages.success) ||
            (messages && messages.saveSuccess),
          errorMessage:
            (action.messages && action.messages.failed) ||
            (messages && messages.saveSuccess),
        })
        .then(async () => {
          if (action?.feedback && isVisible(action.feedback, store.data)) {
            await openFeedback(action.feedback, store.data);
          }

          const redirect =
            action.redirect && filter(action.redirect, store.data);
          redirect && env.jumpTo(redirect, action);
          action.reload && this.reloadTarget(action.reload, store.data);
        })
        .catch(() => {});
    } else {
      return onAction(e, action, ctx, throwErrors, delegate || this.context);
    }
  };

  const subProps = {};

  const hasAside = Array.isArray(regions)
    ? ~regions.indexOf('aside')
    : aside && (!Array.isArray(aside) || aside.length);

  return (
    <div className="page">
      <div>Page页面</div>

      <Layout>
        {hasAside ? (
          <>
            {render('aside', aside || '', {
              ...subProps,
              ...(typeof aside === 'string'
                ? {
                    inline: false,
                    className: `Page-asideTplWrapper`,
                  }
                : null),
            })}
          </>
        ) : null}

        <Layout>
          {(Array.isArray(regions) ? ~regions.indexOf('toolbar') : toolbar) ? (
            <Header style={{ padding: 0, background: '#fff' }}>
              {render('toolbar', toolbar || '', subProps)}
            </Header>
          ) : null}

          <Content style={{ margin: '0 16px' }}>
            {state.bcn?.length ? (
              <Breadcrumb style={{ margin: '16px 0' }}>
                {state.bcn?.map((item) => (
                  <Breadcrumb.Item key={item?.path}>
                    {state.bcn?.indexOf(item) === state.bcn?.length - 1 ? (
                      item?.label
                    ) : (
                      <a href={item?.path}>{item?.label}</a>
                    )}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            ) : null}

            {(
              Array.isArray(regions)
                ? ~regions.indexOf('header')
                : title || subTitle
            ) ? (
              <>
                {title ? (
                  <h2 className={cx('Page-title')}>
                    {render('title', title, subProps)}
                    {remark
                      ? render('remark', {
                          type: 'remark',
                          tooltip: remark,
                          placement: remarkPlacement || 'bottom',
                          container: env?.getModalContainer
                            ? env.getModalContainer
                            : undefined,
                        })
                      : null}
                  </h2>
                ) : null}
                {subTitle && (
                  <small className={cx('Page-subTitle')}>
                    {render('subTitle', subTitle, subProps)}
                  </small>
                )}
              </>
            ) : null}

            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
              {(Array.isArray(regions) ? ~regions.indexOf('body') : body)
                ? render('body', body || '', subProps)
                : null}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>

      {render(
        'dialog',
        {
          // ...((store.action as Action) && ((store.action as Action).dialog as object)),
          type: 'dialog',
        },
        {
          key: 'dialog',
          // data: store.dialogData,
          onConfirm: handleDialogConfirm,
          onClose: handleDialogClose,
          // show: store.dialogOpen,
          onAction: handleAction,
          // onQuery: initApi ? handleQuery : undefined,
        }
      )}

      {render(
        'drawer',
        {
          // ...((store.action as Action) &&  ((store.action as Action).drawer as object)),
          // ...dialog,
          type: 'drawer',
        },
        {
          key: 'drawer',
          data: {},
          show: false,
          // data: store.drawerData,
          // onConfirm: this.handleDrawerConfirm,
          // onClose: this.handleDrawerClose,
          // show: store.drawerOpen,
          // onAction: this.handleAction,
          // onQuery: initApi ? this.handleQuery : undefined,
        }
      )}
    </div>
  );
}

export default Renderer({
  type: 'page',
  isolateScope: true,
})(PageRenderer);
