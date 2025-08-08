import { createCrudHooks } from '~/hooks/create-crud-hooks';
import {
  visitDelById,
  visitReadById,
  visitReadMyDatas,
  visitUpdateById,
} from '~/lib/db/CRUD/visit-datas';
import type { visitInsertT, visitSelectT, visitUpdateT } from '~/lib/db/schema/visits.schema';
import { visitCreate } from './visit-datas';

// ✨ 调用工厂函数，创建一套专门用于 'todos' 资源的 Hooks
// 我们使用别名来让 Hooks 的名字更具语义化
export const {
  useGetList: useGetVisits,
  useGetById: useGetVisitById,
  useCreate: useCreateVisit,
  useUpdate: useUpdateVisit,
  useDelete: useDeleteVisit,
  queryKeys: todoQueryKeys, // 也可导出 queryKeys 方便在其他地方使用
} = createCrudHooks<visitSelectT, visitInsertT, visitUpdateT>({
  resourceKey: 'todos', // Query Key
  crudOperations: {
    getList: () => visitReadMyDatas(),
    getById: (id) => visitReadById({ data: { id: Number(id) } }), // 包装为 params 对象
    create: (payload) => visitCreate({ data: payload }),
    update: (payload) => visitUpdateById({ data: payload }),
    remove: (id) => visitDelById({ data: { id: Number(id) } }), // 包装为 params 对象
  },
});
