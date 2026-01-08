import type { AnyFieldApi, AnyFieldMeta } from '@tanstack/react-form';

export function FieldMetaErr({ meta }: { meta: AnyFieldMeta }) {
  // 判断是否有需要显示的错误
  const hasVisibleErrors = meta.isTouched && meta.errors.length > 0;

  // 生成错误信息字符串，没有错误时为空字符串
  const errorMessage = hasVisibleErrors ? meta.errors.map((err) => err.message).join(',') : '';

  return (
    // 添加 min-h-5 (保证最小高度)
    // 根据 hasVisibleErrors 条件性地添加 'invisible' class
    // 'invisible' class 设置 visibility: hidden;
    <p className={`min-h-5 w-full text-red-600 text-sm ${hasVisibleErrors ? '' : 'invisible'}`}>
      {/* 始终渲染 errorMessage（可能为空字符串） */}
      {errorMessage}
    </p>
  );
}

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-red-600 text-sm">{field.state.meta.errors.join(',')}</p>
      ) : null}

      {field.state.meta.isValidating ? '验证中...' : null}
    </>
  );
}
