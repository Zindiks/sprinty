import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import User from "../pages/User"
import Marketing from "@/pages/Marketing"

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/marketing" element={<Marketing />} />
    </Routes>
  </Router>
)

export default AppRoutes
