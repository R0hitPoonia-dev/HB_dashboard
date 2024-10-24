import { useLocation } from "@tanstack/react-router";

export function CustomPageHeading() {
  const location = useLocation();
  const pathArray = location.pathname.split("/").filter((path) => path !== "");

  return (
    <h1 className="text-2xl font-bold tracking-tight">
      {pathArray[0].toUpperCase()}
    </h1>
  );
}
