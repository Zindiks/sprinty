import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"

const Marketing = () => {
  const [user, setUser] = useState<{
    avatar_url: string
    login: string
  } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
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

  const handleLogin = async () => {
    window.location.href = "http://localhost:4000/login/github"
  }

  const handleLogout = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("access_token")
    if (token) {
      document.cookie = `accessToken=${token}; path=/; samesite=strict`
      window.location.search = ""
    }
  }, [])

  return (
    <>
      <div className="card">
        {!user && <Button onClick={handleLogin}>Login with GitHub</Button>}

        {user && (
          <div>
            <img src={user.avatar_url} alt="User Avatar" />
            <p>{user.login}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default Marketing
