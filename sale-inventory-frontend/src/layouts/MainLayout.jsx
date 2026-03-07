import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
        {/* <Outlet /> */}
      </main>
    </>
  );
}

export default MainLayout;