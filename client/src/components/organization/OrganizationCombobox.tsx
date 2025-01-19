interface Organization {
  id: string

  name: string
  description: string
  created_at: string
  updated_at: string
}

import { useEffect, useState } from "react"
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

import { useStore } from "@/hooks/store/useStore"

const API_HOST = import.meta.env.VITE_API_HOST
const API_PORT = import.meta.env.VITE_API_PORT
const API_VERSION = import.meta.env.VITE_API_VERSION

const API_URL = `${API_HOST}:${API_PORT}${API_VERSION}`

export function OrganizationCombobox() {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const [loading, setLoading] = useState(false)

  const [organizations, setOrganizations] = useState<Organization[]>([])

  const { setOrganizationId} = useStore()

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(`${API_URL}/organizations/all`)
        setOrganizations(response.data)
        setLoading(false)
      } catch (err) {
        // setError("Failed to fetch organizations" + err)
        console.log(err)
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  if (loading) return <div>Loading organizations...</div>

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
                    setOrganizationId(currentId)
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
