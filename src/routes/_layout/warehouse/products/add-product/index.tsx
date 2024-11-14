import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  LoaderCircle,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState, useEffect } from "react";
import { NewProductRequestBody } from "@/lib/schema";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
} from "@/redux/api/authApi";
import { toast } from "@/hooks/use-toast";

export const Route = createFileRoute(
  "/_layout/warehouse/products/add-product/"
)({
  component: Addproduct,
});

interface category {
  name: string;
  subCategory: Array<string>;
}

function Addproduct() {
  const newProduct: NewProductRequestBody = {
    productName: "",
    description: "",
    variants: [],
    subCategory: "",
    price: 0,
    qtyavailable: 0,
    category: "",
    status: "active",
    images: [],
  };
  const [categories, setCategories] = useState<category[]>([]);
  const statuses = ["draft", "active", "deactive"];
  const [product, setProduct] = useState<NewProductRequestBody>(newProduct);
  const [addNewProduct, addNewProductHelper] = useAddProductMutation();
  const getCategories = useGetCategoriesQuery(null);

  const handleSaveProduct = () => {
    // Here you can implement API call to save the product
    addNewProduct({ productInfo: product });
    console.log(product);
  };

  useEffect(() => {
    if (getCategories.isSuccess) {
      setCategories(getCategories.data.categories);
      console.log(categories);
    }
  }, [getCategories.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({ ...prev, [id]: value }));
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: number | string
  ) => {
    setProduct((prev) => {
      const newVariant = [...prev.variants];
      newVariant[index] = { ...newVariant[index], [field]: value };
      return { ...prev, variants: newVariant };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // const reader = new FileReader();
    if (files) {
      // reader.readAsDataURL(files);
      // reader.onloadend = () => {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
        // images: reader.result,
      }));
      // };
    }
  };

  useEffect(() => {
    if (addNewProductHelper.isSuccess) {
      toast({
        title: "Product Added Successfully",
        duration: 2500,
      });
      setProduct(newProduct);
    }
    if (addNewProductHelper.isError) {
      toast({
        title: "Error Adding Product",
        description: JSON.stringify(addNewProductHelper.error),
        duration: 2500,
      });
    }
  }, [addNewProductHelper]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mb-5">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link to="/warehouse/products">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Product
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            In stock
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link to="/warehouse/products">
              <Button variant="outline" size="sm">
                Discard
              </Button>
            </Link>
            <Button size="sm" onClick={handleSaveProduct}>
              {addNewProductHelper.isLoading ? (
                <LoaderCircle size="sm" className="animate-spin" />
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex flex-row w-full gap-3">
                    <div className="grid gap-3 w-full">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="productName"
                        type="text"
                        value={product.productName}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Product Name"
                      />
                    </div>
                    <div className="grid gap-3 w-full">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={product.price}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Product Name"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={product.description}
                      onChange={(e) => {
                        setProduct((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }));
                      }}
                      placeholder="Write discription for your product..."
                      className="min-h-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Stock</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Varient</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((Variant, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            id={`stock-${index}-color`}
                            value={Variant.color}
                            type="text"
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "color",
                                e.target.value
                              )
                            }
                            placeholder="Enter Color"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            id={`stock-${index}-quantity`}
                            value={Variant.stock}
                            type="number"
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                            placeholder="Enter quantity"
                          />
                        </TableCell>
                        <TableCell className="w-[100px]">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-3 p-1"
                            onClick={() =>
                              setProduct((prev) => ({
                                ...prev,
                                variants: product.variants.filter(
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
                    setProduct((prev) => ({
                      ...prev,
                      variants: [...prev.variants, { color: "", stock: 0 }],
                    }))
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Variant
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-07-chunk-2">
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) => {
                        setProduct((pre) => ({ ...pre, category: value }));
                      }}
                    >
                      <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subcategory">Subcategory (optional)</Label>
                    <Select
                      onValueChange={(value) => {
                        setProduct((pre) => ({ ...pre, subCategory: value }));
                      }}
                    >
                      <SelectTrigger
                        id="subcategory"
                        aria-label="Select subcategory"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => {
                          if (category.name === product.category) {
                            return category.subCategory?.map(
                              (subcategory, index) => (
                                <SelectItem key={index} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              )
                            );
                          }
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(
                        value: "draft" | "active" | "deactive"
                      ) => {
                        setProduct((pre) => {
                          return { ...pre, status: value };
                        });
                      }}
                    >
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status, index) => (
                          <SelectItem key={index} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content">
                {/* first photo */}
                <div className="grid gap-2">
                  {product.images.length > 0 && (
                    <img
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      width="300"
                      src={URL.createObjectURL(product.images[0])}
                    />
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {/* other photos */}

                    {product.images.map(
                      (image, index) =>
                        index > 0 && (
                          <img
                            key={index}
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={URL.createObjectURL(image)}
                            width="84"
                          />
                        )
                    )}
                    {/* <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"> */}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>

                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        multiple
                        onChange={handleImageUpload}
                      />
                    </Button>

                    {/* <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setProduct(newProduct);
            }}
          >
            Discard
          </Button>
          <Button size="sm" onClick={handleSaveProduct}>
            {addNewProductHelper.isLoading ? (
              <LoaderCircle size="sm" className="animate-spin" />
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
