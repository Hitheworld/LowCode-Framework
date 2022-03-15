import React from 'react';
import { Form, Input } from 'antd';
import { Renderer, registerRenderer } from '@/factory';
import { OptionsControl } from './Options';

function InputTextRenderer(props) {
  const { label, name, required, message } = props;
  console.log('input-text==props:', props);
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
InputTextRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const TextControlRenderer = Renderer({
  type: 'input-text',
})(InputTextRenderer);

function InputPasswordRenderer(props) {
  const { label, name, required, message } = props;
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
InputPasswordRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const PasswordControlRenderer = Renderer({
  type: 'input-password',
})(InputPasswordRenderer);

function InputEmailRenderer(props) {
  const { label, name, required, message } = props;
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
InputEmailRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const EmailControlRenderer = Renderer({
  type: 'input-email',
  validations: 'isEmail',
})(InputEmailRenderer);

function InputUrlRenderer(props) {
  const { label, name, required, message } = props;
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
InputUrlRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const UrlControlRenderer = Renderer({
  type: 'input-url',
  validations: 'isUrl',
})(InputUrlRenderer);

function NativeDateRenderer(props) {
  const { label, name, required, message } = props;
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
NativeDateRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const NativeDateControlRenderer = Renderer({
  type: 'native-date',
})(NativeDateRenderer);

function NativeTimeRenderer(props) {
  const { label, name, required, message } = props;
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
NativeTimeRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const NativeTimeControlRenderer = Renderer({
  type: 'native-time',
})(NativeTimeRenderer);

function NativeNumberRenderer(props) {
  const { label, name, required, message } = props;
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Input />
    </Form.Item>
  );
}
NativeNumberRenderer.defaultProps = {
  required: false,
  message: '这是一个必填项',
};
export const NativeNumberControlRenderer = Renderer({
  type: 'native-number',
})(NativeNumberRenderer);
