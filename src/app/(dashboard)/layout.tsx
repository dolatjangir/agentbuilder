
import { redirect } from "next/navigation"
import { auth } from "../../../auth"
import { Sidebar } from "./_components/sidebar"
import { Header } from "./_components/header"


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen bg-bg-base flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header  />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}