import ExcelJS, { Column } from 'exceljs'; // 显式导入 Column 类型

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
  worksheetName: string = 'Sheet1', // 默认工作表名
): Promise<Buffer> => {
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
    console.log(
      `[exportJsonToExcel] 开始为 ${data.length} 条记录生成名为 "${worksheetName}" 的工作表...`,
    );

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
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    // 你甚至可以把样式配置也作为参数传入

    // 3. 添加数据行 (使用传入的 data)
    if (data.length > 0) {
      worksheet.addRows(data);
      console.log(`[exportJsonToExcel] 已添加 ${data.length} 行数据。`);
    } else {
      console.log('[exportJsonToExcel] 数据数组为空，生成仅包含表头的 Excel 文件。');
    }

    // 4. 调整列宽 (可选，可以根据内容自动调整，但可能影响性能)
    // worksheet.columns.forEach(column => {
    //   if (column.key) { // 确保 column 和 key 存在
    //      let maxLength = column.header?.length ?? 10; // 使用 '??' 提供默认值
    //      data.forEach(item => {
    //        const cellValue = item[column.key!]; // 使用 '!' 断言 key 存在
    //        const cellLength = cellValue ? String(cellValue).length : 0;
    //        if (cellLength > maxLength) {
    //          maxLength = cellLength;
    //        }
    //      });
    //      column.width = maxLength < 10 ? 10 : maxLength + 2; // 设定最小宽度和一点边距
    //   }
    // });

    // 5. 生成 Buffer
    console.log('[exportJsonToExcel] 正在生成 Excel Buffer...');
    const buffer = await workbook.xlsx.writeBuffer();
    console.log(`[exportJsonToExcel] Buffer 生成完毕，大小: ${buffer.byteLength} bytes`);
    return buffer as Buffer;
  } catch (error) {
    console.error('[exportJsonToExcel] 生成 Excel 时出错:', error);
    if (error instanceof Error) {
      throw new Error(`生成 Excel 数据失败: ${error.message}`);
    } else {
      throw new Error('生成 Excel 数据时发生未知错误');
    }
  }
};
