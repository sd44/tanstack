import ExcelJS, { type Column } from 'exceljs'; // 显式导入 Column 类型

/**
 * 通用的将 JSON 数据数组导出为 Excel Buffer 的函数
 *
 * @param data 要导出的数据数组 (任意对象结构)
 * @param columns Excel 列定义 (ExcelJS.Column[] 类型)
 *                 - `header`: 列标题
 *                 - `key`: 对应 data 数组中对象的属性名 (必须匹配!)
 *                 - `width` (可选): 列宽
 *                 - `style` (可选): 单元格样式 (如数字格式: { numFmt: '0.00' })
 *                 - ... 其他 ExcelJS Column 属性
 * @param worksheetName 工作表名称 (可选, 默认为 'Sheet1')
 * @returns Promise<Buffer> 包含 Excel 文件内容的 Buffer
 * @throws Error 如果生成过程中发生错误
 */
export const jsonToExcelBuf = async (
  data: Record<string, any>[], // 接受任意对象的数组
  columns: Partial<Column>[], // 接受列定义数组 (使用 Partial<Column> 更灵活)
  worksheetName = 'Sheet1', // 默认工作表名
): Promise<ExcelJS.Buffer> => {
  // 基础验证
  if (!Array.isArray(data)) {
    throw new Error('导出失败：输入数据必须是一个数组。');
  }
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('导出失败：必须提供有效的列定义。');
  }
  if (!columns.every((col) => col.key && col.header)) {
    throw new Error('导出失败：每个列定义必须包含 "key" 和 "header" 属性。');
  }

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GenericExporter'; // 可以是你的应用名
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(worksheetName);

    // 1. 应用传入的列定义
    worksheet.columns = columns as Column[]; // 应用列定义 (断言回 Column[] 因为我们验证了 key/header)

    // 2. 可选: 添加通用表头样式 (如果需要的话)
    // 注意：如果列定义中已有样式，这里的样式可能会被覆盖或合并
    worksheet.getRow(1).font = { bold: true }; // 简单的加粗
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    // 你甚至可以把样式配置也作为参数传入

    // 3. 添加数据行 (使用传入的 data)
    worksheet.addRows(data);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`生成 Excel 数据失败: ${error.message}`);
    }
    throw new Error('生成 Excel 数据时发生未知错误');
  }
};
