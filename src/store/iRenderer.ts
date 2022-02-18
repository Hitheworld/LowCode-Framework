import { useReducer } from 'react';
import {
  extendObject,
  createObject,
  getVariable,
  cloneObject,
  setVariable,
  deleteVariable,
} from '@/utils/helper';
import { SimpleMap } from '@/utils/SimpleMap';

// 1. 创建初始值
export const initial: IRenderer.IRendererState = {
  hasRemoteData: false,
  data: {},
  initedAt: 0, // 初始 init 的时刻
  updatedAt: 0, // 从服务端更新时刻
  pristine: {},
  action: undefined,
  dialogOpen: false,
  dialogData: undefined,
  drawerOpen: false,
  drawerData: undefined,
};

const dialogCallbacks = new SimpleMap<(result?: any) => void>();

// 2. 创建所有操作
export const reducer = (
  state: IRenderer.IRendererState,
  action: IRenderer.IAction
) => {
  const status = {
    // 初始化数据
    initData: (data: object = {}, skipSetPristine = false) => {
      state.initedAt = Date.now();
      !skipSetPristine && (state.pristine = data);
      state.data = data;
    },
    // 重置数据
    reset: () => {
      state.data = state.pristine;
    },
    // 更新数据
    updateData: (data: object = {}, tag?: object, replace?: boolean) => {
      const prev = state.data;
      let newData;
      if (tag) {
        let proto = createObject((state.data as any).__super || null, tag);
        newData = createObject(proto, {
          ...(replace ? {} : state.data),
          ...data,
        });
      } else {
        newData = extendObject(state.data, data, !replace);
      }

      Object.defineProperty(newData, '__prev', {
        value: { ...prev },
        enumerable: false,
        configurable: false,
        writable: false,
      });

      state.data = newData;
    },
    // 更改值
    changeValue: (
      name: string,
      value: any,
      changePristine?: boolean,
      force?: boolean,
      otherModifier?: (data: Object) => void
    ) => {
      if (!name) {
        return;
      }

      const origin = getVariable(state.data, name, false);

      if (value === origin && !force) {
        return;
      }

      const prev = state.data;
      const data = cloneObject(state.data);
      if (prev.__prev) {
        // 基于之前的 __prev 改
        const prevData = cloneObject(prev.__prev);
        setVariable(prevData, name, origin);
        Object.defineProperty(data, '__prev', {
          value: prevData,
          enumerable: false,
          configurable: false,
          writable: false,
        });
      } else {
        Object.defineProperty(data, '__prev', {
          value: { ...prev },
          enumerable: false,
          configurable: false,
          writable: false,
        });
      }

      if (value === undefined) {
        deleteVariable(data, name);
      } else {
        setVariable(data, name, value);
      }

      otherModifier?.(data);

      if (changePristine) {
        const pristine = cloneObject(state.pristine);
        setVariable(pristine, name, value);
        otherModifier?.(pristine);
        state.pristine = pristine;
      }

      if (!data.__pristine) {
        Object.defineProperty(data, '__pristine', {
          value: state.pristine,
          enumerable: false,
          configurable: false,
          writable: false,
        });
      }

      state.data = data;
    },
    // 设置当前动作
    setCurrentAction: (_action: object) => {
      state.action = _action;
    },
    // 打开Dialog
    openDialog: (
      ctx: any,
      additonal?: object,
      callback?: (ret: any) => void
    ) => {
      let proto = ctx.__super ? ctx.__super : state.data;

      if (additonal) {
        proto = createObject(proto, additonal);
      }

      const data = createObject(proto, {
        ...ctx,
      });

      if (state.action.dialog && state.action.dialog.data) {
        state.dialogData = dataMapping(state.action.dialog.data, data);

        const clonedAction = {
          ...state.action,
          dialog: {
            ...state.action.dialog,
          },
        };
        delete clonedAction.dialog.data;
        state.action = clonedAction;
      } else {
        state.dialogData = data;
      }
      state.dialogOpen = true;
      callback && dialogCallbacks.set(state.dialogData, callback);
    },
    // 关闭Dialog
    closeDialog: (result?: any) => {
      const callback = dialogCallbacks.get(state.dialogData);
      state.dialogOpen = false;
      if (callback) {
        dialogCallbacks.delete(state.dialogData);
        setTimeout(() => callback(result), 200);
      }
    },
    // 打开Drawer
    openDrawer: (
      ctx: any,
      additonal?: object,
      callback?: (ret: any) => void
    ) => {
      let proto = ctx.__super ? ctx.__super : state.data;

      if (additonal) {
        proto = createObject(proto, additonal);
      }

      const data = createObject(proto, {
        ...ctx,
      });

      if (state.action.drawer.data) {
        state.drawerData = dataMapping(state.action.drawer.data, data);

        const clonedAction = {
          ...state.action,
          dialog: {
            ...state.action.dialog,
          },
        };
        delete clonedAction.dialog.data;
        state.action = clonedAction;
      } else {
        state.drawerData = data;
      }
      state.drawerOpen = true;

      if (callback) {
        dialogCallbacks.set(state.drawerData, callback);
      }
    },
    // 关闭Drawer
    closeDrawer: (result?: any) => {
      const callback = dialogCallbacks.get(state.drawerData);
      state.drawerOpen = false;

      if (callback) {
        dialogCallbacks.delete(state.drawerData);
        setTimeout(() => callback(result), 200);
      }
    },
  };
  if (status[action.type]) {
    return state;
  } else {
    throw new Error('unknown type');
  }
};
