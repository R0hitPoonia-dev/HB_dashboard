import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/card-wrapper";

export const Route = createFileRoute("/_layout-1/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      console.log(context.auth);
      throw redirect({ to: search.redirect || "/" });
    }
  },
  component: LoginPage,
});

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(1, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export type LoginInput = TypeOf<typeof FormSchema>;

function LoginPage() {
  // const user = useAppSelector((state) => state.auth.user);
  const [load, setLoad] = React.useState<boolean>(true);
  const search = Route.useSearch();
  const router = useRouter();
  const navigate = Route.useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = form;
  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth }),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setLoad(true);
    await auth.login({ email: data.email, pass: data.password });
    await router.invalidate(); // Invalidate the router to ensure state updates

    // Pass an object to navigate with a 'to' property
    navigate({ to: search.redirect || "/dashboard" }); // Corrected navigation method
    setLoad(false); // Set load false after processing
  };

  // Add a useEffect to handle the state change
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      console.log("Authenticated, navigating to dashboard...");
      navigate({ to: search.redirect || "/dashboard" }); // Redirect after successful login
    }
  }, [auth.isAuthenticated, search.redirect, navigate]);

  return (
    <div className="flex h-screen justify-center items-center">
      <CardWrapper
        headerlabel="Welcome Back"
        backbuttonhref="/register"
        backbuttonlabel="Don't have an account?"
        discription="Welcome Back.."
        showsocial={false}
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="text-brown text-xl font-semibold"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="flex flex-row font-semibold">
                    Email:
                    <FormMessage className="ml-3 font-medium" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="tyler.durden@fightclub.com"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="flex flex-row font-semibold">
                    Password:
                    <FormMessage className="ml-3 font-medium" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="You don't talk about it." />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="w-full my-3"
              type="submit"
              disabled={isSubmitSuccessful && load}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}

export default LoginPage;
