import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Layout, Menu, Breadcrumb, Spin, Badge, Avatar, Tabs } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
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

function AppRenderer(props: any) {
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
  const [collapsed, setCollapsed] = useState<boolean>(true);
  // 移入
  const handleMouseOver = (e: MouseEvent<HTMLElement>) => {
    console.log('移动MouseOver:', e);
    setCollapsed(false);
  };

  // 移出
  const handleMouseOut = (e: MouseEvent<HTMLElement>) => {
    console.log('移动MouseOut:', e);
    setCollapsed(true);
  };

  console.log('state.navigations', state.navigations);

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          theme="light"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            height: '50px',
            lineHeight: '50px',
            // background: '#fff',
            boxShadow: '0 1px 4px rgb(0 21 41 / 8%)',
            zIndex: '99',
          }}
        >
          <div style={{ flex: '1 1 0%' }}>
            <img
              style={{ width: '100px' }}
              src="https://web-test.1919.cn/manage/image/logo.png"
              className="logo"
            />
            <span style={{ color: '#fff' }}>管理中心</span>
          </div>
          <Badge count={1} offset={[-5, 5]}>
            <Avatar shape="square" icon={<UserOutlined />} />
          </Badge>
          {/* 
          <Tabs
            tabPosition="top"
            tabBarExtraContent={{
              left: <LeftOutlined />,
              right: <RightOutlined />,
            }}
            centered
            moreIcon={null}
            tabBarStyle={{ margin: 0, border: 'none' }}
            renderTabBar={(props, DefaultTabBar) => (
              <DefaultTabBar {...props}>
                {(node) => <div>{node} -- pppp</div>}
              </DefaultTabBar>
            )}
          >
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
          */}
          {/* 
          <Menu
                theme="dark"
                overflowedIndicator={null}
                mode="horizontal"
                defaultSelectedKeys={['2']}
              >
                {new Array(15).fill(null).map((_, index) => {
                  const key = index + 1;
                  return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
                })}
              </Menu>
          */}
        </Header>
        <Layout>
          <Sider collapsedWidth={50} collapsed trigger={null} />
          <Sider
            collapsedWidth={50}
            collapsed={collapsed}
            trigger={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            style={{
              position: 'absolute',
              height: 'calc(100% - 50px)',
              zIndex: '99999',
            }}
            width={180 + 50}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
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
          <Layout
            className="site-layout"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1',
            }}
          >
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Spin spinning={initLoading} />
            </div>
            <Content style={{ flex: '1 1' }}>
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
})(AppRenderer);
