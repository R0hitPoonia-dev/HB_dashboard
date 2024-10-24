import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/orders")({
  component: Orders,
});

function Orders() {
  return (
    <>
      {/* <Layout.Body> */}
      <Outlet />
      {/* </Layout.Body> */}
    </>
  );
}
