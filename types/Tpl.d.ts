declare namespace Tpl {
  interface Enginer {
    test: (tpl: string) => boolean;
    removeEscapeToken?: (tpl: string) => string;
    compile: (tpl: string, data: object, ...rest: Array<any>) => string;
  }
}
