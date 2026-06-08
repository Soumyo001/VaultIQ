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
  FieldGroup,
  FieldDescription,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { SignupSchema, SignupSchemaType } from "@/lib/validators/schema_validator/signup.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs/legacy";
import { useState } from "react";
import { toast } from "sonner";


const SignUp = () => {
  const [authError, setAuthError] = useState<string|null>(null);
  const [verificationError, setVerificationError] = useState<string|null>(null);
  const [code, setCode] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [resendInterval, setResendInterval] = useState<number>(0);
  const { signUp, isLoaded, setActive } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: ""
    }
  });

  const onSubmit = async(data: SignupSchemaType) => {
    if(!isLoaded) return;
    setAuthError(null);
    try {
      await signUp.create({
        username: data.username,
        emailAddress: data.email,
        password: data.password
      });
      await signUp.prepareEmailAddressVerification({strategy: "email_code"});
      setVerifying(true);
    } catch (err: any) {
      setAuthError(err.errors?.[0]?.longMessage ?? err.message);
    }
  }

  const handleVerification = async() => {
    if(!isLoaded) return;
    setVerificationError(null);
    setIsVerifying(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({code: code});
      if(result.status === "complete") {
        await setActive({session: result.createdSessionId});
      } else {
        setVerificationError("Verification failed. please try again");
      }
    } catch (err: any) {
      setVerificationError(err.errors?.[0]?.longMessage ?? err.message);
    } finally {
      setIsVerifying(false);
    }
  }

  const handleResend = async() => {
    if(resendInterval > 0 || !isLoaded) return;
    setVerificationError(null);
    try {
      await signUp.prepareEmailAddressVerification({strategy: 'email_code'});
      setResendInterval(60);
      const interval = setInterval(() => {
        setResendInterval(prev => {
          const next = prev - 1;
          if(next <= 1) {
            clearInterval(interval);
            return 0;
          }
          return next;
        });
      }, 1000);
    } catch (err: any) {
      setVerificationError(err.errors?.[0]?.longMessage ?? err.message);
      setResendInterval(0);
    }
  }

  if(verifying) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-dvh px-10 max-sm:px-5 py-10">
        <Card className="max-w-md w-full rounded-md max-sm:max-w-sm">
          <CardHeader>
            <CardTitle>Verification</CardTitle>
            <CardDescription>Enter the code to verify your email</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="v-code">Verification code</FieldLabel>
                <Input
                  id="v-code"
                  type="text"
                  placeholder="Enter your 6-digit code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="rounded-md"
                  required
                />
              </Field>
              {verificationError && <Field>
                <p className="text-sm text-destructive text-left">
                  {verificationError}
                </p>
              </Field>}
              <Field>
                <Button
                  type="button"
                  variant={'outline'}
                  disabled={isVerifying}
                  onClick={handleVerification}
                  className='rounded-md cursor-pointer'
                >
                  {isVerifying? (
                      <span className="flex">
                        <Loader className="mr-1 w-4 h-4 animate-spin"/>
                        Verifying...
                      </span>
                    ) : "Verify"}
                </Button>
                <FieldDescription className="text-center">
                  Didn't recive code yet?{" "}
                  {resendInterval > 0 ? (
                    <span>{`00:${String(resendInterval).padStart(2,"0")}`}</span>
                  ):(
                    <a onClick={handleResend} className="cursor-pointer">resend</a>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-dvh px-10 max-sm:px-5 py-10">
      <Card className="max-w-md w-full rounded-md max-sm:max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Enter your details to create account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="revenuegainer101"
                  required
                  className="rounded-md"
                />
                {errors.username && <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="rounded-md"
                />
                {errors.email && <p className="text-sm text-destructive">
                  {errors.email.message}
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
                    required
                    className="rounded-md"
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
              <Field>
                <FieldLabel className="password-confirm">Password Confirm</FieldLabel>
                <div className="relative w-full">
                  <Input
                    {...register("passwordConfirm")}
                    id="password-confirm"
                    type={showPasswordConfirm? "text":"password"}
                    placeholder="********"
                    required
                    className="rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(prev => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-none text-muted-foreground cursor-pointer"
                  >
                    {showPasswordConfirm
                            ? <Eye className="w-4 h-4"/>
                            : <EyeOff className="w-4 h-4"/>}
                  </button>
                </div>
                {errors.passwordConfirm && <p className="text-sm text-destructive">
                  {errors.passwordConfirm.message}
                </p>}
              </Field>
              {authError && <Field>
                <p className="text-sm text-destructive text-left">
                  {authError}
                </p>
              </Field>}
              <Field>
                <div id="clerk-captcha" 
                  data-cl-theme="dark" 
                  data-cl-size="flexible" 
                  data-cl-language="en-us" 
                />
                <Button
                  type="submit"
                  form="signup-form"
                  variant={"outline"}
                  disabled={isSubmitting}
                  className="rounded-md cursor-pointer"
                >
                  {isSubmitting? (
                    <span className="flex text-muted-foreground">
                      <Loader className="mr-1 w-4 h-4 animate-spin"/>
                      creating account...
                    </span>
                  ):"SignUp"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a href="/sign-in">Signin</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp