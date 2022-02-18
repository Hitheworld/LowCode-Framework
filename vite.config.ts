import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src',
      },
      {
        find: /^~antd/,
        replacement: 'antd',
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // additionalData: `@import "antd/es/style/themes/index.less";`,
        // 重写 less 变量，定制样式
        // modifyVars: {
        //   // 'root-entry-name': 'default',
        //   // '@primary-color': 'red',
        // },
      },
    },
  },
});
