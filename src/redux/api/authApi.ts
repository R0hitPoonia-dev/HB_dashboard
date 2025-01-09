/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	getUserResponse,
	loginUserRequest,
	authResponse,
	registerUserRequest,
	NewProductRequestBody,
	category,
	Product,
	EditProductRequestBody,
} from "@/lib/schema";
import { PaginationState, SortingState } from "@tanstack/react-table";

export const authApi = createApi({
	reducerPath: "authapi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_URL,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		getUser: builder.query<getUserResponse, null>({
			query: () => ({
				url: `/user/profile`,
				method: "GET",
				headers: {
					authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			}),
			// async onQueryStarted(_args, { dispatch, queryFulfilled }) {
			//   try {
			//     const user = (await queryFulfilled).data.adminData;
			//     dispatch(
			//       loginUser({
			//         email: user.email,
			//         name: user.name,
			//         password: "",
			//         profilePhoto: user.profilePhoto,
			//         role: user.role,
			//       })
			//     );
			//   } catch (error) {
			//     console.log(error);
			//   }
			// },
		}),
		loginUser: builder.mutation<any, loginUserRequest>({
			query(credentials: loginUserRequest) {
				return { url: "/user/login", method: "POST", body: credentials };
			},
			async onQueryStarted(_args, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					sessionStorage.setItem("token", (await queryFulfilled).data?.token);
					await dispatch(authApi.endpoints.getUser.initiate(null));
				} catch (error: any) {
					throw new Error(error.message ? error.message : "Error occured  while logging in");
				}
			},
		}),
		registerUser: builder.mutation<authResponse, registerUserRequest>({
			query(userData: registerUserRequest) {
				return { url: "/user/signup", method: "POST", body: userData };
			},
			async onQueryStarted(_args, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					sessionStorage.setItem("token", (await queryFulfilled).data.token);
					await dispatch(authApi.endpoints.getUser.initiate(null));
				} catch (error) {
					console.log(error);
				}
			},
		}),
		logoutUser: builder.mutation<void, void>({
			query() {
				return {
					url: "/user/logout",
					credentials: "include",
				};
			},
		}),
		addProduct: builder.mutation<any, { productInfo: NewProductRequestBody }>({
			query: ({ productInfo }) => {
				const formData = new FormData();

				formData.append("productName", productInfo.productName);
				formData.append("description", productInfo.description ? productInfo.description : "");
				formData.append("category", productInfo.category ? String(productInfo.category) : "");
				formData.append("variants", JSON.stringify(productInfo.variants));

				formData.append("price", productInfo.price ? String(productInfo.price) : "0");
				formData.append(
					"subCategory",
					productInfo.subCategory ? String(productInfo.subCategory) : ""
				);
				formData.append("status", productInfo.status ? String(productInfo.status) : "");
				if (productInfo.images !== null) {
					for (let index = 0; index < productInfo.images.length; index++) {
						formData.append("images", productInfo.images[index], productInfo.images[index].name);
					}
				}
				return {
					url: "/product",
					method: "POST",
					transformResponse: (response: string) => {
						return JSON.parse(response).id;
					},
					body: formData,
				};
			},
		}),
		addCategory: builder.mutation<any, { categoryInfo: category }>({
			query: ({ categoryInfo }) => {
				return {
					url: "/category",
					method: "POST",
					transformResponse: (response: string) => {
						return JSON.parse(response).id;
					},
					body: categoryInfo,
				};
			},
		}),
		getCategories: builder.query<any, null>({
			query: () => {
				return {
					url: "/category",
					method: "GET",
				};
			},
		}),
		updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
			query: (order) => ({
				url: `/order/${order.id}`,
				method: "PATCH",
				body: { status: order.status },
				headers: {
					"Content-Type": "application/json", // Ensure JSON content type is set
				},
			}),
		}),

		getOrdersWithFiler: builder.mutation<any, { sort: SortingState; pagination: PaginationState }>({
			query: ({ sort, pagination }) => {
				let filterString = `/order?limit=${pagination.pageSize}&page=${pagination.pageIndex + 1}`;
				if (sort.length > 0) {
					let sortString = "";
					sort.forEach((item, index) => {
						if (index == 0) {
							if (item.desc) sortString += `-${item.id}`;
							else sortString += `${item.id}`;
						} else {
							if (item.desc) sortString += `,-${item.id}`;
							else sortString += `,${item.id}`;
						}
					});
					filterString += `&sort=${sortString}`;
				}
				return {
					url: `${filterString}`,
					method: "GET",
				};
			},
		}),
		deleteProduct: builder.mutation({
			query: (productId) => ({
				url: `/products/${productId}`,
				method: "DELETE",
			}),
		}),
		getProductsWithFilter: builder.mutation<
			any,
			{
				category?: string;
				sort: SortingState;
				pagination: PaginationState;
				search?: string;
			}
		>({
			query: ({ category, sort, pagination, search }) => {
				let filterString = `/product?limit=${pagination.pageSize}&page=${pagination.pageIndex + 1}`;
				if (category) {
					filterString += `&category=${category}`;
				}
				if (sort.length > 0) {
					let sortString = "";
					sort.forEach((item, index) => {
						if (index == 0) {
							if (item.desc) sortString += `-${item.id}`;
							else sortString += `${item.id}`;
						} else {
							if (item.desc) sortString += `,-${item.id}`;
							else sortString += `,${item.id}`;
						}
					});
					filterString += `&sort=${sortString}`;
				}
				if (search?.length != undefined && search.length >= 1) {
					return {
						url: `/product/search?name=${search}`,
						method: "GET",
					};
				}
				return {
					url: `${filterString}`,
					method: "GET",
				};
			},
		}),
		getProductById: builder.query<{ message: string; data: Product }, string>({
			query: (id) => {
				return {
					url: `/product/${id}`,
					method: "GET",
				};
			},
		}),
		editProduct: builder.mutation<any, { productId: string; product: EditProductRequestBody }>({
			query: ({ product, productId }) => {
				const formData = new FormData();

				formData.append("productName", product.productName);
				formData.append("description", product.description ? product.description : "");
				formData.append("category", product.category ? String(product.category) : "");
				formData.append("variants", JSON.stringify(product.variants));
				formData.append("images", JSON.stringify(product.images));

				formData.append("price", product.price ? String(product.price) : "0");
				formData.append("subCategory", product.subCategory ? String(product.subCategory) : "");
				formData.append("status", product.status ? String(product.status) : "");

				if (product.newImages !== null && product.newImages.length > 0) {
					for (let index = 0; index < product.images.length; index++) {
						formData.append("newImages", product.newImages[index], product.newImages[index].name);
					}
				}
				return {
					url: `/product/${productId}`,
					method: "PATCH",
					transformResponse: (response: string) => {
						return JSON.parse(response).id;
					},
					body: formData,
				};
			},
		}),
		getAllUser: builder.mutation<any, { sort: SortingState; pagination: PaginationState }>({
			query: ({ sort, pagination }) => {
				let filterString = `/user?limit=${pagination.pageSize}&page=${pagination.pageIndex + 1}`;
				if (sort.length > 0) {
					let sortString = "";
					sort.forEach((item, index) => {
						if (index == 0) {
							if (item.desc) sortString += `-${item.id}`;
							else sortString += `${item.id}`;
						} else {
							if (item.desc) sortString += `,-${item.id}`;
							else sortString += `,${item.id}`;
						}
					});
					filterString += `&sort=${sortString}`;
				}
				return {
					url: filterString,
					method: "GET",
				};
			},
		}),
	}),
});

// Action Creators
export const {
	useLoginUserMutation,
	useLogoutUserMutation,
	useRegisterUserMutation,
	useLazyGetUserQuery,
	useAddProductMutation,
	useGetCategoriesQuery,
	useAddCategoryMutation,
	useDeleteProductMutation,
	useGetOrdersWithFilerMutation,
	useGetProductsWithFilterMutation,
	useGetUserQuery,
	useUpdateOrderStatusMutation,
	useGetProductByIdQuery,
	useEditProductMutation,
	useGetAllUserMutation,
} = authApi;
