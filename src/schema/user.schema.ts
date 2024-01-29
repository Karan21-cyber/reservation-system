/* eslint-disable @typescript-eslint/no-unused-vars */
import * as z from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required." })
      .min(3, "Minimun 3 characters is required."),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    password: z
      .string({ required_error: "Password is required" })
      .refine((_value: string) => {
        const hasUpperCase = /[A-Z]/.test(_value);
        const hasLowerCase = /[a-z]/.test(_value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(_value);
        const hasNumber = /\d/.test(_value);

        if (_value.length < 6) return "Password must be at least 6 characters.";
        if (!hasUpperCase)
          return "Password must contain at least one uppercase character.";
        if (!hasLowerCase)
          return "Password must contain at least one lowercase character.";
        if (!hasSpecialChar)
          return "Password must contain at least one special character.";
        if (!hasNumber)
          return "Password must contain at least one numeric character.";
      }),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    image: z.string().nullable(),
    refreshToken: z.string().nullable(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required." })
      .min(3, "Minimun 3 characters is required."),
  }),
  phone: z.string().nullable(),
  address: z.string().nullable(),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    password: z
      .string({ required_error: "Password is required" })
      .refine((_value: string) => {
        const hasUpperCase = /[A-Z]/.test(_value);
        const hasLowerCase = /[a-z]/.test(_value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(_value);
        const hasNumber = /\d/.test(_value);

        if (_value.length < 6) return "Password must be at least 6 characters.";
        if (!hasUpperCase)
          return "Password must contain at least one uppercase character.";
        if (!hasLowerCase)
          return "Password must contain at least one lowercase character.";
        if (!hasSpecialChar)
          return "Password must contain at least one special character.";
        if (!hasNumber)
          return "Password must contain at least one numeric character.";
      }),
  }),
});
