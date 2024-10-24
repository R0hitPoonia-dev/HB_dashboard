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

import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
// import { fetchCategoryData } from "@/lib/fakedata";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { category } from "@/lib/schema";
import { useGetCategoriesQuery } from "@/redux/api/authApi";

const categoryColumns: ColumnDef<category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "subCategory",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sub Categories
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.subCategory.join(", ")}</div>,
    enableSorting: true,
  },
];

const CategoryTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<category[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const getCategories = useGetCategoriesQuery(null);

  const datafetching = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (getCategories.isSuccess) {
      setData(getCategories.data.categories);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await datafetching();
      setLoading(false);
    };
    fetchData();
  }, [getCategories.data]);

  const table = useReactTable({
    data: data ? data : [],
    columns: categoryColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
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
            <Input
              placeholder="Filter names..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
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
                      colSpan={categoryColumns.length}
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
              of <strong>{table.getRowCount()}</strong> products
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

export default CategoryTable;
