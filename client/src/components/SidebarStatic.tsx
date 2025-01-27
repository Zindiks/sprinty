import { Link } from "react-router-dom"
import { Plus, Home, Mail, User } from "lucide-react"

import { SidebarItem } from "./SidebarItem"
import { OrganizationCombobox } from "./organization/OrganizationCombobox"
import { UserAvatar } from "./user/UserAvatar"

export const StaticSidebar = () => {
  return (
    <aside className="w-16 h-screen flex flex-col items-center py-4 bg-white border-r">
      <div className="flex flex-col items-center space-y-4 flex-grow">
        {/* Logo */}
        {/* <SidebarItem
          icon={() => <div className="w-8 h-8 bg-blue-500 rounded-full" />}
          tooltip="Logo"
        /> */}

        <OrganizationCombobox />

        {/* Plus Button */}
        <SidebarItem icon={Plus} tooltip="Add New" />

        {/* Home item as a link */}
        <Link to="/boards">
          <SidebarItem icon={Home} tooltip="Home" />
        </Link>

        <Link to="/user">
          <SidebarItem icon={User} tooltip="User" />
        </Link>

        {/* Other items */}
        <SidebarItem icon={Mail} tooltip="Messages" />

        {/* Spacer to push avatar to bottom */}
        <div className="flex-grow" />

        {/* Profile Avatar */}

        <UserAvatar />
      </div>
    </aside>
  )
}
