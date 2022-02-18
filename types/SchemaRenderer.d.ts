declare namespace SchemaRenderer {
  interface SchemaRendererProps extends Partial<Renderer.RendererProps> {
    schema: Types.Schema;
    $path: string;
    env: Env.RendererEnv;
  }
}
