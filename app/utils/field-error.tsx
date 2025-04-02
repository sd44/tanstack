import type { AnyFieldApi } from '@tanstack/react-form';

export function ZodFieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-sm text-red-600">
          {field.state.meta.errors.map((err) => err.message).join(',')}
          {field.state.meta.isValidating ? '\n验证中...' : null}
        </p>
      ) : null}
    </>
  );
}

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-sm text-red-600">{field.state.meta.errors.join(',')}</p>
      ) : null}

      {field.state.meta.isValidating ? '验证中...' : null}
    </>
  );
}
