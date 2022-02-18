import { useReducer, Dispatch } from 'react';

// 1. 创建初始值
const initial = {
  n: 0,
};
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

// 3. 传给useReducer
const App = (props) => {
  const [state, dispatch] = useReducer(reducer, initial);
  const onClick = () => {
    dispatch({ type: 'add', number: 1 });
  };
  const onClick2 = () => {
    dispatch({ type: 'add', number: 2 });
  };
  return (
    <div>
      <h1>{state.n}</h1>
      <button onClick={onClick}>+1</button>
      <button onClick={onClick2}>+2</button>
    </div>
  );
};
