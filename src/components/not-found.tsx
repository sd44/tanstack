import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">{children || <p>该网页不存在</p>}</div>
      <p className="flex flex-wrap items-center gap-2">
        <Button
          className="rounded bg-emerald-500 px-2 py-1 font-black text-sm text-white uppercase"
          onClick={() => window.history.back()}
        >
          返回上一页
        </Button>
        <Link
          className="rounded bg-cyan-600 px-2 py-1 font-black text-sm text-white uppercase"
          to="/"
        >
          返回主页
        </Link>
      </p>
    </div>
  );
}
