import React, { useState, useEffect, useContext } from 'react';
import cx from 'classnames';
import { Layout, Menu, Skeleton } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { mapTree, findTree, getTreeAncestors } from '@/utils/helper';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';
import { RootStoreContext } from '@/store';

const { Sider } = Layout;
const { SubMenu } = Menu;

function AsideNav(props: any) {
  const { logo, onNavClick, loading, navigations } = props;

  const [state, dispatch] = useContext(RootStoreContext);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    if (navigations?.length) {
      let matched: any;
      let page = findTree(navigations, (item) => {
        if (item.path) {
          // matched = env.isCurrentUrl(item.path, item);
          matched = isCurrentUrl(item.path, item);
          if (matched) {
            return true;
          }
        }
        return false;
      });

      // 获取从树中获取某个值的所有祖先
      const parentMenus = getTreeAncestors(navigations, page, true);
      const _ids = parentMenus
        ?.filter((o) => o?.id)
        ?.map((o) => o?.id?.toString());
      const _currOpenIds = page?.children?.length
        ? [page?.children?.[0]?.id?.toString()]
        : page?.id
        ? [page?.id?.toString()]
        : [];
      setSelectedKeys(_currOpenIds);
      setOpenKeys(_ids);

      let bcn: Array<any> = [];
      findTree(parentMenus, (item, index, level, paths) => {
        if (item.id === page?.id) {
          bcn = paths.filter((item) => item.path && item.label);
          bcn.push({
            ...item,
            // path: '',
          });
          // state.__;
          if (bcn[0].path !== '/') {
            bcn.unshift({
              label: '首页',
              path: '/',
            });
          }
          return true;
        }
        return false;
      });
      // console.log('bcn:', bcn);
    }
  }, [navigations]);

  // SubMenu 展开/关闭的回调
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 点击 MenuItem 调用此函数
  const handleClick = (e) => {
    setSelectedKeys(e.key);
  };

  // 展开与收缩
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const handleCollapse = (is: boolean) => {
    setCollapsed(is);
  };

  // 子目录
  const itemRender = (item: Nav.Link, index: number, depth = 1) => {
    if (item?.visible === false) {
      return null;
    } else if (Array.isArray(item?.children) && item?.children?.length) {
      return (
        <SubMenu
          key={item?.id + ''}
          icon={<UserOutlined />}
          title={item?.label}
        >
          {item?.children?.map((childItem, key) =>
            itemRender(childItem, `${index}-${key}`, depth + 1)
          )}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item?.id + ''} icon={<PieChartOutlined />}>
          {/^https?\:/.test(item.path) ? (
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
              onClick={onNavClick}
              href={item?.path || item?.children?.[0]?.path}
            >
              {item?.label}
            </a>
          )}
        </Menu.Item>
      );
    }
  };

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      trigger={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      collapsedWidth={0}
      width={180}
      zeroWidthTriggerStyle={{ top: 'calc(50% - 50px - 21px)' }}
    >
      <div className="logo">{logo}</div>
      {loading ? (
        <div style={{ padding: 24 }}>
          <Skeleton
            active
            title={false}
            paragraph={{
              rows: 6,
            }}
          />
        </div>
      ) : navigations?.length ? (
        <Menu
          theme="light"
          mode="inline"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={handleOpenChange}
          onClick={handleClick}
        >
          {Array.isArray(navigations)
            ? navigations?.map((item, index) => itemRender(item, index))
            : null}
        </Menu>
      ) : null}
    </Sider>
  );
}

export default AsideNav;
