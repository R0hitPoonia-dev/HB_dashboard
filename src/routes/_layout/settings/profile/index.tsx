import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/settings/profile/')({
  component: () => <div>Hello /_layout/settings/profile/!</div>
})