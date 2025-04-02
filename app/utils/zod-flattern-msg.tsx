import { z, type SafeParseReturnType, type ZodIssue } from 'zod';

/* 注意：该函数不对相同或相近的message进行处理。一旦遇到，容易混淆 */
export function flatten_zod<T>(result: SafeParseReturnType<T, any>): string | null {
  if (!result.error) {
    return null;
  }

  const zodIssues = result.error.flatten((issue: ZodIssue) => ({
    message: issue.message,
  }));
  return flattenRecStrVal(zodIssues).join('\n');
}

/* 在 TypeScript 中，将嵌套Record输入转换为期望的输出，你需要编写一个函数来
递归地遍历输入对象，并将嵌套的键转换为扁平化的、点分隔的键。 下面是一个例子：
*/
export function flattenRecord(
  obj: Record<string, any>,
  prefix: string = '',
): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(result, flattenRecord(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

export function flattenRecStrVal(obj: any): string[] {
  const result: string[] = [];

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const y = obj[key];

      if (typeof y === 'object' && y !== null) {
        // 递归调用并使用扩展运算符将结果添加到 result 数组中
        result.push(...flattenRecStrVal(y));
      } else if (typeof y === 'string' && y !== '') {
        result.push(y);
      }
      /* 本函数只处理string类型 */
      /* else {
       * throw new Error("Invalid input");} */
    }
  }

  return result;
}
