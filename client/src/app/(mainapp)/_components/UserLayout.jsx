import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <UserNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
