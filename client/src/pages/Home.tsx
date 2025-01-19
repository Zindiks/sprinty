import BoardList from "@/components/board/BoardList"
import { CreateBoardModal } from "@/components/board/CreateBoardModal"
import { CreateOrganizationModal } from "@/components/organization/CreateOrganizationModal"
import { OrganizationCombobox } from "@/components/organization/OrganizationCombobox"
import { useStore } from "@/hooks/store/useStore"

const Home = () => {
  const { organization_id } = useStore()

  console.log(organization_id)

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-4">
        {/* Your main content goes here */}
        <h1>Main Content</h1>

        <h1>{organization_id}</h1>

        <CreateOrganizationModal />

        <OrganizationCombobox />

        <CreateBoardModal />

        <BoardList />
      </main>
    </div>
  )
}

export default Home
