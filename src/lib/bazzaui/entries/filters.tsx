import { createColumnConfigHelper } from '@bazza-ui/filters';
import type { LucideIcon } from 'lucide-react';
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

// 类型安全的图标映射
const sizeIconMap: Record<(typeof companySizeList)[number], LucideIcon> = {
  特大型: BuildingIcon,
  大型: UserRoundPlusIcon,
  中型: UsersRoundIcon,
  小型: Users2Icon,
  微型: UserIcon,
};

const industryCategoryIconMap: Record<(typeof industryCategoryList)[number], LucideIcon> = {
  第一产业: FactoryIcon,
  第二产业: CpuIcon,
  第三产业: LandmarkIcon,
};

const businessStatusIconMap: Record<(typeof businessStatusList)[number], LucideIcon> = {
  正常: ActivityIcon,
  异常: PauseIcon,
};

const sizeOpts = companySizeList.map((i) => ({
  label: i,
  value: i,
  icon: sizeIconMap[i],
}));

const industryCategoryOpts = industryCategoryList.map((i) => ({
  label: i,
  value: i,
  icon: industryCategoryIconMap[i],
}));

const businessStatusOpts = businessStatusList.map((i) => ({
  label: i,
  value: i,
  icon: businessStatusIconMap[i],
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
    .id('legalPersonName')
    .accessor((row) => row.legalPersonName)
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
    .id('companySize')
    .accessor((row) => row.companySize ?? '')
    .displayName('企业规模')
    .icon(UserRoundPlusIcon)
    .options(sizeOpts)
    .build(),

  dtf
    .number()
    .id('registeredCapital')
    .accessor((row) => row.registeredCapital ?? 0)
    .displayName('注册资本')
    .icon(LandmarkIcon)
    .build(),

  dtf
    .number()
    .id('employeeCount')
    .accessor((row) => row.employeeCount ?? 0)
    .displayName('员工人数')
    .icon(Users2Icon)
    .build(),

  dtf
    .option()
    .id('businessStatus')
    .accessor((row) => row.businessStatus ?? '')
    .displayName('经营状态')
    .icon(ActivityIcon)
    .options(businessStatusOpts)
    .build(),

  dtf
    .option()
    .id('industryCategory')
    .accessor((row) => row.industryCategory ?? '')
    .displayName('行业分类')
    .icon(FactoryIcon)
    .options(industryCategoryOpts)
    .build(),
] as const;
