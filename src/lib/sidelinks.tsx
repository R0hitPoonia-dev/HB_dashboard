import {
  LayoutDashboard,
  Box,
  PackageOpen,
  Boxes,
  ShoppingBag,
  User,
} from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}
export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Dashboard",
    label: "",
    href: "//dashboard/overview",
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: "Warehouse",
    label: "",
    href: "/warehouse",
    icon: <Box size={18} />,
    sub: [
      {
        title: "Products",
        label: "",
        href: "/warehouse/products",
        icon: <PackageOpen size={18} />,
      },
      {
        title: "Categories",
        label: "",
        href: "/warehouse/categories",
        icon: <Boxes size={18} />,
      },
    ],
  },
  {
    title: "Orders",
    label: "",
    href: "/orders",
    icon: <ShoppingBag size={18} />,
  },
  {
    title: "customers",
    label: "",
    href: "/customers",
    icon: <User size={18} />,
  },
  // {
  //   title: "Setting",
  //   label: "",
  //   href: "/setting",
  //   icon: <Bolt size={18} />,
  //   sub: [
  //     {
  //       title: "Profile",
  //       label: "",
  //       href: "/setting/profile",
  //       icon: <User size={18} />,
  //     },
  //     {
  //       title: "Management",
  //       label: "",
  //       href: "/setting/management",
  //       icon: <SquareChartGantt size={18} />,
  //     },
  //     {
  //       title: "Logout",
  //       label: "",
  //       href: "/setting/logout",
  //       icon: <Unplug size={18} />,
  //     },
  //   ],
  // },
];
