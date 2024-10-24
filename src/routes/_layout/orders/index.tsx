import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import OrderTable from "@/components/tables/OrderTable";
import { PaginationState, SortingState } from "@tanstack/react-table";
import React from "react";
import { Order } from "@/lib/schema";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreVertical, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useGetOrdersWithFilerMutation } from "@/redux/api/authApi";

export const Route = createFileRoute("/_layout/orders/")({
  component: OrderPage,
});

function OrderPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<Order[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [rowCount, setRowCount] = React.useState(100);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [orderWithFilter, orderWithFilterHelper] =
    useGetOrdersWithFilerMutation();
  const datafetching = async () => {
    try {
      // Fetch the order data with the current pagination and sorting
      await orderWithFilter({ pagination, sort: sorting });
      // Log the raw response data for debugging
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        duration: 3000,
      });
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await datafetching();
      setLoading(false);
    };
    fetchData();
  }, [pagination, sorting]);

  React.useEffect(() => {
    if (orderWithFilterHelper.isSuccess && orderWithFilterHelper.data) {
      // console.log("Raw response data:", orderWithFilterHelper.data.data);
      const transformedOrders = orderWithFilterHelper.data.data.map(
        (order: any) => {
          const transformedOrder: Order = {
            id: order.orderId,
            date: new Date(order.createdAt).toISOString(),
            customer: order.userId.name,
            email: order.userId.email,
            phone: "", // Add phone if available in the response
            status: order.status === "active" ? "Order Placed" : "Cancelled",
            lastUpdated: new Date(order.createdAt).toISOString(),
            orderDetails: Object.values(order.cart.products).map(
              (item: any) => ({
                product: String(item.product.productName),
                price: Number(item.product.price),
                quantity: Number(item.quantity),
              })
            ),
            subtotal: order.cart.totalPrice,
            shipping: order.cart.deliveryCharges,
            tax: order.cart.gst,
            total: order.cart.payablePrice,
            paymentMethod: "Unknown", // Extract if available
            paymentId: order.paymentId,
            shippingAddress: {
              address: order.shippingAddress.street,
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              name: order.userId.name,
              zip: order.shippingAddress.pinCode,
            },
          };
          return transformedOrder;
        }
      );

      // Log the transformed orders for debugging
      // console.log("Transformed orders:", transformedOrders);
      setRowCount(orderWithFilterHelper.data.totalOrders);
      // Set the transformed data to state
      setData(transformedOrders);
    }
  }, [orderWithFilterHelper.data]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Your Orders</CardTitle>
              <CardDescription className="text-balance max-w-lg leading-relaxed">
                Introducing Our Dynamic Orders Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Create New Order</Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">${`1000`}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-xs text-muted-foreground">
                +25% from last week
              </div> */}
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">${`1000`}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-xs text-muted-foreground">
                +10% from last month
              </div> */}
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        {/*create table for orders Table on 13/10/24 */}
        <OrderTable
          data={data}
          loading={loading}
          pagination={pagination}
          rowCount={rowCount}
          setPagination={setPagination}
          setSorting={setSorting}
          sorting={sorting}
          setSelectedOrder={setSelectedOrder}
        />
      </div>
      <div>
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          {selectedOrder ? (
            <>
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order: {selectedOrder.id}
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedOrder.id);
                        toast({
                          title: "Copied To Clipboard",
                          description: "Copied:  " + selectedOrder.id,
                          duration: 1000,
                        });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: {selectedOrder.date}</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Change Status
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${selectedOrder.subtotal}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${selectedOrder.shipping}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${selectedOrder.tax}</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>${selectedOrder.total}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-1 not-italic text-muted-foreground">
                    <span>
                      <strong>Name:</strong>
                      {`  ${selectedOrder.shippingAddress.name}`}
                    </span>
                    <span>
                      <strong>Address:</strong>
                      {`  ${selectedOrder.shippingAddress.address}`}
                    </span>
                    <span>
                      <strong>City:</strong>
                      {`  ${selectedOrder.shippingAddress.city}`}
                    </span>
                    <span>
                      <strong>State:</strong>
                      {`  ${selectedOrder.shippingAddress.state}`}
                    </span>
                    <span>
                      <strong>ZipCode:</strong>
                      {`  ${selectedOrder.shippingAddress.zip}`}
                    </span>
                  </address>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>{selectedOrder.customer}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href={"mailto:" + selectedOrder.email}>
                          {selectedOrder.email}
                        </a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href={"tel:" + selectedOrder.phone}>
                          {selectedOrder.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated {selectedOrder.lastUpdated}
                </div>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>Please Select a Product</CardHeader>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
