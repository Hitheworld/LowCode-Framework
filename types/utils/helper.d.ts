declare namespace Helper {
  interface TreeItem {
    children?: TreeArray;
    [propName: string]: any;
  }
  interface TreeArray extends Array<TreeItem> {}
}
