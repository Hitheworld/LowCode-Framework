import {} from 'react';
import { Result, Button } from 'antd';
import { updateLocation, jumpTo, isCurrentUrl } from '@/utils/appUtils';

function NotFound() {
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在！"
        extra={
          <Button type="primary" onClick={() => jumpTo('goBack')}>
            返回首页
          </Button>
        }
      />
    </>
  );
}

export default NotFound;
