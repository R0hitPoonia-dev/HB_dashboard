import React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, ListFilter, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  useGetCategoriesQuery,
  useGetProductsWithFilterMutation,
} from "@/redux/api/authApi";
import { category, Product } from "@/lib/schema";
import { Link } from "@tanstack/react-router";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.images[0]; // Assuming you're using the first image from the array
      return (
        <div
          className="h-10 w-10 overflow-hidden bg-cover bg-center max-w-[100px]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center w-[250px]"
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center max-w-[250px]">
        {row.getValue("productName")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center max-[150px]"
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center max-w-[150px] text-wrap">
        {row.getValue("category")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center max-[150px]"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-center max-w-[150px]">
        {row.getValue("status")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "qtyavailable",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center max-[150px]"
      >
        Quantity Available
        <ArrowUpDown className="ml-2 h-4 w-4 " />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center max-w-[150px]">
        {row.getValue("qtyavailable")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Price (USD)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);
      return <div className="text-center">{formattedPrice}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "totalSales",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Total Sales
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalSales")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modifiedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Last Modified
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const modifiedAt = new Date(
        row.getValue("modifiedAt")
      ).toLocaleDateString();
      return <div className="text-center">{modifiedAt}</div>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.productName)}
            >
              Copy product name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/warehouse/products/add-product/${product.pid}`}>
                View/Edit details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ProductTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [search, setSearch] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");
  const [categories, setCategories] = React.useState<category[]>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Product[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(100);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [getProduct, getProductHelper] = useGetProductsWithFilterMutation();
  const getCategories = useGetCategoriesQuery(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      getProduct({
        pagination: pagination,
        sort: sorting,
        search: search,
        category: filter,
      });
      setLoading(false);
    };
    fetchData();
  }, [pagination, sorting, search, filter]);

  React.useEffect(() => {
    if (getProductHelper.data) {
      setData(getProductHelper.data.data);
      setRowCount(getProductHelper.data.totalProducts);
    }
  }, [getProductHelper.data]);

  React.useEffect(() => {
    if (getCategories.isSuccess) {
      setCategories(getCategories.data.categories);
    }
  }, [getCategories.data]);

  const table = useReactTable({
    data: data ? data : [],
    columns: productColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: rowCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    debugTable: true,
  });

  if (loading) {
    return <div>Loading....</div>;
  } else {
    if (data) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Input
                placeholder="Filter names..."
                // value={
                //   (table.getColumn("productName")?.getFilterValue() as string) ??
                //   ""
                // }
                // onChange={(event) =>
                //   table
                //     .getColumn("productName")
                //     ?.setFilterValue(event.target.value)
                // }
                value={search}
                onChange={(e) => {
                  e.preventDefault();
                  setSearch(e.target.value);
                }}
                className="max-w-sm"
              />
              <div className="ml-auto flex items-center gap-2">
                <Select
                  onValueChange={(value) => {
                    setFilter(value);
                  }}
                >
                  <SelectTrigger className="h-7 gap-1">
                    {filter === "" ? (
                      <>
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Categories
                        </span>
                      </>
                    ) : (
                      filter
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={productColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>{`${pagination.pageIndex * pagination.pageSize + 1} - ${pagination.pageIndex * pagination.pageSize + pagination.pageSize}`}</strong>{" "}
              of <strong>{rowCount}</strong> products
            </div>
            <div className="flex flex-row">
              <button
                className="border rounded p-1"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
              <span>
                <Input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  placeholder="Go to Page"
                  // defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-32"
                />
              </span>
              {/* <span>
                | Go to page:
                <input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option
                    key={pageSize}
                    value={pageSize}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    Show {pageSize}
                  </option>
                ))}
              </select> */}
              {/* <span>{`sorting: ${JSON.stringify(sorting)}`}</span>
              <span>{`columnFilters: ${JSON.stringify(columnFilters)}`}</span>
              <span>{`rowSelection: ${JSON.stringify(rowSelection)}`}</span> */}
            </div>
          </CardFooter>
        </Card>
      );
    } else {
      return <div>No data available</div>;
    }
  }
};

export default ProductTable;
