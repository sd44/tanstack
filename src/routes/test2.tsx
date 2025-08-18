import { createFileRoute } from '@tanstack/react-router';
import { Button } from '~/components/ui/button'; // 假设你使用了 shadcn/ui
import { useDeleteVisit, useGetVisitById } from '~/lib/db/CRUD/visits-crud';

export const Route = createFileRoute('/test2')({
  component: MyComponent,
});

function MyComponent() {
  // 1. 调用 hook 获取 mutation 对象
  const deleteMutation = useDeleteVisit();

  // 2. 获取查询对象，以便观察数据变化
  const getVisitQuery = useGetVisitById(327);

  // 3. 定义一个处理函数来调用 mutate
  const handleDelete = () => {
    console.log('即将删除 ID 为 327 的记录...');
    deleteMutation.mutate(327, {
      onSuccess: () => {
        console.log('删除成功！');
        // 删除成功后，TanStack Query 会自动让相关的查询失效并重新获取
        // 你也可以在这里手动刷新 getVisitQuery
        getVisitQuery.refetch();
      },
      onError: (error) => {
        console.error('删除失败:', error);
      },
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="font-bold text-xl">测试删除功能</h1>

      <div>
        <p className="font-semibold">要操作的 Visit ID: 327</p>
        <p>
          当前状态:
          {getVisitQuery.isLoading && <span>加载中...</span>}
          {getVisitQuery.isError && <span className="text-red-500">加载出错</span>}
          {getVisitQuery.data && (
            <pre className="mt-2 rounded bg-gray-100 p-2">
              {JSON.stringify(getVisitQuery.data, null, 2)}
            </pre>
          )}
          {!(getVisitQuery.data || getVisitQuery.isLoading) && (
            <span className="text-gray-500">记录不存在或已被删除</span>
          )}
        </p>
      </div>

      <div>
        <Button
          disabled={deleteMutation.isPending}
          onClick={handleDelete} // 当正在删除时，禁用按钮
        >
          {deleteMutation.isPending ? '正在删除...' : '执行删除 (ID: 327)'}
        </Button>
      </div>

      <div className="mt-4 rounded border p-2">
        <h2 className="font-semibold">Mutation 状态:</h2>
        <pre>{JSON.stringify(deleteMutation, null, 2)}</pre>
      </div>
    </div>
  );
}
