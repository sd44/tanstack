/**
   |--------------------------------------------------
   | TODO: 本实现是客户端向服务端API发起数据，服务端转换xlsx后返回。
   | 实现曲折，正常做法应当是服务端直接获取数据，转换为xlsx，客户端直接下载即可
   |--------------------------------------------------
 */
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { downloadFileWithAxios, postData } from '~/lib/utils/axios-download';

export const Route = createFileRoute('/test3')({
  component: RouteComponent,
});

function RouteComponent() {
  // State for the data fetched by the button click
  // State to track loading status for the button action
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store any error from the button action
  const [fetchError, setFetchError] = useState<Error | null>(null);

  // --- Async Event Handler for the Button ---
  const handleFetchClick = async () => {
    console.log('Button clicked, starting fetch...');
    setIsLoading(true); // Set loading to true
    setFetchError(null); // Clear previous errors

    try {
      console.log('正在获取用户数据...');
      const users = await fetchUsers();
      console.log(`获取到 ${users.length} 条用户数据。`);

      const newData = {
        data: users,
        columns: userColumns,
        worksheetName: '用户数据',
      };
      const x = await postData('/api/export-xlsx', newData);
      if (x) {
        downloadFileWithAxios(x);
      } else {
        console.log('发生错误: ', x);
      }
    } catch (error) {
      console.error('Failed to fetch users on click:', error);
      setFetchError(error instanceof Error ? error : new Error('An unknown error occurred')); // Set error state
    } finally {
      setIsLoading(false); // Set loading to false regardless of success/failure
      console.log('Fetch attempt finished.');
    }
  };

  return (
    <div>
      <h1>Test Route 3 - Interactive Fetch</h1>

      <Button onClick={handleFetchClick} disabled={isLoading}>
        {isLoading ? 'Fetching Users...' : 'Fetch Users Now'}
      </Button>

      {isLoading && <p>Loading...</p>}

      {/* Display error message if an error occurred */}
      {fetchError && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>Error fetching data: {fetchError.message}</p>
        </div>
      )}
    </div>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
  registeredAt: Date;
  isActive: boolean;
}

// 定义针对 User 数据的 Excel 列配置 (!!!)
// 这里的 key 必须是 User 接口中的属性名
const userColumns = [
  { header: '用户ID', key: 'id', width: 10 },
  { header: '姓名', key: 'name', width: 25 },
  { header: '电子邮件', key: 'email', width: 35 },
  {
    header: '注册时间',
    key: 'registeredAt',
    width: 20,
    style: { numFmt: 'yyyy-mm-dd hh:mm:ss' }, // 日期格式
  },
  {
    header: '是否活跃',
    key: 'isActive',
    width: 12,
    // 可以对布尔值进行转换显示
    // style: { }, // 暂无直接转换，通常在 addRows 前处理数据
  },
];
// 模拟获取特定数据
async function fetchUsers(): Promise<User[]> {
  // ... (获取用户数据的逻辑)
  return [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      registeredAt: new Date(new Date().toLocaleDateString('zh-CN')),
      isActive: true,
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      registeredAt: new Date(Date.now() - 86400000 * 5 + 1000 * 60 * 60 * 8),
      isActive: false,
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@sample.net',
      registeredAt: new Date(Date.now() - 86400000 * 30 + 1000 * 60 * 60 * 8),
      isActive: true,
    },
  ];
}
