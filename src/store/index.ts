import { createContext, useReducer } from 'react';

export const RootStoreContext = createContext<any>('context');

// 通过import.meta.globEager获取某个模块下的所有文件-test
const reduceModule = import.meta.globEager('./reduce/*.ts');
const stateModule = import.meta.globEager('./state/*.ts');

/**
 * 将多个模块的某个属性合为一个对象
 * @param {读取到的模块} module 如上 ：reduceModule、stateModule
 * @param {模块中的属性} throwOut  例： reduce、state
 */
function mergeModuls(modules: any, throwOut: string) {
  let multiple: any = {};
  for (const path in modules) {
    let module = modules[path].default;
    // multiple[throwOut] = module;
    // multiple[module.name] = module[throwOut];
    multiple = module;
  }
  // console.log('multiple:', multiple);
  return multiple;
}

// function mergeModuls (modules,throwOut) {
//   let multiple= {};
//   modules.keys().forEach((key)=>{
//       let module = modules(key).default;
//       multiple[module.name] = module[throwOut]
//   });
//   return multiple
// };

// 合并后的reduce
let multipleReducer = mergeModuls(reduceModule, 'reducer');
let multipleState = mergeModuls(stateModule, 'state');
// console.log('合并对象multipleReduce====', multipleReducer);
// console.log('合并对象multipleState====', multipleState);

function combineReducers(reducers) {
  return function (state: any = {}, action: any) {
    return Object.keys(reducers).reduce((newState, key) => {
      // // 状态就是总state得其中的一个子state
      // const childState = state[key];
      // // 然后得到新的子状态，赋值给对应的key的新state里面
      // newState[key] = reducers[key](childState, action);
      newState[key] = reducers[key](state[key], action);
      return newState;
    }, {});
  };
}

// const combineReducers = (reducers) => {
//   return (state = {}, action) => {
//     let newReduce = {};
//     //包含所有reducers函数名的数组 然后forEach遍历所有的key
//     Object.keys(reducers).forEach((key) => {
//       const childState = state[key]; //状态就是总state得其中的一个子state
//       newReduce[key] = reducers[key](childState, action); //然后得到新的子状态，赋值给对应的key的新state里面

//       console.log('再将多个===key:', key);
//       console.log('再将多个===state:', state);
//       console.log('再将多个===childState:', childState);
//       console.log('再将多个===newReduce:', newReduce);
//     });
//     console.log('最后返回新的总state对象:', newReduce);
//     return newReduce; // 最后返回新的总state对象
//   };
// };

export { combineReducers, multipleReducer, multipleState };
