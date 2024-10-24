// import { AuthContext } from "@/lib/auth";
import { ThemeProviderState } from "@/components/custom/theme-provider";
import { AuthContext } from "@/lib/auth";
import {
  Outlet,
  // createRootRoute,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
  auth: AuthContext;
  theme: ThemeProviderState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  ),
});
