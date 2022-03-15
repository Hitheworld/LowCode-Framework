declare namespace InputText {
  /**
   * Text 文本输入框。
   * 文档：
   */
  interface TextControlSchema extends Options.FormOptionsControl {
    type:
      | 'input-text'
      | 'input-email'
      | 'input-url'
      | 'input-password'
      | 'native-date'
      | 'native-time'
      | 'native-number';

    addOn?: {
      position?: 'left' | 'right';
      label?: string;
      icon?: string;
      className?: string;
    } & Action.ActionSchema;

    /**
     * 是否去除首尾空白文本。
     */
    trimContents?: boolean;

    /**
     * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
     * 接口可以返回匹配到的选项，帮助用户输入。
     */
    autoComplete?: Schema.SchemaApi;

    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';

    /**
     * 限制文字个数
     */
    maxLength?: number;

    /**
     * 是否显示计数
     */
    showCounter?: boolean;
  }

  interface TextProps extends Options.OptionsControlProps {
    placeholder?: string;
    addOn?: Action & {
      position?: 'left' | 'right';
      label?: string;
      icon?: string;
      className?: string;
    };
    creatable?: boolean;
    clearable: boolean;
    resetValue?: any;
    autoComplete?: any;
    allowInputText?: boolean;
    spinnerClassName: string;
  }
}
