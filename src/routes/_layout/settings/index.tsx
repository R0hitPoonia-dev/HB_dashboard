import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/settings/')({
  component: () => <div>Hello /_layout/settings/!</div>
})