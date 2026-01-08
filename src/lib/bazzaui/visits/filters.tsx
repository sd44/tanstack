'use client';
import { createColumnConfigHelper } from '@bazzaui/filters';
import {
  Building2Icon,
  CalendarArrowUpIcon,
  FootprintsIcon,
  PersonStandingIcon,
  PhoneCallIcon,
  SendToBackIcon,
  SpeechIcon,
  TypeIcon,
  UserPenIcon,
  VideoIcon,
} from 'lucide-react';
import type { visitSelectT } from '~/lib/db/schema';

const dtf = createColumnConfigHelper<visitSelectT>();

export const columnsConfig = [
  dtf
    .text()
    .id('companyName')
    .accessor((row) => row.companyName)
    .displayName('企业名称')
    .icon(Building2Icon)
    .build(),

  dtf
    .date()
    .accessor((row) => row.visitTime)
    .id('visitTime')
    .displayName('走访时间')
    .icon(CalendarArrowUpIcon)
    .build(),

  dtf
    .option()
    .id('visitType')
    .accessor((row) => row.visitType)
    .displayName('走访类型')
    .icon(TypeIcon)
    .options([
      { value: '微信交流', label: '微信交流', icon: VideoIcon },
      { value: '电话联系', label: '电话联系', icon: PhoneCallIcon },
      { value: '实地走访', label: '实地走访', icon: FootprintsIcon },
    ])
    .build(),

  dtf
    .text()
    .accessor((row) => row.visitedPerson)
    .id('visitedPerson')
    .displayName('被走访人')
    .icon(UserPenIcon)
    .build(),

  dtf
    .boolean()
    .id('hasCompanyDemand')
    .accessor((row) => (row.hasCompanyDemand ? '有' : '无'))
    .displayName('企业诉求')
    .icon(SpeechIcon)
    .toggledStateName('诉求')
    .build(),

  dtf
    .boolean()
    .id('isCompleted')
    .accessor((row) => (row.isCompleted ? '是' : '否'))
    .displayName('是否办结')
    .icon(SendToBackIcon)
    .toggledStateName('办结')
    .build(),

  dtf
    .date()
    .id('completionTime')
    .accessor((row) => row.completionTime)
    .displayName('办结时间')
    .icon(CalendarArrowUpIcon)
    .build(),

  dtf
    .text()
    .id('completionPersonName')
    .accessor((row) => row.completionPersonName)
    .displayName('办结人')
    .icon(PersonStandingIcon)
    .build(),
] as const;
