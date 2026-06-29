import { DefaultSession, DefaultUser } from "next-auth"
import { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    role: string
  }
}