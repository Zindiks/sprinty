// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Check, ChevronsUpDown } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// interface Organization {
//   id: string

//   name: string
//   description: string
//   created_at: string
//   updated_at: string
// }

// export function OrganizationCombobox() {
//   const [open, setOpen] = useState(false)
//   const [value, setValue] = useState("")
//   const [organizations, setOrganizations] = useState<Organization[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchOrganizations = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/v1/organizations/all"
//         )
//         setOrganizations(response.data)
//         setLoading(false)
//       } catch (err) {
//         setError("Failed to fetch organizations" + err)
//         setLoading(false)
//       }
//     }

//     fetchOrganizations()
//   }, [])

//   if (loading) return <div>Loading organizations...</div>
//   if (error) return <div>Error: {error}</div>

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value
//             ? organizations.find((org) => org.id === value)?.name
//             : "Select organization..."}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search organization..." />
//           <CommandEmpty>No organization found.</CommandEmpty>
//           <CommandGroup>
//             {organizations.map((org) => (
//               <CommandItem
//                 key={org.id}
//                 onSelect={() => {
//                   setValue(org.id === value ? "" : org.id)
//                   setOpen(false)
//                 }}
//               >
//                 <Check
//                   className={cn(
//                     "mr-2 h-4 w-4",
//                     value === org.id ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//                 {org.name}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }

interface Organization {
  id: string

  name: string
  description: string
  created_at: string
  updated_at: string
}


import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"

export function OrganizationCombobox() {
  const [open, setOpen] = React.useState(false)
  const [id, setId] = React.useState("")

  const [loading, setLoading] = React.useState(false)

  const [organizations, setOrganizations] = React.useState<Organization[]>([])


  React.useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/organizations/all"
        )
        setOrganizations(response.data)
        setLoading(false)
      } catch (err) {
        // setError("Failed to fetch organizations" + err)
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [])


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {id
            ? organizations.find((organization) => organization.id === id)?.name
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {organizations.map((organization) => (
                <CommandItem
                  key={organization.id}
                  value={organization.id}
                  onSelect={(currentId) => {
                    setId(currentId === id ? "" : currentId)
                    setOpen(false)
                  }}
                >
                  {organization.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      id === organization.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

