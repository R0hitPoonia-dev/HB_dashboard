// import { TypeOf, z } from "zod";

export interface adminSchema {
  // uid: number;
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
  role: "admin" | "user";
}

export interface getUserResponse {
  status: number;
  message: string;
  adminData: adminSchema;
}

export interface authResponse {
  status: number;
  message: string;
  token: string;
}

export interface loginUserRequest {
  email: string;
  password: string;
}

export interface registerUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface Product {
  _id: string;
  pid: number;
  productName: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  qtyavailable: number;
  totalSales: number;
  status: "active" | "deactive" | "draft";
  images: string[]; // array of image URLs
  variants: Variant[]; // assuming Variant is another interface
  addedAt: string; // ISO date string
  modifiedAt: string; // ISO date string
}

export interface category {
  name: string;
  subCategory: Array<string>;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  phone: string;
  status: "Order Placed" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  lastUpdated: string;
  orderDetails: OrderDetail[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  shippingAddress: ShippingAddress;
}

export interface OrderDetail {
  product: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface NewProductRequestBody {
  productName: string;
  qtyavailable: number;
  price: number;
  category: string;
  subCategory?: string;
  description?: string;
  variants: Variant[];
  status: "active" | "deactive" | "draft";
  images: File[];
}

export interface EditProductRequestBody {
  productName: string;
  qtyavailable: number;
  price: number;
  category: string;
  subCategory?: string;
  description?: string;
  variants: Variant[];
  status: "active" | "deactive" | "draft";
  newImages: File[];
  images: string[];
}

export interface Variant {
  color: string;
  stock: number;
}

export interface User {
  // id?: number; // Uncomment if you're using a custom id field, otherwise _id will be ObjectId by default
  name: string;
  email: string;
  profilePhoto?: string;
  // password: string;
  address?: ShippingAddress[];
  // spent: number; // Total amount spent by the user
  role: "user";
}
