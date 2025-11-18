import { Link } from 'react-router-dom';
import { Plus, Home, Mail, User, UserCircle, Search } from 'lucide-react';

import { SidebarItem } from './SidebarItem';
import { OrganizationCombobox } from './organization/OrganizationCombobox';
import { UserAvatar } from './user/UserAvatar';
import { useSearchDialog } from '@/contexts/SearchContext';

export const StaticSidebar = () => {
  const { openSearch } = useSearchDialog();

  return (
    <aside className="w-16 h-screen flex flex-col items-center py-4 bg-white border-r">
      <div className="flex flex-col items-center space-y-4 grow">
        {/* Logo */}
        {/* <SidebarItem
          icon={() => <div className="w-8 h-8 bg-blue-500 rounded-full" />}
          tooltip="Logo"
        /> */}

        <OrganizationCombobox />

        {/* Search Button */}
        <button
          onClick={openSearch}
          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative group"
          aria-label="Search (⌘K)"
          title="Search (⌘K)"
        >
          <Search size={24} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Search (⌘K)
          </span>
        </button>

        {/* Plus Button */}
        <SidebarItem icon={Plus} tooltip="Add New" />

        {/* Home item as a link */}
        <Link to="/boards">
          <SidebarItem icon={Home} tooltip="Home" />
        </Link>

        <Link to="/user">
          <SidebarItem icon={User} tooltip="User" />
        </Link>

        <Link to="/profile">
          <SidebarItem icon={UserCircle} tooltip="Profile" />
        </Link>

        {/* Other items */}
        <SidebarItem icon={Mail} tooltip="Messages" />

        {/* Spacer to push avatar to bottom */}
        <div className="grow" />

        {/* Profile Avatar */}

        <UserAvatar />
      </div>
    </aside>
  );
};
