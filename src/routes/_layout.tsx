import { CustomBreadcrumb } from "@/components/custom/breadcrumb";
import { Layout } from "@/components/custom/layout";
import { CustomPageHeading } from "@/components/custom/pageHeading";
import Sidebar from "@/components/custom/sidebar";
import ThemeSwitch from "@/components/custom/theme-switch";
import { UserNav } from "@/components/custom/user-nav";
import { useAuth } from "@/lib/auth";
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_layout")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Main,
});

function Main() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: "/" });
        });
      });
    }
  };
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [auth]);
  return (
    <div className="relative h-full overflow-hidden bg-background">
      {/* <SkipToMain /> */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? "md:ml-14" : "md:ml-64"} h-full`}
      >
        <Layout>
          <Layout.Header>
            <div>
              <CustomPageHeading />
              <CustomBreadcrumb />
            </div>
            <div className="ml-auto flex items-center space-x-4">
              {/* <Input
            type="search"
            placeholder="Search..."
            className="md:w-[100px] lg:w-[300px]"
          /> */}
              <ThemeSwitch />
              <UserNav handleLogout={handleLogout} />
            </div>
          </Layout.Header>
        </Layout>
        <Outlet />
      </main>
    </div>
  );
}
