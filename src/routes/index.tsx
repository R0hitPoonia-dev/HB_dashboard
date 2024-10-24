import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      to: "/dashboard",
    });
  },
  component: () => <div>Redireting to dashboard.</div>,
});
