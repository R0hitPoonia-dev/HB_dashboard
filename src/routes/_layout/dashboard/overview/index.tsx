import { Layout } from "@/components/custom/layout";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RecentSales } from "@/components/dashboard/recent-sales";
import { Overview } from "@/components/dashboard/overview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/dashboard/overview/")({
  component: overview,
});

function overview() {
  const cards = [
    {
      title: "Total Revenue",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      value: "$45,231.89",
      change: "+20.1% from last month",
    },
    {
      title: "Subscriptions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      value: "+2350",
      change: "+180.1% from last month",
    },
    {
      title: "Sales",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
      value: "+12,234",
      change: "+19% from last month",
    },
    {
      title: "Active Now",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      value: "+573",
      change: "+201 since last hour",
    },
  ];

  const overviewCards = [
    {
      title: "Overview",
      component: <Overview />,
    },
    {
      title: "Recent Sales",
      description: "You made 265 sales this month.",
      component: <RecentSales />,
    }
  ];

  return (
    <>
      {/* ===== Main ===== */}
      <Layout>
        <Layout.Body>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              {overviewCards.map((card, index) => (
                <Card
                  key={index}
                  className={index%2 === 0 ? "col-span-1 lg:col-span-4" : "col-span-1 lg:col-span-3"}
                >
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    {card.description && <CardDescription>{card.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className={index%2 === 0 ? "pl-2" : ""}>
                    {card.component}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </>
  );
}

//   return (
//     <>
//       {/* ===== Main ===== */}
//       <Layout>
//         <Layout.Body>
//           <div className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Total Revenue
//                   </CardTitle>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     className="h-4 w-4 text-muted-foreground"
//                   >
//                     <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">$45,231.89</div>
//                   <p className="text-xs text-muted-foreground">
//                     +20.1% from last month
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Subscriptions
//                   </CardTitle>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     className="h-4 w-4 text-muted-foreground"
//                   >
//                     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">+2350</div>
//                   <p className="text-xs text-muted-foreground">
//                     +180.1% from last month
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Sales</CardTitle>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     className="h-4 w-4 text-muted-foreground"
//                   >
//                     <rect width="20" height="14" x="2" y="5" rx="2" />
//                     <path d="M2 10h20" />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">+12,234</div>
//                   <p className="text-xs text-muted-foreground">
//                     +19% from last month
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Active Now
//                   </CardTitle>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     className="h-4 w-4 text-muted-foreground"
//                   >
//                     <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">+573</div>
//                   <p className="text-xs text-muted-foreground">
//                     +201 since last hour
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
//               <Card className="col-span-1 lg:col-span-4">
//                 <CardHeader>
//                   <CardTitle>Overview</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pl-2">
//                   <Overview />
//                 </CardContent>
//               </Card>
//               <Card className="col-span-1 lg:col-span-3">
//                 <CardHeader>
//                   <CardTitle>Recent Sales</CardTitle>
//                   <CardDescription>
//                     You made 265 sales this month.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <RecentSales />
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </Layout.Body>
//       </Layout>
//     </>
//   );
// }
