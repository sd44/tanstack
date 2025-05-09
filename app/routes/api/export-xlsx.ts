import { createAPIFileRoute } from '@tanstack/react-start/api';
import { Column } from 'exceljs'; // 可能需要导入 Column 类型来定义列
import { jsonToExcelBuf } from '../../utils/json-to-xlsx'; // 导入通用函数

interface JsonToExcelBufParams {
  data: Record<string, any>[]; // 接受任意对象的数组
  columns: Partial<Column>[]; // 接受列定义数组 (使用 Partial<Column> 更灵活)
  worksheetName?: string; // 默认工作表名
}

export const APIRoute = createAPIFileRoute('/api/export-xlsx')({
  POST: async ({ request }) => {
    const body: JsonToExcelBufParams = await request.json();
    const data = body.data;
    const columns = body.columns;
    const worksheetName = body.worksheetName ?? 'sheet1';
    try {
      // -- 可选：数据预处理 (例如，将布尔值转换为文本) --
      const processedUserData = data.map((item) => ({
        ...item,
        isActive: item.isActive ? '是' : '否', // 将布尔值转为文本
      }));
      // 如果做了预处理，确保列定义中的 key ('isActive') 对应的是处理后的数据结构

      // 调用通用的导出函数
      console.log('API Route: 调用 exportJsonToExcel 生成 Buffer...');
      const buffer = await jsonToExcelBuf(processedUserData, columns, worksheetName);

      // 返回成功的 Response
      console.log('API Route: Buffer 已生成，正在发送响应...');
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="users-report-${Date.now()}.xlsx"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } catch (error) {
      console.error('API Route /api/export-users Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : '处理导出请求时发生内部服务器错误';
      return new Response(errorMessage, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
});
