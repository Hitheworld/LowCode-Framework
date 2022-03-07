import React, { useState, useEffect, useContext, useReducer } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { initialState, reducer } from '@/store/app';
import { AppActions } from '@/store/app';
import { Renderer, EnvContext } from '@/factory';
import { useRequest } from '@/hooks/useRequest';
import AsideNav from '@/components/AsideNav';
import NotFound from '@/components/NotFound';
import { isCurrentUrl } from '@/utils/appUtils';
import { RootStoreContext } from '@/store';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Page(props: any) {
  const { asideBefore, asideAfter, render, env } = props;

  console.log('App-props:', props);

  const [state, dispatch] = useContext(RootStoreContext);

  const { initLoading, initData } = useRequest(props?.api);
  useEffect(() => {
    if (initData) {
      dispatch({
        type: AppActions.SET_PAGES,
        payload: { pages: initData?.pages },
      });
      dispatch({
        type: AppActions.UPDATE_ACTIVE_PAGE,
        payload: { env: props.env },
      });
    }
  }, [initData]);

  useEffect(() => {
    if (state.pages?.length) {
      dispatch({
        type: AppActions.UPDATE_ACTIVE_PAGE,
        payload: { pages: initData?.pages, env: props.env },
      });
    }
  }, [state.pages]);

  useEffect(() => {
    console.log('useEffect-pages:', props.location.location.pathname);
  }, [props.location.location.pathname]);
  console.log('location-pages:', props.location.location.pathname);

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <AsideNav
          logo="图标文件"
          navigations={state.navigations}
          // isActive={(link: any) => !!env.isCurrentUrl(link?.path, link)}
          isActive={(link: any) => !!isCurrentUrl(link?.path, link)}
          env={env}
        />

        <Layout className="site-layout">
          <Header style={{ padding: 0 }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              {new Array(15).fill(null).map((_, index) => {
                const key = index + 1;
                return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
              })}
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            {state.bcn.length ? (
              <Breadcrumb style={{ margin: '16px 0' }}>
                {state.bcn?.map((item, index) => (
                  <Breadcrumb.Item key={index}>{item?.label}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
            ) : null}

            <div className="site-layout-content">
              {asideBefore ? render('aside-before', asideBefore) : null}
              <div>App页面</div>
              {state.activePage && state.schema ? (
                <div>
                  {render('page', state.schema, {
                    key: `${state.activePage?.id}-${state.schemaKey}`,
                    // data: createObject(self.data, {
                    //   params: activePage?.params || {},
                    // }),
                  })}
                </div>
              ) : state.pages && !state.activePage ? (
                <NotFound />
              ) : null}
              {asideAfter ? render('aside-before', asideAfter) : null}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default Renderer({
  type: 'app',
  // storeType: AppStore.name,
})(Page);
