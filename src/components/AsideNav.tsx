import React, { useState, useEffect, useContext } from 'react';
import cx from 'classnames';
import { Layout, Menu, Skeleton } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { mapTree } from '@/utils/helper';
import { RootStoreContext } from '@/store';

const { Sider } = Layout;
const { SubMenu } = Menu;

function AsideNav(props: any) {
  const { logo, onNavClick, loading, path } = props;

  console.log('AsideNav-props:', props?.isActive());

  const [state, dispatch] = useContext(RootStoreContext);

  const [navigations, setNavigations] = useState<AsideNav.LinkItemProps[]>([]);
  useEffect(() => {
    if (props.navigations?.length) {
      let id = 1;
      const _list = mapTree(
        props.navigations,
        (item: AsideNav.Navigation) => {
          const isActive =
            typeof item.active === 'undefined'
              ? (props.isActive as Function)(item)
              : item.active;

          const _path = item?.children?.length
            ? item?.children?.[0]?.path
            : item?.path;
          return {
            ...item,
            path: _path,
            id: id++,
            active: isActive,
            open: isActive || props?.isOpen?.(item as AsideNav.LinkItemProps),
          };
        },
        1,
        true
      );
      setNavigations(_list);
    }
  }, [props.navigations]);

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
        <SubMenu key={item?.path} icon={<UserOutlined />} title={item?.label}>
          {item?.children?.map((childItem, key) =>
            itemRender(childItem, `${index}-${key}`, depth + 1)
          )}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item?.path} icon={<PieChartOutlined />}>
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

  const currentItem = navigations?.filter((o) => o?.path === path)[0];
  console.log('AsideNav=currentItem数据是:', currentItem);
  console.log('AsideNav=path数据是:', path);

  console.log('navigations数据是:', navigations);

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
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
      ) : (
        <Menu
          theme="dark"
          defaultOpenKeys={[path]}
          defaultSelectedKeys={[path]}
          mode="inline"
        >
          {Array.isArray(navigations)
            ? navigations?.map((item, index) => itemRender(item, index))
            : null}
        </Menu>
      )}
    </Sider>
  );
}

export default AsideNav;
