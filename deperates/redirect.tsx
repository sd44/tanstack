import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/deperates/redirect')({
  beforeLoad: async () => {
    throw redirect({
      to: '/posts',
    })
  },
})
