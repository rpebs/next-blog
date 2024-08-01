import Link from "next/link";
import { ToastContainer } from "react-toastify";
import SidebarMenu from "../components/Sidebar";

export default async function AdminLayout({ children }) {
  return (
    <div>
      <SidebarMenu />

      <div className="p-1 sm:ml-64">
        <div className="container mx-auto p-4">{children}</div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
