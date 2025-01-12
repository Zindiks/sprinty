
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Home, Mail, Settings, Bell, User } from "lucide-react"

import { SidebarItem } from "./SidebarItem"



export const StaticSidebar = () => {
  return (
    <aside className="w-16 h-screen flex flex-col items-center py-4 bg-white border-r">
      <div className="flex flex-col items-center space-y-4 flex-grow">
        {/* Logo */}
        <SidebarItem
          icon={() => <div className="w-8 h-8 bg-blue-500 rounded-full" />}
          tooltip="Logo"
        />

        {/* Plus Button */}
        <SidebarItem icon={Plus} tooltip="Add New" />

        {/* Five placeholder items */}
        <SidebarItem icon={Home} tooltip="Home" />
        <SidebarItem icon={Mail} tooltip="Messages" />
        <SidebarItem icon={Bell} tooltip="Notifications" />
        <SidebarItem icon={Settings} tooltip="Settings" />
        <SidebarItem icon={User} tooltip="Profile" />

        {/* Spacer to push avatar to bottom */}
        <div className="flex-grow" />

        {/* Profile Avatar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>User Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  )
}
