import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Sales() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  // fetch products
  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  // add to cart
  const addToCart = () => {
    if (!selectedProduct || qty <= 0) return;

    const product = products.find((p) => p.id === Number(selectedProduct));

    const existing = cartItems.find((item) => item.product_id === product.id);

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + Number(qty),
                total: (item.quantity + Number(qty)) * item.price,
              }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          hsn_code: product.hsn_code,
          quantity: Number(qty),
          total: Number(product.price) * Number(qty),
        },
      ]);
    }

    setQty(1);
    setSelectedProduct("");
  };

  // update qty
  const updateQty = (id, newQty) => {
    if (newQty <= 0) return;

    setCartItems(
      cartItems.map((item) =>
        item.product_id === id
          ? {
              ...item,
              quantity: newQty,
              total: newQty * item.price,
            }
          : item,
      ),
    );
  };

  // remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.product_id !== id));
  };

  // grand total
  const grandTotal = cartItems.reduce((sum, i) => sum + i.total, 0);

  // submit sale (backend later)

  const completeSale = async () => {
    const payload = {
      total_amount: grandTotal,
      items: cartItems.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    try {
      const res = await api.post("/sales", payload);

      console.log("SALE RESPONSE:", res.data);

      const sale_id = res.data.sale_id; //  from backend

      setCartItems([]); // clear cart
      navigate(`/invoice/${sale_id}`); //  GO TO INVOICE
    } catch (err) {
      console.error(err);
      alert("Sale failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">New Sale</h2>

      {/* Add product */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border p-2 w-full sm:w-64"
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (₹{p.price})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border p-2 w-full sm:w-24"
        />

        <button
          onClick={addToCart}
          className="bg-blue-600 text-white px-4 py-2 w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      {/* Cart Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border min-w-[150]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Hsn Code</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.product_id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.hsn_code}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQty(item.product_id, Number(e.target.value))
                    }
                    className="border w-20 p-1"
                  />
                </td>
                <td className="border p-2">₹{item.price}</td>
                <td className="border p-2">₹{item.total}</td>
                <td className="border p-2">
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold mb-3">Total: ₹{grandTotal}</h3>

      <button
        onClick={completeSale}
        className="bg-green-600 text-white px-6 py-2 rounded w-full sm:w-auto"
      >
        Complete Sale
      </button>
    </div>
  );
}

export default Sales;
