import { useState, useEffect } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

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
      {user && (
        <div>
          <img src={user.avatar_url} alt="User Avatar" />
          <p>{user.login}</p>
        </div>
      )}
    </div>
  )
}

function App() {
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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Vite + React</h1>
              <div className="card">
                {!user && (
                  <button onClick={handleLogin}>Login with GitHub</button>
                )}

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
          }
        />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  )
}

export default App
