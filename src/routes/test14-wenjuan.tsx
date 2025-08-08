import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test14-wenjuan')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>Hello "/test14-wenjuan"!</div>
      <MyPage />
    </div>
  );
}

import { WenjuanxingEmbed } from '~/components/myui/wenjuanxing';

function MyPage() {
  return (
    <div>
      <h1>我的问卷调查</h1>
      <WenjuanxingEmbed
        activityId="YDktlsX"
        containerStyle={{ border: '1px solid #ccc', minHeight: '500px' }}
        width={850} // 添加一些样式
      />
      <p>问卷下方的内容</p>
    </div>
  );
}

export default MyPage;
