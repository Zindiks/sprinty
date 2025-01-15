import { CreateOrganizationModal } from "@/components/organization/CreateOrganizationModal"
import { StaticSidebar } from "@/components/SidebarStatic"

const Home = () => {
  return (
    <div className="flex h-screen">
      <StaticSidebar />
      <main className="flex-1 p-4">
        {/* Your main content goes here */}
        <h1>Main Content</h1>

        <CreateOrganizationModal />
      </main>
    </div>
  )
}

export default Home
