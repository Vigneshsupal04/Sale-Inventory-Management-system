import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-auto md:h-14 bg-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-2 md:py-0">
  <h1 className="font-semibold text-center md:text-left mb-2 md:mb-0">
    VIGNESH ENTERPRISES
  </h1>

  <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4 items-center text-sm md:text-base">
    <Link to="dashboard">Dashboard</Link>
    <Link to="products">Products</Link>
    <Link to="sales">Sales</Link>
    <Link to="/sales-history">Sales History</Link>

    <span className="text-gray-300">{user?.email}</span>

    <button
      onClick={logout}
      className="bg-red-500 px-3 py-1 rounded"
    >
      Logout
    </button>
  </div>
</div>
  );
}

export default Navbar;
