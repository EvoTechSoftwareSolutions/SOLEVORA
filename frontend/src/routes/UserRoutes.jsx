import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout/UserLayout";
import Home from "../pages/user/Home";


const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;