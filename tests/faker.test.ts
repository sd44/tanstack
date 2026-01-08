import { test } from 'bun:test';
import { fakerZH_CN as faker } from '@faker-js/faker';
import type { User } from 'better-auth';

interface FakerUser extends User {
  avatar?: string;
  birthday?: Date;
  sex?: 'male' | 'female';
  firstName?: string;
  lastName?: string;
  subscriptionTier?: string;
}

// sextype只有英文，最好用arrayElement自定义 '男',女'
test('faker zh_CN', () => {
  function createRandomUser(overwrites: Partial<FakerUser> = {}): FakerUser {
    const {
      id = faker.string.uuid(),
      name = faker.person.fullName(),
      emailVerified = faker.datatype.boolean(),
      createdAt = faker.date.past(),
      updatedAt = faker.date.recent(),
      image = faker.image.avatar(),
      avatar = faker.image.avatar(),
      birthday = faker.date.birthdate(),
      sex = faker.person.sexType(),
      firstName = faker.person.firstName(sex),
      lastName = faker.person.lastName(),
      email = faker.internet.email({ firstName, lastName }),
      subscriptionTier = faker.helpers.arrayElement(['free', 'basic', 'business']),
    } = overwrites;

    return {
      id,
      name,
      email,
      emailVerified,
      createdAt,
      updatedAt,
      image,
      avatar,
      birthday,
      firstName,
      lastName,
      sex,
      subscriptionTier,
    };
  }

  const _user = createRandomUser();
  const _userToReject = createRandomUser({ birthday: new Date('2124-10-20') });
});

interface CompSeed {
  companyName: string;
  address: string;
  legalPersonName: string;
  legalPersonPhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  companySize: string;
  registeredCapital: number;
  employeeCount: number;
  businessStatus: string;
  industryCategory: string;
}

function generateRandomTask(): CompSeed {
  return {
    companyName: faker.company.name(),
    address: faker.location.city() + faker.location.streetAddress(),
    legalPersonName: faker.person.fullName(),
    legalPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
    contactPerson: faker.person.fullName(),
    contactPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
    companySize: faker.helpers.arrayElement(['特大型', '大型', '中型', '小型', '微型']),
    registeredCapital: faker.number.int({ min: 0, max: 5000 }),
    employeeCount: faker.number.int({ min: 1, max: 3000 }),
    businessStatus: faker.helpers.arrayElement(['正常', '异常']),
    industryCategory: faker.helpers.arrayElement(['第一产业', '第二产业', '第三产业']),
  };
}

test('company seed data', () => {
  const _a = generateRandomTask();
  const _b = generateRandomTask();
});
