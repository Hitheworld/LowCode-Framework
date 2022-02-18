declare namespace IRenderer {
  interface IRendererState {
    hasRemoteData: boolean;
    data: any;
    initedAt: number; // 初始 init 的时刻
    updatedAt: number; // 从服务端更新时刻
    pristine: any;
    action: undefined | object;
    dialogOpen: boolean;
    dialogData: undefined | object;
    drawerOpen: boolean;
    drawerData: undefined | object;
  }

  enum Actions {
    initData = 'initData',
    reset = 'reset',
    updateData = 'updateData',
    changeValue = 'changeValue',
    setCurrentAction = 'setCurrentAction',
    openDialog = 'openDialog',
    closeDialog = 'closeDialog',
    openDrawer = 'openDrawer',
    closeDrawer = 'closeDrawer',
  }

  interface IAction {
    type: Actions;
    // payload: ID | Todo;
  }
}
