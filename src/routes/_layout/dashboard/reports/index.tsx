import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/dashboard/reports/')({
  component: () => <div>Hello /_layout/dashboard/reports/!</div>
})