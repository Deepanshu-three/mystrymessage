import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 character")
    .max(20, "Username nust be no more than 20 character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "password must be at atleast 6 characters"})
})