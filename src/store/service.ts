import { useReducer } from 'react';

// 1. 创建初始值
const initial = {
  msg: '',
  error: false,
  fetching: false,
  saving: false,
  busying: false,
  checking: false,
  initializing: false,
  schema: null,
  schemaKey: '',
};

let fetchCancel: Function | null;
let fetchSchemaCancel: Function | null;

// 2. 创建所有操作
const reducer = (state, action) => {
  if (action.type === 'add') {
    return { n: state.n + action.number };
  } else if (action.type === 'multi') {
    return { n: state.n * 2 };
  } else {
    throw new Error('unknown type');
  }
};
