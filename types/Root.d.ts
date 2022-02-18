export = Root;

export as namespace Root;

declare namespace Root {
  interface RootRenderProps {
    location?: Location;
    theme?: string;
    [propName: string]: any;
  }

  interface RenderProps {
    location?: Location;
    [propName: string]: any;
  }

  interface RenderOptions {
    [propName: string]: any;
  }

  interface RendererEnv {
    [propName: string]: any;
  }

  interface RenderChildProps extends Partial<Renderer.RendererProps> {
    env: RendererEnv;
  }

  interface RootProps {
    schema: Types.SchemaNode;
    env: RendererEnv;
    theme: string;
    pathPrefix?: string;
    locale?: string;
    [propName: string]: any;
  }

  type ReactElement = React.ReactNode[] | JSX.Element | null | false;
}
