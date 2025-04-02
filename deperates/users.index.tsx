import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/deperates/users/')({
  component: UsersIndexComponent,
})

function UsersIndexComponent() {
  return <div>Select a user.</div>
}
