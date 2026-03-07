import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get("/sales").then((res) => {
      setSales(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sales History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-400 min-w-[150]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Invoice</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.invoice_no}</td>
                <td className="border p-2">{s.customer_name || "Walk-in"}</td>
                <td className="border p-2">
                  {new Date(s.created_at).toLocaleString()}
                </td>
                <td className="border p-2">₹{s.total_amount}</td>
                <td className="border p-2">
                  <Link
                    to={`/invoice/${s.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistory;
