import { ColumnDef, RowData } from '@tanstack/react-table';
import { User } from '~/lib/table/user';

export const USER_COLUMNS: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: () => <span>ID</span>,
    meta: { filterKey: 'id', filterVariant: 'number' },
  },
  {
    accessorKey: 'firstName',
    header: () => <span>First Name</span>,
    meta: { filterKey: 'firstName' },
  },
  {
    accessorKey: 'lastName',
    header: () => <span>Last Name</span>,
    meta: { filterKey: 'lastName' },
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    meta: { filterKey: 'age', filterVariant: 'number' },
  },

  {
    accessorKey: 't1',
    header: () => 't1',
    meta: { filterKey: 't1' },
  },
  {
    accessorKey: 't2',
    header: () => 't2',
    meta: { filterKey: 't2' },
  },

  {
    accessorKey: 't3',
    header: () => 't3',
    meta: { filterKey: 't3' },
  },
  {
    accessorKey: 't4',
    header: () => 't4',
    meta: { filterKey: 't4' },
  },
  {
    accessorKey: 't5',
    header: () => 't5',
    meta: { filterKey: 't5' },
  },
  {
    accessorKey: 't6',
    header: () => 't6',
    meta: { filterKey: 't6' },
  },
  {
    accessorKey: 't7',
    header: () => 't7',
    meta: { filterKey: 't7' },
  },
  {
    accessorKey: 't8',
    header: () => 't8',
    meta: { filterKey: 't8' },
  },
  {
    accessorKey: 't9',
    header: () => 't9',
    meta: { filterKey: 't9' },
  },
];
