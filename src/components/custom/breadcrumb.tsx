import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";

export function CustomBreadcrumb() {
  const location = useLocation();
  const pathArray = location.pathname.split("/").filter((path) => path !== "");

  return (
    <Breadcrumb>
      {pathArray.map((path, index) => (
        <BreadcrumbItem key={index}>
          {index === pathArray.length - 1 ? (
            <BreadcrumbPage>{path}</BreadcrumbPage>
          ) : (
            <Link to={`/${pathArray.slice(0, index + 1).join("/")}`}>
              {path}
            </Link>
          )}
          {index < pathArray.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
