/**
   |--------------------------------------------------
   | TODO: 本实现是客户端向服务端API发起数据，服务端转换xlsx后返回。
   | 实现曲折，正常做法应当是服务端直接获取数据，转换为xlsx，客户端直接下载即可
   |--------------------------------------------------
 */
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/test4')({
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

      const rows = users.map((row) => ({
        姓名: row.name,
        生日: row.email,
        注册日期: row.registeredAt,
        是否活跃: row.isActive ? '是' : '否',
      }));
      /* generate worksheet and workbook */
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
      const length = [20, 20, 30, 15];
      worksheet['!cols'] = length.map((x) => {
        return {
          wch: x,
        };
      });

      /* create an XLSX file and try to save to Presidents.xlsx */
      XLSX.writeFile(workbook, 'Presidents.xlsx', { compression: true });
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

// 模拟获取特定数据
async function fetchUsers(): Promise<User[]> {
  return [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      registeredAt: new Date(new Date().toLocaleString('zh-CN')),
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
