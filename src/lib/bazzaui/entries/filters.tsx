import { createColumnConfigHelper } from '@bazzaui/filters';
import {
  ActivityIcon,
  Building2Icon,
  BuildingIcon,
  CpuIcon,
  FactoryIcon,
  LandmarkIcon,
  PauseIcon,
  PhoneIcon,
  UserIcon,
  UserRoundPlusIcon,
  Users2Icon,
  UsersRoundIcon,
} from 'lucide-react';
import type { enterprisesSelectT } from '~/lib/db/schema';
import { businessStatusList, companySizeList, industryCategoryList } from '~/lib/db/schema';

const sizeOpts = companySizeList.map((i) => ({
  label: i,
  value: i,
  icon: {
    微型: UserIcon,
    小型: Users2Icon,
    中型: UsersRoundIcon,
    大型: UserRoundPlusIcon,
    特大型: BuildingIcon,
  }[i],
}));
const industryCategoryOpts = industryCategoryList.map((i) => ({
  label: i,
  value: i,
  icon: {
    第一产业: FactoryIcon,
    第二产业: CpuIcon,
    第三产业: LandmarkIcon,
  }[i],
}));
const businessStatusOpts = businessStatusList.map((i) => ({
  label: i,
  value: i,
  icon: {
    正常: ActivityIcon,
    异常: PauseIcon,
  }[i],
}));

const dtf = createColumnConfigHelper<enterprisesSelectT>();

export const columnsConfig = [
  dtf
    .text()
    .id('companyName')
    .accessor((row) => row.companyName)
    .displayName('企业名称')
    .icon(Building2Icon)
    .build(),

  dtf
    .text()
    .accessor((row) => row.legalPersonName)
    .id('legalPersonName')
    .displayName('法定代表人')
    .icon(UserIcon)
    .build(),

  dtf
    .text()
    .id('legalPersonPhone')
    .accessor((row) => row.legalPersonPhone)
    .displayName('法定代表人手机')
    .icon(PhoneIcon)
    .build(),

  dtf
    .option()
    .accessor((row) => row.companySize)
    .id('companySize')
    .displayName('企业规模')
    .icon(UserRoundPlusIcon)
    .options(sizeOpts)
    .build(),
  dtf
    .number()
    .id('registeredCapital')
    .accessor((row) => row.registeredCapital)
    .displayName('注册资本')
    .icon(LandmarkIcon)
    .build(),
  dtf
    .number()
    .id('employeeCount')
    .accessor((row) => row.employeeCount)
    .displayName('员工人数')
    .icon(Users2Icon)
    .build(),
  dtf
    .option()
    .id('businessStatus')
    .accessor((row) => row.businessStatus)
    .displayName('经营状态')
    .icon(ActivityIcon)
    .options(businessStatusOpts)
    .build(),
  dtf
    .option()
    .id('industryCategory')
    .accessor((row) => row.industryCategory)
    .displayName('行业分类')
    .icon(FactoryIcon)
    .options(industryCategoryOpts)
    .build(),
] as const;
