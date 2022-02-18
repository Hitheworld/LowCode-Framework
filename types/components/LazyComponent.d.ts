declare namespace LazyComponent {
  interface LazyComponentProps {
    component?: React.ReactNode | string;
    getComponent?: () => Promise<React.ReactElement | string | any>;
    placeholder?: React.ReactElement | string;
    unMountOnHidden?: boolean;
    partialVisibility?: boolean;
    childProps?: object;
    visiblilityProps?: object;
    children: React.ReactElement | string;
    [propName: string]: any;
  }
}
