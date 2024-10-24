import { createFileRoute, redirect, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/dashboard/")({
  loader: () => {
    throw redirect({
      to: "/dashboard/overview",
    });
  },
  component: () => (
    <div>
      Hello, Please go to{" "}
      <Link to="/dashboard/overview"> warehouse/products</Link>{" "}
      /dashboard/overview!
    </div>
  ),
});
