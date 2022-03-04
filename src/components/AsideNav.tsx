import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  Dispatch,
} from 'react';
import cx from 'classnames';
import { Layout, Menu, Skeleton } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { initialState, reducer } from '@/store/app';
import { AppActions } from '@/store/app';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';
import { mapTree } from '@/utils/helper';

const { Sider } = Layout;
const { SubMenu } = Menu;

function AsideNav(props: any) {
  const { logo, menus, env } = props;
  console.log('AsideNav-props:', props);

  const [_, dispatch] = useReducer(reducer, initialState);

  const [currMenuItem, setCurrMenuItem] =
    useState<AsideNav.LinkItemProps | null>(null);

  // 中转页面
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = e.currentTarget.getAttribute('href')!;
    // env.jumpTo(link);
    jumpTo(link);
  };

  const toggleExpand = (
    item: AsideNav.LinkItemProps,
    e?: React.MouseEvent<HTMLElement>
  ) => {
    if (e) {
      // e.stopPropagation();
      e.preventDefault();
    }

    const link = e.currentTarget.getAttribute('href')!;
    // env.jumpTo(link);
    jumpTo(link);

    console.log('展开了============', e, item);
    dispatch({
      type: AppActions.TOGGLE_EXPAND,
      payload: { id: item?.id, pages: menus },
    });
    // this.setState({
    //   navigations: mapTree(
    //     this.state.navigations,
    //     (item: Navigation) => ({
    //       ...item,
    //       open: link.id === item.id ? !item.open : item.open
    //     }),
    //     1,
    //     true
    //   )
    // });
  };

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const onCollapse = (is: boolean) => {
    setCollapsed(is);
  };

  // 子目录
  const renderItem = (item: Nav.Link, index: number, depth = 1) => {
    if (item?.visible === false) {
      return null;
    } else if (Array.isArray(item?.children) && item?.children?.length) {
      return (
        <SubMenu
          key={`${index}-${depth}`}
          icon={<UserOutlined />}
          title={item?.label}
        >
          {item?.children?.map((childItem, key) =>
            renderItem(childItem, `${index}-${key}`, depth + 1)
          )}
        </SubMenu>
      );
    } else if (item?.visible === true || item?.visible === undefined || item?.visible === 'undefined') {
      return (
        <Menu.Item key={`${depth}-${index}`} icon={<PieChartOutlined />}>
          {item.path ? (
            /^https?\:/.test(item.path) ? (
              <a
                style={{ display: 'block' }}
                target="_blank"
                href={item.path}
                rel="noopener"
              >
                {item?.label}
              </a>
            ) : (
              <a
                style={{ display: 'block' }}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  toggleExpand(item, e)
                }
                href={item?.path || item?.children?.[0]?.path}
              >
                {item?.label}
              </a>
            )
          ) : (
            <a
              style={{ display: 'block' }}
              onClick={
                item.children
                  ? (e: React.MouseEvent<HTMLElement>) => toggleExpand(item, e)
                  : undefined
              }
            >
              {item?.label}
            </a>
          )}
        </Menu.Item>
      );
    }
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo">{logo}</div>

      <div style={{ padding: 24 }}>
        <Skeleton
          active
          title={false}
          paragraph={{
            rows: 6,
          }}
        />
      </div>

      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        {Array.isArray(menus)
          ? menus?.map((item, index) => renderItem(item, index))
          : null}
      </Menu>
    </Sider>
  );
}

export default AsideNav;
