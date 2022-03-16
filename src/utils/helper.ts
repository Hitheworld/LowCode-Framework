import isPlainObject from 'lodash/isPlainObject';
import qs from 'qs';
import { evalExpression } from './tpl';

/**
 * 基于时间戳的 uuid
 *
 * @returns uniqueId
 */
export const uuid = () => {
  return (+new Date()).toString(36);
};

// 参考 https://github.com/streamich/v4-uuid
const str = () =>
  (
    '00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)
  ).slice(-16);
export const uuidv4 = () => {
  const a = str();
  const b = str();
  return (
    a.slice(0, 8) +
    '-' +
    a.slice(8, 12) +
    '-4' +
    a.slice(13) +
    '-a' +
    b.slice(1, 4) +
    '-' +
    b.slice(4)
  );
};

/**
 * 将例如像 a.b.c 或 a[1].b 的字符串转换为路径数组
 *
 * @param string 要转换的字符串
 */
export const keyToPath = (string: string) => {
  const result = [];

  if (string.charCodeAt(0) === '.'.charCodeAt(0)) {
    result.push('');
  }

  string.replace(
    new RegExp(
      '[^.[\\]]+|\\[(?:([^"\'][^[]*)|(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
      'g'
    ),
    (match, expression, quote, subString) => {
      let key = match;
      if (quote) {
        key = subString.replace(/\\(\\)?/g, '$1');
      } else if (expression) {
        key = expression.trim();
      }
      result.push(key);
      return '';
    }
  );

  return result;
};

/**
 * 参数字符串化
 */
export function qsstringify(
  data: any,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true,
  },
  keepEmptyArray?: boolean
) {
  // qs会保留空字符串。fix: Combo模式的空数组，无法清空。改为存为空字符串；只转换一层
  keepEmptyArray &&
    Object.keys(data).forEach((key: any) => {
      Array.isArray(data[key]) && !data[key].length && (data[key] = '');
    });
  return qs.stringify(data, options);
}

/**
 * 是否是对象
 */
export function isObject(obj: any) {
  const typename = typeof obj;
  return (
    obj &&
    typename !== 'string' &&
    typename !== 'number' &&
    typename !== 'boolean' &&
    typename !== 'function' &&
    !Array.isArray(obj)
  );
}

/**
 * 设置值
 */
export function setVariable(
  data: { [propName: string]: any },
  key: string,
  value: any
) {
  data = data || {};

  if (key in data) {
    data[key] = value;
    return;
  }
  const parts = keyToPath(key);
  const last = parts.pop() as string;
  while (parts.length) {
    let key = parts.shift() as string;
    if (isPlainObject(data[key])) {
      data = data[key] = {
        ...data[key],
      };
    } else if (Array.isArray(data[key])) {
      data[key] = data[key].concat();
      data = data[key];
    } else if (data[key]) {
      // throw new Error(`目标路径不是纯对象，不能覆盖`);
      // 强行转成对象
      data[key] = {};
      data = data[key];
    } else {
      data[key] = {};
      data = data[key];
    }
  }

  data[last] = value;
}

/**
 * 删除值
 */
export function deleteVariable(data: { [propName: string]: any }, key: string) {
  if (!data) {
    return;
  }
  if (data.hasOwnProperty(key)) {
    delete data[key];
    return;
  }
  const parts = keyToPath(key);
  const last = parts.pop() as string;
  while (parts.length) {
    let key = parts.shift() as string;
    if (isPlainObject(data[key])) {
      data = data[key] = {
        ...data[key],
      };
    } else if (data[key]) {
      throw new Error(`目标路径不是纯对象，不能修改`);
    } else {
      break;
    }
  }
  if (data && data.hasOwnProperty && data.hasOwnProperty(last)) {
    delete data[last];
  }
}

/**
 * 字符正则
 */
export function string2regExp(value: string, caseSensitive = false) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  return new RegExp(
    value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'),
    !caseSensitive ? 'i' : ''
  );
}

/**
 * 查找下标
 */
export function findIndex(
  arr: Array<any>,
  detect: (item?: any, index?: number) => boolean
) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (detect(arr[i], i)) {
      return i;
    }
  }

  return -1;
}

/**
 * 克隆对象
 */
export function cloneObject(target: any, persistOwnProps: boolean = true) {
  const obj =
    target && target.__super
      ? Object.create(target.__super, {
          __super: {
            value: target.__super,
            writable: false,
            enumerable: false,
          },
        })
      : Object.create(Object.prototype);
  persistOwnProps &&
    target &&
    Object.keys(target).forEach((key) => (obj[key] = target[key]));
  return obj;
}

/**
 * 创建对象
 * 方便取值的时候能够把上层的取到，但是获取的时候不会全部把所有的数据获取到。
 */
export function createObject(
  superProps?: { [propName: string]: any },
  props?: { [propName: string]: any },
  properties?: any
): object {
  if (superProps && Object.isFrozen(superProps)) {
    superProps = cloneObject(superProps);
  }
  const obj = superProps
    ? Object.create(superProps, {
        ...properties,
        __super: {
          value: superProps,
          writable: false,
          enumerable: false,
        },
      })
    : Object.create(Object.prototype, properties);
  props &&
    isObject(props) &&
    Object.keys(props).forEach((key) => (obj[key] = props[key]));
  return obj;
}

/**
 * 是否有文件
 * 只判断一层, 如果层级很深，form-data 也不好表达。
 */
export function hasFile(object: any): boolean {
  return Object.keys(object).some((key) => {
    let value = object[key];
    return (
      value instanceof File ||
      (Array.isArray(value) && value.length && value[0] instanceof File)
    );
  });
}

/**
 * 对象转form数据
 */
export function object2formData(
  data: any,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true,
  },
  fd: FormData = new FormData()
): any {
  let fileObjects: any = [];
  let others: any = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value instanceof File) {
      fileObjects.push([key, value]);
    } else if (
      Array.isArray(value) &&
      value.length &&
      value[0] instanceof File
    ) {
      value.forEach((value) => fileObjects.push([`${key}[]`, value]));
    } else {
      others[key] = value;
    }
  });
  // 因为 key 的格式太多了，偷个懒，用 qs 来处理吧。
  qsstringify(others, options)
    .split('&')
    .forEach((item) => {
      let parts = item.split('=');
      // form-data/multipart 是不需要 encode 值的。
      parts[0] && fd.append(parts[0], decodeURIComponent(parts[1]));
    });
  // Note: File类型字段放在后面，可以支持第三方云存储鉴权
  fileObjects.forEach((fileObject: any[]) =>
    fd.append(fileObject[0], fileObject[1], fileObject[1].name)
  );
  return fd;
}

/**
 * 参数解析
 */
export function qsparse(
  data: string,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true,
    depth: 1000, // 默认是 5， 所以condition-builder只要来个条件组就会导致报错
  }
) {
  return qs.parse(data, options);
}

/**
 * 删除未定义
 */
export function rmUndefined(obj: Types.PlainObject) {
  const newObj: Types.PlainObject = {};
  if (typeof obj !== 'object') {
    return obj;
  }
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

/**
 * 判断对象是否已修改
 */
export function isObjectShallowModified(
  prev: any,
  next: any,
  strictMode: boolean = true,
  ignoreUndefined: boolean = false,
  statck: Array<any> = []
): boolean {
  if (Array.isArray(prev) && Array.isArray(next)) {
    return prev.length !== next.length
      ? true
      : prev.some((prev, index) =>
          isObjectShallowModified(
            prev,
            next[index],
            strictMode,
            ignoreUndefined,
            statck
          )
        );
  } else if (isNaN(prev) && isNaN(next)) {
    return false;
  } else if (
    null == prev ||
    null == next ||
    !isObject(prev) ||
    !isObject(next)
    // ||
    // isObservable(prev) ||
    // isObservable(next)
  ) {
    return strictMode ? prev !== next : prev != next;
  }
  if (ignoreUndefined) {
    prev = rmUndefined(prev);
    next = rmUndefined(next);
  }
  const keys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (
    keys.length !== nextKeys.length ||
    keys.sort().join(',') !== nextKeys.sort().join(',')
  ) {
    return true;
  }
  // 避免循环引用死循环。
  if (~statck.indexOf(prev)) {
    return false;
  }
  statck.push(prev);

  for (let i: number = keys.length - 1; i >= 0; i--) {
    let key = keys[i];
    if (
      isObjectShallowModified(
        prev[key],
        next[key],
        strictMode,
        ignoreUndefined,
        statck
      )
    ) {
      return true;
    }
  }
  return false;
}

/**
 * 生成 8 位随机数字。
 *
 * @return {string} 8位随机数字
 */
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4();
}

/**
 * 类似于 arr.map 方法，此方法主要针对类似下面示例的树形结构。
 * [
 *     {
 *         children: []
 *     },
 *     // 其他成员
 * ]
 *
 * @param {Tree} tree 树形数据
 * @param {Function} iterator 处理函数，返回的数据会被替换成新的。
 * @return {Tree} 返回处理过的 tree
 */
export function mapTree<T extends Helper.TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => T,
  level: number = 1,
  depthFirst: boolean = false,
  paths: Array<T> = []
) {
  return tree?.map((item: any, index) => {
    if (depthFirst) {
      let children: Helper.TreeArray | undefined = item.children
        ? mapTree(
            item.children,
            iterator,
            level + 1,
            depthFirst,
            paths.concat(item)
          )
        : undefined;
      children && (item = { ...item, children: children });
      item = iterator(item, index, level, paths) || { ...(item as object) };
      return item;
    }
    item = iterator(item, index, level, paths) || { ...(item as object) };
    if (item.children && item.children.splice) {
      item.children = mapTree(
        item.children,
        iterator,
        level + 1,
        depthFirst,
        paths.concat(item)
      );
    }
    return item;
  });
}

/**
 * 判断树中每个节点是否满足某个条件。
 * @param tree
 * @param iterator
 */
export function everyTree<T extends Helper.TreeItem>(
  tree: Array<T>,
  iterator: (
    item: T,
    key: number,
    level: number,
    paths: Array<T>,
    indexes: Array<number>
  ) => boolean,
  level: number = 1,
  paths: Array<T> = [],
  indexes: Array<number> = []
): boolean {
  return tree.every((item, index) => {
    const value: any = iterator(item, index, level, paths, indexes);
    if (value && item.children && item.children.splice) {
      return everyTree(
        item.children,
        iterator,
        level + 1,
        paths.concat(item),
        indexes.concat(index)
      );
    }
    return value;
  });
}

/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 */
export function findTree<T extends Helper.TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any
): T | null {
  let result: T | null = null;
  everyTree(tree, (item, key, level, paths) => {
    if (iterator(item, key, level, paths)) {
      result = item;
      return false;
    }
    return true;
  });
  return result;
}

/**
 * 过滤树节点
 *
 * @param tree
 * @param iterator
 */
export function filterTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number) => any,
  level: number = 1,
  depthFirst: boolean = false
) {
  if (depthFirst) {
    return tree
      .map((item) => {
        let children: TreeArray | undefined = item.children
          ? filterTree(item.children, iterator, level + 1, depthFirst)
          : undefined;

        if (
          Array.isArray(children) &&
          Array.isArray(item.children) &&
          children.length !== item.children.length
        ) {
          item = { ...item, children: children };
        }

        return item;
      })
      .filter((item, index) => iterator(item, index, level));
  }

  return tree
    .filter((item, index) => iterator(item, index, level))
    .map((item) => {
      if (item.children && item.children.splice) {
        let children = filterTree(
          item.children,
          iterator,
          level + 1,
          depthFirst
        );

        if (
          Array.isArray(children) &&
          Array.isArray(item.children) &&
          children.length !== item.children.length
        ) {
          item = { ...item, children: children };
        }
      }
      return item;
    });
}

/**
 * 判断树中是否有某些节点满足某个条件。
 * @param tree
 * @param iterator
 */
export function someTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => boolean
): boolean {
  let result = false;

  everyTree(tree, (item: T, key: number, level: number, paths: Array<T>) => {
    if (iterator(item, key, level, paths)) {
      result = true;
      return false;
    }
    return true;
  });

  return result;
}

/**
 * 遍历树
 * @param tree
 * @param iterator
 */
export function eachTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number) => any,
  level: number = 1
) {
  tree.map((item, index) => {
    iterator(item, index, level);

    if (item.children && item.children.splice) {
      eachTree(item.children, iterator, level + 1);
    }
  });
}

/**
 * 将树打平变成一维数组，可以传入第二个参数实现打平节点中的其他属性。
 *
 * 比如：
 *
 * flattenTree([
 *     {
 *         id: 1,
 *         children: [
 *              { id: 2 },
 *              { id: 3 },
 *         ]
 *     }
 * ], item => item.id); // 输出位 [1, 2, 3]
 *
 * @param tree
 * @param mapper
 */
export function flattenTree<T extends TreeItem>(tree: Array<T>): Array<T>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper: (value: T, index: number) => U
): Array<U>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper?: (value: T, index: number) => U
): Array<U> {
  let flattened: Array<any> = [];
  eachTree(tree, (item, index) =>
    flattened.push(mapper ? mapper(item, index) : item)
  );
  return flattened;
}

/**
 * 获取树
 */
export function getTree<T extends TreeItem>(
  tree: Array<T>,
  idx: Array<number> | number
): T | undefined | null {
  const indexes = Array.isArray(idx) ? idx.concat() : [idx];
  const lastIndex = indexes.pop()!;
  let list: Array<T> | null = tree;
  for (let i = 0, len = indexes.length; i < len; i++) {
    const index = indexes[i];
    if (!list![index]) {
      list = null;
      break;
    }
    list = list![index].children as any;
  }
  return list ? list[lastIndex] : undefined;
}

/**
 * 在树中查找节点, 返回下标数组。
 * @param tree
 * @param iterator
 */
export function findTreeIndex<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any
): Array<number> | undefined {
  let idx: Array<number> = [];

  findTree(tree, (item, index, level, paths) => {
    if (iterator(item, index, level, paths)) {
      idx = [index];
      paths = paths.concat();
      paths.unshift({
        children: tree,
      } as any);

      for (let i = paths.length - 1; i > 0; i--) {
        const prev = paths[i - 1];
        const current = paths[i];
        idx.unshift(prev.children!.indexOf(current));
      }
      return true;
    }
    return false;
  });
  return idx.length ? idx : undefined;
}

/**
 * 操作树，遵循 imutable, 每次返回一个新的树。
 * 类似数组的 splice 不同的地方这个方法不修改原始数据，
 * 同时第二个参数不是下标，而是下标数组，分别代表每一层的下标。
 *
 * 至于如何获取下标数组，请查看 findTreeIndex
 *
 * @param tree
 * @param idx
 * @param deleteCount
 * @param ...items
 */
export function spliceTree<T extends TreeItem>(
  tree: Array<T>,
  idx: Array<number> | number,
  deleteCount: number = 0,
  ...items: Array<T>
): Array<T> {
  const list = tree.concat();
  if (typeof idx === 'number') {
    list.splice(idx, deleteCount, ...items);
  } else if (Array.isArray(idx) && idx.length) {
    idx = idx.concat();
    const lastIdx = idx.pop()!;
    let host = idx.reduce((list: Array<T>, idx) => {
      const child = {
        ...list[idx],
        children: list[idx].children ? list[idx].children!.concat() : [],
      };
      list[idx] = child;
      return child.children;
    }, list);
    host.splice(lastIdx, deleteCount, ...items);
  }
  return list;
}

/**
 * 计算树的深度
 * @param tree
 */
export function getTreeDepth<T extends TreeItem>(tree: Array<T>): number {
  return Math.max(
    ...tree.map((item) => {
      if (Array.isArray(item.children)) {
        return 1 + getTreeDepth(item.children);
      }

      return 1;
    })
  );
}

/**
 * 从树中获取某个值的所有祖先
 * @param tree
 * @param value
 */
export function getTreeAncestors<T extends Helper.TreeItem>(
  tree: Array<T>,
  value: T,
  includeSelf = false
): Array<T> | null {
  let ancestors: Array<T> | null = null;
  findTree(tree, (item, index, level, paths) => {
    if (item === value) {
      ancestors = paths;
      if (includeSelf) {
        ancestors.push(item);
      }
      return true;
    }
    return false;
  });

  return ancestors;
}

/**
 * 从树中获取某个值的上级
 * @param tree
 * @param value
 */
export function getTreeParent<T extends TreeItem>(tree: Array<T>, value: T) {
  const ancestors = getTreeAncestors(tree, value);
  return ancestors?.length ? ancestors[ancestors.length - 1] : null;
}

/**
 * 给目标对象添加其他属性，可读取但是不会被遍历。
 * @param target
 * @param props
 */
export function injectPropsToObject(target: any, props: any) {
  const sup = Object.create(target.__super || null);
  Object.keys(props).forEach((key) => (sup[key] = props[key]));
  const result = Object.create(sup);
  Object.keys(target).forEach((key) => (result[key] = target[key]));
  return result;
}

/**
 * map对象
 */
export function mapObject(value: any, fn: Function): any {
  if (Array.isArray(value)) {
    return value.map((item) => mapObject(item, fn));
  }
  if (isObject(value)) {
    let tmpValue = { ...value };
    Object.keys(tmpValue).forEach((key) => {
      (tmpValue as Types.PlainObject)[key] = mapObject(
        (tmpValue as Types.PlainObject)[key],
        fn
      );
    });
    return tmpValue;
  }
  return fn(value);
}

/**
 * 扩展对象
 */
export function extendObject(
  target: any,
  src?: any,
  persistOwnProps: boolean = true
) {
  const obj = cloneObject(target, persistOwnProps);
  src && Object.keys(src).forEach((key) => (obj[key] = src[key]));
  return obj;
}

/**
 * 获取变量
 */
export function getVariable(
  data: { [propName: string]: any },
  key: string | undefined,
  canAccessSuper: boolean = true
): any {
  if (!data || !key) {
    return undefined;
  } else if (canAccessSuper ? key in data : data.hasOwnProperty(key)) {
    return data[key];
  }

  return keyToPath(key).reduce(
    (obj, key) =>
      obj &&
      typeof obj === 'object' &&
      (canAccessSuper ? key in obj : obj.hasOwnProperty(key))
        ? obj[key]
        : undefined,
    data
  );
}

/**
 * 是否可见
 */
export function isVisible(
  schema: {
    visibleOn?: string;
    hiddenOn?: string;
    visible?: boolean;
    hidden?: boolean;
  },
  data?: object
) {
  return !(
    schema.hidden ||
    schema.visible === false ||
    (schema.hiddenOn && evalExpression(schema.hiddenOn, data) === true) ||
    (schema.visibleOn && evalExpression(schema.visibleOn, data) === false)
  );
}

/**
 * 批量绑定函数
 */
export const bulkBindFunctions = function <
  T extends {
    [propName: string]: any;
  }
>(context: T, funNames: Array<FunctionPropertyNames<T>>) {
  funNames.forEach((key) => (context[key] = context[key].bind(context)));
};

/**
 * 判断是否为空
 */
export function isEmpty(thing: any) {
  if (isObject(thing) && Object.keys(thing).length) {
    return false;
  }

  return true;
}
