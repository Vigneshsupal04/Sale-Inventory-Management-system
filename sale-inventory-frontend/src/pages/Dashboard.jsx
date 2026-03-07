import { useEffect, useState } from "react";

function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  // const [dailySales, setDailySales] = useState([]);
  // const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dashboard API:", data);

        setTotalSales(Number(data.totalSales));
        setTotalOrders(data.totalOrders);
        setTotalCustomers(data.totalCustomers);
        setTotalProducts(data.totalProducts);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Sales" value={`₹ ${totalSales}`} />
        <Card title="Orders" value={totalOrders} />
        <Card title="Customers" value={totalCustomers} />
        <Card title="Products" value={totalProducts} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-semibold mt-2">{value}</h2>
    </div>
  );
}

export default Dashboard;
