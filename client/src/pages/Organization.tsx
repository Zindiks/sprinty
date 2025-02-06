import { CreateOrganizationModal } from "@/components/organization/CreateOrganizationModal";
import { OrganizationCombobox } from "@/components/organization/OrganizationCombobox";

const Organizations = () => {
  return (
    <div className="flex h-screen">
      <OrganizationCombobox />
      <CreateOrganizationModal />
    </div>
  );
};

export default Organizations;
