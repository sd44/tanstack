import { faker } from '@faker-js/faker';
import { fetchDatas } from '~/lib/table/fetchdatas';
import { Filters, PaginatedData } from '~/lib/table/types';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  t1: string;
  t2: string;
  t3: string;
  t4: string;
  t5: string;
  t6: string;
  t7: string;
  t8: string;
  t9: string;
};

export type UserFilters = Filters<User>;

function makeData(amount: number): User[] {
  return Array(amount)
    .fill(0)
    .map((_, index) => {
      return {
        id: index + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int(40),
        t1: faker.book.title(),
        t2: faker.book.title(),
        t3: faker.book.title(),
        t4: faker.book.title(),
        t5: faker.book.title(),
        t6: faker.book.title(),
        t7: faker.book.title(),
        t8: faker.book.title(),
        t9: faker.book.title(),
      };
    });
}

const data = makeData(1002);

export async function fetchUsers(filtersAndPagination: UserFilters): Promise<PaginatedData<User>> {
  console.log('fetchUsers', filtersAndPagination);
  return fetchDatas(filtersAndPagination, data);
}
