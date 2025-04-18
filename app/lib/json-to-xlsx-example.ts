import { Column } from 'exceljs'; // 可能需要导入 Column 类型来定义列
import { exportJsonToExcel } from '~/utils/json-to-xlsx'; // 导入通用函数

// 假设这是你要导出的用户数据结构
interface User {
  id: number;
  name: string;
  email: string;
  registeredAt: Date;
  isActive: boolean;
}

// 模拟获取特定数据
async function fetchUsers(): Promise<User[]> {
  // ... (获取用户数据的逻辑)
  return [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      registeredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
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

export const userExample = async () => {
  try {
    // 1. 获取特定数据
    console.log('正在获取数据...');
    const usersData = await fetchUsers();
    console.log(`获取到 ${usersData.length} 条数据。`);

    // 2. 定义针对 User 数据的 Excel 列配置 (!!!)
    // 这里的 key 必须是 User 接口中的属性名
    const userColumns: Partial<Column>[] = [
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

    // -- 可选：数据预处理 (例如，将布尔值转换为文本) --
    const processedUserData = usersData.map((user) => ({
      ...user,
      isActive: user.isActive ? '是' : '否', // 将布尔值转为文本
    }));
    // 如果做了预处理，确保列定义中的 key ('isActive') 对应的是处理后的数据结构

    // 3. 调用通用的导出函数
    console.log('API Route: 调用 exportJsonToExcel 生成 Buffer...');
    const file = await exportJsonToExcel(
      processedUserData, // 传递处理后的数据
      userColumns, // 传递用户数据的列配置
      '用户报告', // 指定工作表名称
    );
    return file;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '处理导出请求时发生内部服务器错误';
    return new Response(errorMessage, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};
