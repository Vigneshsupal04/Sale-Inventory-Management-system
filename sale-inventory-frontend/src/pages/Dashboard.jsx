import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);

  useEffect(() => {

  const token = localStorage.getItem("token");

  // Dashboard totals
  fetch("https://your-backend.onrender.com/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      setTotalSales(Number(data.totalSales));
      setTotalOrders(data.totalOrders);
      setTotalCustomers(data.totalCustomers);
      setTotalProducts(data.totalProducts);
    });

    // Daily sales
  fetch("http://localhost:5000/api/dashboard/daily-sales", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setDailySales(data));

  // Monthly sales
  fetch("http://localhost:5000/api/dashboard/monthly-sales", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setMonthlySales(data));

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

      <div className="bg-white p-6 rounded shadow mt-6">
        <h3>Daily Sales</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded shadow mt-6">
        <h3>Monthly Sales</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
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
