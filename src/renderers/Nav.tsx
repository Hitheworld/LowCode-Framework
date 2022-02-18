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
import { Renderer } from '@/factory';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';

const { Sider } = Layout;
const { SubMenu } = Menu;

function Nav(props: any) {
  const { loading = false, config, deferLoad, updateConfig, ...rest } = props;

  // 中转页面
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const { env } = props;
    const link = e.currentTarget.getAttribute('href')!;
    // env.jumpTo(link);
    jumpTo(link);
  };

  const toggleExpand = (
    link: AsideNav.LinkItemProps,
    e?: React.MouseEvent<HTMLElement>
  ) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
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

  const links = config || rest.links || [];

  const renderItem = (item: Nav.Link, index: number, depth = 1) => {
    if (Array.isArray(item?.children) && item?.children?.length) {
      return (
        <SubMenu key={index} icon={<UserOutlined />} title={item?.label}>
          {item?.children?.map((childItem, childIndex) =>
            renderItem(childItem, childIndex, depth + 1)
          )}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={`${depth}-${index}`} icon={<PieChartOutlined />}>
          {item.path ? (
            /^https?\:/.test(item.path) ? (
              <a target="_blank" href={item.path} rel="noopener">
                {item?.label}
              </a>
            ) : (
              <a
                onClick={handleNavClick}
                href={item.path || (item.children && item.children[0].path)}
              >
                {item?.label}
              </a>
            )
          ) : (
            <a onClick={item.children ? () => toggleExpand(item) : undefined}>
              {item?.label}
            </a>
          )}
        </Menu.Item>
      );
    }
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div style={{ padding: 24 }}>
        <Skeleton
          loading={loading}
          active
          title={false}
          paragraph={{
            rows: 6,
          }}
        />
      </div>

      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        {Array.isArray(links)
          ? links?.map((item, index) => renderItem(item, index))
          : null}
      </Menu>
    </Sider>
  );
}

export default Renderer({
  test: /(^|\/)(?:nav|navigation)$/,
  name: 'nav',
})(Nav);
