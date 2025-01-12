import { useEffect, useState } from "react"

function User() {
  const [user, setUser] = useState<{
    avatar_url: string
    login: string
  } | null>(null)

  useEffect(() => {
    console.log("fetching user data") // Log message to the console
    const fetchUser = async () => {
      console.log("fetching user data2") // Log message to the console
      const response = await fetch("http://localhost:4000/user", {
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
    <div>
      <h1 className="bg-red-500">User</h1>
      {user && (
        <div>
          <img src={user.avatar_url} alt="User Avatar" />
          <p>{user.login}</p>
        </div>
      )}
    </div>
  )
}

export default User
