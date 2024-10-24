import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      {/* <Layout.Body> */}
      <Outlet />
      {/* </Layout.Body> */}
    </>
  );
}
