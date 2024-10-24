import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/customers")({
  component: Customers,
});

function Customers() {
  return (
    <>
      {/* <Layout.Body> */}
      <Outlet />
      {/* </Layout.Body> */}
    </>
  );
}
