import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout-1")({
  component: () => (
    <>
      {/* <div>Hello /_layout/_layout!</div> */}
      <Outlet />
    </>
  ),
});
