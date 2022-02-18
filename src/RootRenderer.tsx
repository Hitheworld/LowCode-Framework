import { renderChild } from './Root';

export function RootRenderer(props: RootRenderer.RootRendererProps) {
  const { pathPrefix, schema, ...rest } = props;
  return (
    <>
      {
        renderChild(pathPrefix!, schema, {
          ...rest,
          // data: this.store.downStream,
          // onAction: this.handleAction,
        }) as JSX.Element
      }
    </>
  );
}

export default RootRenderer;
