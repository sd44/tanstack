import DataTable from '../data-table';
import { fetchVisitsDatas, VISIT_COLUMNS } from './visits-data';
import { outputVisits } from '~/utils/visits-isomophic';

function MyPage() {
  const data = await fetchVisitsDatas();
  return (
    <div>
      <h2>Issues Table</h2>
      {/* 使用 DataTable 处理 Issue 类型 */}
      <DataTable<outputVisits> // 明确指定泛型类型
        data={data}
        columns={VISIT_COLUMNS}
      />

      <hr style={{ margin: '2rem 0' }} />
    </div>
  );
}

export default MyPage;
