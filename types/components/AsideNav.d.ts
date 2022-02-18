declare namespace AsideNav {
  type LinkItem = LinkItemProps;
  interface LinkItemProps {
    id?: number;
    label: string;
    hidden?: boolean;
    open?: boolean;
    active?: boolean;
    className?: string;
    children?: Array<LinkItem>;
    path?: string;
    icon?: string;
    component?: React.ReactType;
  }

  interface LinkItemProps {
    id?: number;
    label: string;
    hidden?: boolean;
    open?: boolean;
    active?: boolean;
    className?: string;
    children?: Array<LinkItem>;
    path?: string;
    icon?: string;
    component?: React.ReactType;
  }

  interface Navigation {
    label: string;
    children: Array<LinkItem>;
    prefix?: JSX.Element;
    affix?: JSX.Element;
    className?: string;
    [propName: string]: any;
  }
}
