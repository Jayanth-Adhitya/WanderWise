"use client"

import { useForm } from "react-hook-form"
import { useFormStatus } from 'react-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAction } from "@/hooks/use-validated-action"
import { SignUpValidation } from "@/lib/validations/auth"
import { signUpWithCredentials } from "@/lib/actions/auth/signup-with-credentials"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export const SignUpForm = () => {
  const router = useRouter()
  const { pending } = useFormStatus()
  const { toast } = useToast()

  const { execute: executeSignUpWithCredentials } = useAction(signUpWithCredentials, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: `${data.email} sign up successfully`
      })
      router.push("/signin")
    },
    onError: (error) => {toast({ status: "error", description: error })}
  })

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    // console.log(values)
    executeSignUpWithCredentials(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mail@example.com"
                    {...field}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm your password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full mt-6"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting..." : "Sign Up"}
        </Button>
      </form>
      <div className="flex items-center justify-center my-4">
        <div className="border-b border-gray-400 w-full"></div>
        <span className="px-2 text-gray-400">or</span>
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Already have an account?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signin">
          Sign In
        </Link>
      </p>
    </Form>
  )
}