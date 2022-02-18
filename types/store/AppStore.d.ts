import { AppActions } from '@/store/app';

declare namespace AppStore {
  interface State {
    pages: Array<App.AppPage> | App.AppPage | null;
    activePage: any;
    folded: boolean;
    offScreen: boolean;
    navigations: Array<AsideNav.Navigation>;
    bcn: Array<AsideNav.Navigation>;
  }

  interface ToggleExpand {
    id: string;
  }

  interface SetPages {
    pages: any[];
  }

  interface IAction {
    type: AppActions;
    payload: ToggleExpand;
  }
}
