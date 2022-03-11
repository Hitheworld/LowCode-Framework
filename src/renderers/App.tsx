import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Layout, Menu, Breadcrumb, Spin, Tabs } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { AppActions } from '@/store/constants';
import { Renderer, EnvContext } from '@/factory';
import { createObject } from '@/utils/helper';
import { useRequest } from '@/hooks/useRequest';
import AsideNav from '@/components/AsideNav';
import NotFound from '@/components/NotFound';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';
import { RootStoreContext } from '@/store';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

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

  // 展开与收缩
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const handleCollapse = (is: boolean) => {
    setCollapsed(is);
  };

  // tabs左右箭头
  const OperationsSlot = {
    left: <LeftOutlined />,
    right: <RightOutlined />,
  };

  console.log('state.navigations', state.navigations);

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0, height: 50, lineHeight: '50px' }}>
          <div className="logo" />
          <Tabs tabBarExtraContent={OperationsSlot}>
            {new Array(15).fill(null).map((_, index) => {
              const key = index + 1;
              return (
                <TabPane
                  key={index}
                  tab={`nav ${key}`}
                  style={{
                    padding: 0,
                    color: '#fff',
                  }}
                />
              );
            })}
          </Tabs>
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            {new Array(15).fill(null).map((_, index) => {
              const key = index + 1;
              return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
            })}
          </Menu> */}
        </Header>
        <Layout>
          <Sider collapsedWidth={50} collapsed trigger={null} />
          <Sider
            collapsedWidth={50}
            collapsed
            onCollapse={handleCollapse}
            trigger={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            style={{ position: 'absolute', height: 'calc(100% - 50px)' }}
          >
            <Menu theme="dark" mode="inline">
              {state.navigations?.map((item) => (
                <Menu.Item key={item?.id} icon={<MenuFoldOutlined />}>
                  {item?.label}
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
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
                    <>
                      {render('page', state.schema, {
                        key: `${state.activePage?.id}-${state.schemaKey}`,
                        data: createObject(state.data, {
                          params: state.activePage?.params || {},
                        }),
                      })}
                    </>
                  ) : state.pages && !state.activePage && !initLoading ? (
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
      </Layout>
    </>
  );
}

export default Renderer({
  type: 'app',
  // storeType: AppStore.name,
})(Page);
