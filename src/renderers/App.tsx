import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Breadcrumb, Spin } from 'antd';
import { AppActions } from '@/store/constants';
import { Renderer, EnvContext } from '@/factory';
import { useRequest } from '@/hooks/useRequest';
import AsideNav from '@/components/AsideNav';
import NotFound from '@/components/NotFound';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';
import { RootStoreContext } from '@/store';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Page(props: any) {
  const { asideBefore, asideAfter, render, env } = props;

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

  // 页面跳转
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = e.currentTarget.getAttribute('href')!;
    // env.jumpTo(link);
    jumpTo(link);
    dispatch({
      type: AppActions.UPDATE_ACTIVE_PAGE,
      payload: { env: props.env },
    });
  };

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <AsideNav
          logo="图标文件"
          navigations={state.navigations}
          // isActive={(link: any) => !!env.isCurrentUrl(link?.path, link)}
          isActive={(link: any) => isCurrentUrl(link?.path, link)}
          loading={initLoading}
          path={props.location.location.pathname}
          bcn={state.bcn}
          onNavClick={handleNavClick}
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
          <Spin spinning={initLoading}>
            <Content style={{ padding: '0 50px' }}>
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
              </div>
            </Content>
          </Spin>
          <Footer style={{ textAlign: 'center' }}>
            {asideAfter ? render('aside-before', asideAfter) : null}
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
