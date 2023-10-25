import { mapTree, findTree, guid } from '@/utils/helper';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';
import { AppActions } from '@/store/constants';

function rewrite(state: AppStore.State, to: string, env: Env.RendererEnv) {
  let page = findTree(state.pages, (item) => {
    if (item.path === to) {
      return true;
    }
    return false;
  });
  if (page) {
    setActivePage(state, page, env);
  }
}

// 设置活动页面
function setActivePage(
  state: AppStore.State,
  page: any,
  env: Env.RendererEnv,
  params?: any
) {
  // 同一个页面直接返回。
  if (state.activePage?.id === page.id) {
    return {
      ...state,
    };
  }
  let bcn: Array<any> = [];
  findTree(state.pages, (item, index, level, paths) => {
    if (item.id === page?.id) {
      bcn = paths.filter((item) => item.path && item.label);
      bcn.push({
        ...item,
        path: '',
      });
      // state.__;
      if (bcn[0].path !== '/') {
        bcn.unshift({
          label: '首页',
          path: '/',
        });
      }
      return true;
    }
    return false;
  });
  state.activePage = {
    ...page,
    params: params || {},
    bcn,
  };
  state.bcn = bcn;

  if (page.label) {
    document.title = page.label;
  }

  if (page.schema) {
    state.schema = page.schema;
    state.schemaKey = '' + Date.now();
  } else if (page.schemaApi) {
    state.schema = null;
    // state.fetchSchema(page.schemaApi, state.activePage, { method: 'get' });
  } else if (page.redirect) {
    // env.jumpTo(page.redirect);
    jumpTo(page.redirect);
    return;
  } else if (page.rewrite) {
    rewrite(state, page.rewrite, env);
  } else {
    state.schema = null;
    state.schemaKey = '';
  }
}

function getNavigations(pages: Array<AsideNav.Navigation>) {
  if (Array.isArray(pages)) {
    return mapTree(pages, (item) => {
      let visible = item.visible;
      if (
        visible !== false &&
        item.path &&
        !~item.path.indexOf('http') &&
        ~item.path.indexOf(':')
      ) {
        visible = false;
      }
      return {
        label: item.label,
        icon: item.icon,
        path: item.path,
        children: item.children,
        className: item.className,
        visible,
      };
    });
  }
  return [
    {
      label: '导航',
      children: [],
    },
  ];
}

function getNav(pages: Array<AsideNav.Navigation>) {
  if (Array.isArray(pages)) {
    return mapTree(pages, (item) => {
      let visible = item.visible;
      if (
        visible !== false &&
        item.path &&
        !~item.path.indexOf('http') &&
        ~item.path.indexOf(':')
      ) {
        visible = false;
      }
      return {
        label: item.label,
        icon: item.icon,
        path: item.path,
        children: item.children,
        className: item.className,
        visible,
      };
    });
  }
  return [
    {
      label: '导航',
      children: [],
    },
  ];
}

// 2. 创建所有操作
const reducer = (state: AppStore.State, action: AppStore.IAction) => {
  switch (action.type) {
    // 设置页面
    case AppActions.SET_PAGES:
      const _pages = action.payload.pages || [];
      let _pageList = [];
      if (_pages && !Array.isArray(_pages)) {
        _pageList = [_pages];
      }
      // else if (!Array.isArray(_pages)) {
      //   return state;
      // }
      _pageList = mapTree(_pages, (item, index, level, paths) => {
        let path = item.link || item.url;
        if (item.schema || item.schemaApi) {
          path =
            item.url ||
            `/${paths
              .map((item) => item.index)
              .concat(index)
              .map((index) => `page-${index + 1}`)
              .join('/')}`;
          if (path && path[0] !== '/') {
            let parentPath = '/';
            let length = paths.length;
            while (length > 0) {
              const oItem = paths[length - 1];
              if (oItem?.path) {
                parentPath = oItem.path + '/';
                break;
              }
              length--;
            }
            path = parentPath + path;
          }
        }
        return {
          ...item,
          index,
          id: item.id || guid(),
          label: item.label,
          icon: item.icon,
          path,
        };
      });

      let id = 1;
      const _list = mapTree(
        getNav(_pageList),
        (item: any) => {
          const _path = item?.children?.length
            ? item?.children?.[0]?.path
            : item?.path;
          return {
            ...item,
            path: _path,
            id: id++,
          };
        },
        1,
        true
      );

      return {
        ...state,
        pages: _pageList,
        navigations: _list,
      };
    // 更新当前活动页面
    case AppActions.UPDATE_ACTIVE_PAGE:
      const pages = state.pages;
      const env = action.payload.env;
      if (!Array.isArray(pages)) {
        return state;
      }
      let matched: any;
      let page = findTree(pages, (item) => {
        if (item.path) {
          // matched = env.isCurrentUrl(item.path, item);
          matched = isCurrentUrl(item.path, item);
          if (matched) {
            return true;
          }
        }
        return false;
      });

      if (page) {
        setActivePage(
          state,
          page,
          env,
          typeof matched === 'object' ? matched.params : undefined
        );
      } else {
        const page = findTree(pages, (item) => item.isDefaultPage);
        if (page) {
          setActivePage(state, page, env);
        } else {
          state.activePage = null;
        }
      }
      return {
        ...state,
      };
    default:
      throw new Error('unknown type');
      return state;
  }
};

export default reducer;
