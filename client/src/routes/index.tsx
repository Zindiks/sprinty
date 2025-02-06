import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import User from "../pages/User";
import Marketing from "@/pages/Marketing";
import Boards from "@/pages/Boards";
import BoardView from "../pages/BoardView";
import BoardLayout from "@/pages/BoardLayout";
import Organizations from "@/pages/Organization";
// import BoardEdit from "../pages/BoardEdit"

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/boards" element={<Boards />} />

      <Route path="/organizations" element={<Organizations />} />

      <Route path="board" element={<BoardLayout />}>
        <Route path=":board_id" element={<BoardView />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
