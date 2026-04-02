export interface OptionNode {
  children?: OptionNode[]; // 子节点数组（可选，递归）
  label: string; // 标签
  value: string; // 值
}
