"use server"

import { z } from "zod"
import bcrypt from "bcrypt"

import connectDB from "@/lib/database/mongodb"
import User from "@/lib/database/models/user.model"
import { SignInValidation } from "@/lib/validations/auth"

type SignInWithCredentialsInput = z.infer<typeof SignInValidation>

export const signInWithCredentials = async (data: SignInWithCredentialsInput) => {
  const { email, password } = data

  await connectDB()

  const user = await User.findOne({ email })
  if (!user) { throw new Error("User not found") }

  const passwordIsValid = await bcrypt.compare(password, user.password)
  if (!passwordIsValid) { throw new Error("Invalid password") }

  user.password = "" //remove password
  return { ...user._doc, _id: user._id.toString() }
}