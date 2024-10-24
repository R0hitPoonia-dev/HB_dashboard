import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/warehouse")({
  component: Warehouse,
});

function Warehouse() {
  return (
    <>
      {/* <Layout.Body> */}
      <Outlet />
      {/* </Layout.Body> */}
    </>
  );
}
