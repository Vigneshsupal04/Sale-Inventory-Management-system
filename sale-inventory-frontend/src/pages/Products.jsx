import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    hsn_code: "",
    price: "",
    stock_quantity: "",
    description: "",
  });

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm({
      name: "",
      hsn_code: "",
      price: "",
      stock_quantity: "",
      description: "",
    });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {/* Add Product */}
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 mb-6">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="hsn_code"
          placeholder="HSN Code"
          value={form.hsn_code}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="stock_quantity"
          placeholder="Stock"
          value={form.stock_quantity}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2"
        />
        <button className="bg-blue-600 text-white p-2 col-span-4">
          Add Product
        </button>
      </form>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border min-w-[150]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.hsn_code}</td>
                <td className="border p-2">₹{p.price}</td>
                <td className="border p-2">{p.stock_quantity}</td>
                <td className="border p-2">{p.description}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
