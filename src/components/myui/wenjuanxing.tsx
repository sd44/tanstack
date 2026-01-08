import { useEffect, useRef } from 'react';

interface WenjuanxingEmbedProps {
  activityId: string;
  width?: number | string; // 允许数字或字符串，如 '100%'
  containerStyle?: React.CSSProperties; // 允许传递自定义样式
}

export const WenjuanxingEmbed: React.FC<WenjuanxingEmbedProps> = ({
  activityId,
  width = 600, // 默认宽度
  containerStyle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptId = `wjx-script-${activityId}`; // 创建唯一 ID 以便清理

  useEffect(() => {
    // 获取容器元素
    const container = containerRef.current;
    if (!container) return;

    // 检查脚本是否已存在，防止重复添加（例如在开发模式下的 Fast Refresh）
    if (document.getElementById(scriptId)) {
      // 如果脚本已存在，并且容器为空（可能因为 Fast Refresh 清理了 DOM），
      // 可能需要重新触发脚本逻辑或重新添加脚本。
      // 最简单的策略通常是允许它在效果清理后重新添加。
      // console.log(`Script ${scriptId} already exists.`);
      // return; // 或者根据需要执行其他逻辑
    }

    // 创建 script 元素
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    // 构建脚本 URL
    const scriptSrc = `https://www.wjx.cn/handler/jqemed.ashx?activity=${activityId}&width=${width}&source=iframe`;
    script.src = scriptSrc;
    script.async = true; // 异步加载

    // 将 script 元素添加到容器 div 中
    // 问卷星的这个脚本通常会在此脚本标签所在的位置注入 iframe
    container.appendChild(script);

    // 清理函数：在组件卸载时移除脚本和可能由脚本创建的内容
    return () => {
      // 移除脚本本身
      const existingScript = document.getElementById(scriptId);
      if (existingScript?.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      // 清理容器内容（iframe 等）
      // 这是为了确保下次挂载时容器是干净的
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
    // 依赖项数组：当 activityId 或 width 改变时，重新执行 effect
  }, [activityId, width, scriptId]); // 添加 scriptId 到依赖确保 ID 改变时重新运行

  return (
    <div
      key={activityId}
      ref={containerRef}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        ...containerStyle,
      }}
    >
      {/* 容器 div，脚本将在此处注入 iframe */}
      {/* 可以添加加载状态提示 */}
      <p>问卷努力加载中……</p>
    </div>
  );
};
