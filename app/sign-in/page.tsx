'use client'
import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { SigninSchema, SigninSchemaType } from "@/lib/validators/schema_validator/signin.schema";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const SignIn = () => {
  const [authError, setAuthError] = useState<string|null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signIn, isLoaded, setActive } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async(data: SigninSchemaType) => {
    if(!isLoaded) return;
    setAuthError(null);
    try {
      const result = await signIn.create({identifier: data.identifier, password: data.password});
      if(result.status === "complete") {
        await setActive({session: result.createdSessionId});
      } else {
        setAuthError("Authentication failed. please try again");
      }
    } catch (err: any) {
      setAuthError(err.errors?.[0]?.longMessage ?? err.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-dvh px-10 max-sm:px-5 py-10">
      <Card className="max-w-md w-full max-sm:max-w-sm rounded-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signin-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="identifier">Identifier</FieldLabel>
                <Input
                  {...register("identifier")}
                  id="identifier"
                  placeholder="username or email"
                  className="rounded-md"
                  required
                />
                {errors.identifier && <p className="text-sm text-destructive">
                  {errors.identifier.message}
                </p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative w-full">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword? "text":"password"}
                    placeholder="********"
                    className="rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-none text-muted-foreground cursor-pointer"
                  >
                    {showPassword
                        ? <Eye className="w-4 h-4"/>
                        : <EyeOff className="w-4 h-4"/>}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>}
              </Field>
              {authError && <Field>
                <p className="text-sm text-destructive text-left">
                  {authError}
                </p>
              </Field>}
              <Field>
                <Button
                  type="submit"
                  form="signin-form"
                  variant={"outline"}
                  disabled={isSubmitting}
                  className="rounded-md cursor-pointer"
                >
                  {isSubmitting? (
                    <span className="flex">
                      <Loader className="mr-1 w-4 h-4 animate-spin"/>
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </Button>
                <FieldDescription className="text-center">
                  Don't have an account?{" "}
                  <a href="/sign-up">SignUp</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn