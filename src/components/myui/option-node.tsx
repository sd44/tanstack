export interface OptionNode {
  label: string; // 标签
  value: string; // 值
  children?: OptionNode[]; // 子节点数组（可选，递归）
}
