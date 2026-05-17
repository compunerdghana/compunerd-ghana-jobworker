import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered username on mount
  const rememberedUsername = typeof window !== "undefined" ? localStorage.getItem("rememberUsername") : null;

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: rememberedUsername || "",
      password: "",
      rememberMe: !!rememberedUsername,
    },
  });

  const loginMutation = trpc.auth.login.useMutation();
  const { data: currentUser } = trpc.auth.me.useQuery();

  // Redirect to dashboard if already logged in
  if (currentUser) {
    setLocation("/");
    return null;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
      });

      if (result.success) {
        toast.success("Login successful!");
        if (data.rememberMe) {
          localStorage.setItem("rememberUsername", data.username);
        } else {
          localStorage.removeItem("rememberUsername");
        }
        setLocation("/");
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during login");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <img src="https://compunerdjob-cksdd5op.manus.space/logo.png" alt="CompuNerd Ghana" className="h-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-900">CompuNerd Ghana</CardTitle>
          <CardDescription className="text-base">Job Worker Management System</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        disabled={isLoading}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...form.register("rememberMe")}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p className="mt-2 text-xs">
              <strong>Admin:</strong> admin / Admin@123
            </p>
            <p className="text-xs">
              <strong>Manager:</strong> manager / Manager@123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
