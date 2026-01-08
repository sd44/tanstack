import { type Row, type SortingFn } from "@tanstack/react-table";

// 定义一个符合 TanStack Table 类型的中文排序函数
export const chineseSort: SortingFn<any> = (
    rowA: Row<any>,
    rowB: Row<any>,
    columnId: string
): number => {
    const valueA = rowA.getValue(columnId) as string;
    const valueB = rowB.getValue(columnId) as string;

    // 使用 'zh-CN' locale 进行比较
    return valueA.localeCompare(valueB, 'zh-CN');
};
