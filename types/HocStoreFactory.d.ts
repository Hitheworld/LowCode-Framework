declare namespace HocStoreFactory {
  type Comp<T> = <T extends React.ComponentType<Renderer.RendererProps>>;

  interface Renderer {
    storeType: string;
    extendsData?: boolean | ((props: any) => boolean);
    shouldSyncSuperStore?: (
      store: any,
      props: any,
      prevProps: any
    ) => boolean | undefined;
  }

  type Props = Omit<
    Renderer.RendererProps,
    'store' | 'data' | 'dataUpdatedAt' | 'scope'
  > & {
    // store?: Types.IIRendererStore;
    data?: Types.RendererData;
    scope?: Types.RendererData;
  };

  interface SubProps {
    data?: object;
    [propName: string]: any;
  }
}
