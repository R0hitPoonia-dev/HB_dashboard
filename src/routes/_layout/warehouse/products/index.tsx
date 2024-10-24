import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductTable from "@/components/tables/ProductTable";

export const Route = createFileRoute("/_layout/warehouse/products/")({
  component: Warehouse,
});

function Warehouse() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card x-chunk="dashboard-06-chunk-0" className="my-2">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <div className="ml-auto flex items-center gap-2">
                {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button> */}
                <Link to="/warehouse/products/add-product">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Product
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
    </main>
  );
}
