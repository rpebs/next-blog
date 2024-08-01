import Link from "next/link";
import { ToastContainer } from "react-toastify";
import SidebarMenu from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default async function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {children}
        </div>
    </div>
  );
}
