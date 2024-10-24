import { createFileRoute, redirect, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/warehouse/")({
  loader: () => {
    throw redirect({
      to: "/warehouse/products",
    });
  },
  component: () => (
    <div>
      Hello, Please go to{" "}
      <Link to="/warehouse/products"> warehouse/products</Link> !
    </div>
  ),
});
