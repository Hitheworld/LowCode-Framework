import { useState } from 'react';
import { Breadcrumb } from 'antd';
import { Renderer } from '@/factory';

function BreadcrumbField() {
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>User</Breadcrumb.Item>
      <Breadcrumb.Item>Bill</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default Renderer({
  type: 'breadcrumb',
})(BreadcrumbField);
