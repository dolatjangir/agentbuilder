"use server"

import { AuthError } from "next-auth"
import { signIn } from "../../../auth"


export  async function loginAction(formdata: FormData){
try {
    await signIn("credentials",{
        email : formdata.get("email") as string,
        password : formdata.get("password") as string,
         redirectTo: "/dashboard",
    }

    )}catch(error){
        if (error instanceof AuthError) {
              return { error: "Invalid email or password" }
    }
    throw error
    }
}