declare namespace Nav {
  interface Link {
    className?: string;
    label?: string | Schema.SchemaCollection;
    to?: string;
    target?: string;
    icon?: string;
    active?: boolean;
    activeOn?: string;
    unfolded?: boolean;
    children?: Links;
    defer?: boolean;
    loading?: boolean;
    loaded?: boolean;
    [propName: string]: any;
  }

  interface Links extends Array<Link> {}
}
