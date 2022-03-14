import React from 'react';
import { Form, Input } from 'antd';
import { Renderer, registerRenderer } from '@/factory';
import { OptionsControl } from './Options';

function InputTextRenderer(props) {
  return (
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>
  );
}
export default Renderer({
  type: 'input-text',
})(InputTextRenderer);

// function InputPasswordRenderer() {
//   return <Input.Password />;
// }
// export OptionsControl({
//   type: 'input-password',
// })(InputPasswordRenderer);

// function InputEmailRenderer() {
//   return <Input />;
// }
// export OptionsControl({
//   type: 'input-email',
//   validations: 'isEmail',
// })(InputEmailRenderer);

// function InputUrlRenderer() {
//   return <Input />;
// }
// export OptionsControl({
//   type: 'input-url',
//   validations: 'isUrl',
// })(InputUrlRenderer);

// function NativeDateRenderer() {
//   return <Input />;
// }
// export OptionsControl({
//   type: 'native-date',
// })(InputDateRenderer);

// function NativeTimeRenderer() {
//   return <Input />;
// }
// export OptionsControl({
//   type: 'native-time',
// })(NativeTimeRenderer);

// function NativeNumberRenderer() {
//   return <Input />;
// }
// export OptionsControl({
//   type: 'native-number',
// })(NativeNumberRenderer);
