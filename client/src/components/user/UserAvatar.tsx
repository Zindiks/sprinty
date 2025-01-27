import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

export function UserAvatar() {
  const [user, setUser] = useState<{
    avatar_url: string
    login: string
  } | null>(null)

  useEffect(() => {
    console.log("fetching user data") // Log message to the console
    const fetchUser = async () => {
      console.log("fetching user data2") // Log message to the console
      const response = await fetch("http://localhost:4000/api/v1/oauth/user", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        console.log(data) // Log user data to the console
      }
    }
    fetchUser()
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="w-10 h-10 border-cyan-100 border-2">
            <AvatarImage src={user?.avatar_url} alt="User" />
            <AvatarFallback>{user?.login}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{user?.login}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
