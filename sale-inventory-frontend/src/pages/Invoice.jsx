import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Invoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  console.log("Invoice ID from URL:", id);

  console.log("Invoice ID:", id);
  useEffect(() => {
    if (!id) return;

    api
      .get(`/invoice/${id}`)
      .then((res) => {
        console.log("INVOICE API RESPONSE:", res.data);
        setInvoice(res.data);
      })
      .catch((err) => {
        console.error("INVOICE API ERROR:", err);
      });
  }, [id]);

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!invoice) return <p className="p-4">Loading invoice...</p>;

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">VIGNESH ENTERPRISES</h1>
        <p>Sales Inventory Management System</p>
      </div>

      <h2 className="text-xl font-bold">Invoice</h2>
      <p>Invoice No: {invoice.invoice.invoice_no}</p>
      <p>Date: {new Date(invoice.invoice.created_at).toLocaleString()}</p>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border border-gray-400 min-w-[150]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((i, idx) => (
              <tr key={idx}>
                <td className="border p-2">{i.product_name}</td>
                <td className="border p-2">{i.hsn_code}</td>
                <td className="border p-2">{i.quantity}</td>
                <td className="border p-2">₹{i.price}</td>
                <td className="border p-2">₹{i.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-4 font-semibold">
        Grand Total: ₹{invoice.invoice.total_amount}
      </h3>

      <button
        onClick={() => window.print()}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto mb-4 mt-2"
      >
        Print Invoice
      </button>

      <div className="mt-10 text-center text-gray-500">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}

export default Invoice;
