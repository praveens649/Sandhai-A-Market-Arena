import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default UserLayout;