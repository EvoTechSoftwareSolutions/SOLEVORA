import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import logo from "../../assets/logo.png"
import Footer from "../../components/common/Footer";
import "../../styles/user/UserLayout.css";
import "../../styles/user/Home.css";

const UserLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>

   <Footer />
    </div>
  );
};

export default UserLayout;