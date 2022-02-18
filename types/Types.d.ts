declare namespace Types {
  interface Schema {
    type: string;
    children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null;
    [propName: string]: any;
  }
  type SchemaNode = Types.Schema | string | Array<Types.Schema | string>;

  interface PlainObject {
    [propsName: string]: any;
  }

  interface ApiObject extends Schema.SchemaApiObject {
    config?: {
      withCredentials?: boolean;
      cancelExecutor?: (cancel: Function) => void;
    };
    body?: PlainObject;
    query?: PlainObject;
    adaptor?: (payload: object, response: FetcherResult, api: ApiObject) => any;
    requestAdaptor?: (api: ApiObject) => ApiObject;
  }

  type ApiString = string;

  type Api = ApiString | ApiObject;

  interface ApiCacheConfig extends ApiObject {
    cachedPromise: Promise<any>;
    requestTime: number;
  }

  interface FetchOptions {
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    successMessage?: string;
    errorMessage?: string;
    autoAppend?: boolean;
    beforeSend?: (data: any) => any;
    onSuccess?: (json: Payload) => any;
    onFailed?: (json: Payload) => any;
    silent?: boolean;
    [propName: string]: any;
  }

  interface FetcherResult {
    data?: {
      data: object;
      status: number;
      msg: string;
      msgTimeout?: number;
      errors?: {
        [propName: string]: string;
      };
      type?: string;
      [propName: string]: any; // 为了兼容其他返回格式
    };
    status: number;
    headers: object;
  }

  interface Payload {
    ok: boolean;
    msg: string;
    msgTimeout?: number;
    data: any;
    status: number;
    errors?: {
      [propName: string]: string;
    };
  }

  type RendererDataAlias = RendererData;
  interface RendererData {
    [propsName: string]: any;
    __prev?: RendererDataAlias;
    __super?: RendererData;
  }

  interface Enginer {
    test: (tpl: string) => boolean;
    removeEscapeToken?: (tpl: string) => string;
    compile: (tpl: string, data: object, ...rest: Array<any>) => string;
  }

  interface Button {
    type: 'submit' | 'button' | 'reset';
    label?: string;
    icon?: string;
    size?: string;
    disabled?: boolean;
    className?: string;
  }

  interface Action extends Button {
    actionType?:
      | 'submit'
      | 'copy'
      | 'reload'
      | 'ajax'
      | 'dialog'
      | 'drawer'
      | 'jump'
      | 'link'
      | 'url'
      | 'email'
      | 'close'
      | 'confirm'
      | 'add'
      | 'remove'
      | 'delete'
      | 'edit'
      | 'cancel'
      | 'next'
      | 'prev'
      | 'reset'
      | 'reset-and-submit'
      | 'clear'
      | 'clear-and-submit';
    api?: Api;
    asyncApi?: Api;
    payload?: any;
    dialog?: SchemaNode;
    to?: string;
    target?: string;
    link?: string;
    url?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    mergeData?: boolean;
    reload?: string;
    messages?: {
      success?: string;
      failed?: string;
    };
    feedback?: any;
    required?: Array<string>;
    [propName: string]: any;
  }
}
