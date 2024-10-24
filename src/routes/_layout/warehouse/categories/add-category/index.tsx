import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, LoaderCircle, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { category } from "@/lib/schema";
import { useAddCategoryMutation } from "@/redux/api/authApi";
import { toast } from "@/hooks/use-toast";

export const Route = createFileRoute(
  "/_layout/warehouse/categories/add-category/"
)({
  component: AddCategory,
});

function AddCategory() {
  const newCategory: category = {
    name: "",
    subCategory: [],
  };
  const [category, setCategory] = useState<category>(newCategory);
  const [addNewCategory, addNewCategoryHelper] = useAddCategoryMutation();

  const handleSaveCategory = () => {
    addNewCategory({ categoryInfo: category });
    console.log(category);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCategory((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    setCategory((prev) => {
      const newSubCategory = [...prev.subCategory];
      newSubCategory[index] = value;
      return { ...prev, subCategory: newSubCategory };
    });
  };

  if (addNewCategoryHelper.isSuccess) {
    toast({
      title: "Category Added Successfully",
      duration: 2500,
    });
    setCategory(newCategory);
  }
  if (addNewCategoryHelper.isError) {
    toast({
      title: "Error Adding Category",
      description: JSON.stringify(addNewCategoryHelper.error),
      duration: 2500,
    });
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mb-5">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link to="/warehouse/categories">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Category
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={category.name}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Category Name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Sub Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Added Sub Categories:</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.subCategory.map((subCategory, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            id={`subCategory-${index}`}
                            value={subCategory}
                            onChange={(e) =>
                              handleSubCategoryChange(index, e.target.value)
                            }
                            placeholder="Enter Sub Category"
                          />
                        </TableCell>
                        <TableCell className="w-[100px]">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-3 p-1"
                            onClick={() =>
                              setCategory((prev) => ({
                                ...prev,
                                subCategory: category.subCategory.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                          >
                            <Trash2 className="h-3.5 w-4.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={() =>
                    setCategory((prev) => ({
                      ...prev,
                      subCategory: [...prev.subCategory, ""],
                    }))
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Sub Category
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8"></div>
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategory(newCategory);
            }}
          >
            Discard
          </Button>
          <Button size="sm" onClick={handleSaveCategory}>
            {addNewCategoryHelper.isLoading ? (
              <LoaderCircle size="sm" className="animate-spin" />
            ) : (
              "Save Category"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
