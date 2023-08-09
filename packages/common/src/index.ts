import { z } from 'zod';

export const signupInput = z.object({
    username: z.string().min(5).max(20),
    password: z.string().min(6).max(15)
})
// console.log("hi there");

export type SignupParams = z.infer<typeof signupInput>;