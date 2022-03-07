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
import { AppActions } from '@/store/app';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';
import { mapTree } from '@/utils/helper';
import { RootStoreContext } from '@/store';

const { Sider } = Layout;
const { SubMenu } = Menu;

function AsideNav(props: any) {
  const { logo, env } = props;

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
    setNavigations(
      mapTree(
        navigations,
        (item: Navigation) => ({
          ...item,
          open: link.id === item.id ? !item.open : item.open,
        }),
        1,
        true
      )
    );
  };

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const onCollapse = (is: boolean) => {
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

  console.log('navigations数据是:', navigations);

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

      <Menu
        theme="dark"
        defaultOpenKeys={[props.path]}
        defaultSelectedKeys={[props.path]}
        mode="inline"
      >
        {Array.isArray(navigations)
          ? navigations?.map((item, index) => itemRender(item, index))
          : null}
      </Menu>
    </Sider>
  );
}

export default AsideNav;
