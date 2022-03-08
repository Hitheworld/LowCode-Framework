import React, { useState, useEffect, useContext, useReducer } from 'react';
import cx from 'classnames';
import { Table } from 'antd';
import { Renderer } from '@/factory';
import { isVisible, bulkBindFunctions } from '@/utils/helper';
import { RootStoreContext } from '@/store';

function TableRenderer(props: Table.TableProps) {
  const { dataSource, columns } = props;

  return (
    <>
      这是Table
      <Table dataSource={dataSource} columns={columns}></Table>
    </>
  );
}

export default Renderer({
  type: 'table',
  name: 'table',
})(TableRenderer);
