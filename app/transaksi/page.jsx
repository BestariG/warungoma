'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TransactionPage = () => {
  const [cart, setCart] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", table: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);
  
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (name, price) => {
    updateCart({
      ...cart,
      [name]: { qty: (cart[name]?.qty || 0) + 1, price },
    });
  };

  const decreaseQty = (name) => {
    const updatedCart = { ...cart };
    if (!updatedCart[name] || updatedCart[name].qty === 0) return;
    updatedCart[name].qty -= 1;
    if (updatedCart[name].qty === 0) delete updatedCart[name];
    updateCart(updatedCart);
  };

  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);

  const validateOrder = () => {
    const newErrors = {};
    
    if (!customer.name.trim()) {
      newErrors.name = "Nama tidak boleh kosong";
    }
    
    if (!customer.table.trim()) {
      newErrors.table = "Nomor meja harus diisi";
    }
    
    if (Object.keys(cart).length === 0) {
      newErrors.cart = "Keranjang belanja kosong";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewOrder = () => {
    if (!validateOrder()) return;
    
    // Store the data in localStorage for the details page
    localStorage.setItem("customerDetails", JSON.stringify(customer));
    if (note) localStorage.setItem("orderNote", JSON.stringify(note));
    
    // Navigate to the details confirmation page
    router.push("/detail");
  };

  return (
    <div className="bg-[#E6C48E] min-h-screen flex justify-center items-center p-6">
      <div className="bg-[#F5E1B7] p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-center mb-4">PESANAN ANDA</h2>

        {errors.cart && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {errors.cart}
          </div>
        )}

        {/* List Pesanan */}
        {Object.entries(cart).length > 0 ? (
          Object.entries(cart).map(([name, item], index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    (menuItems.find((item) => item.name === name)?.img?.startsWith("http")
                      ? menuItems.find((item) => item.name === name)?.img
                      : `/images/${menuItems.find((item) => item.name === name)?.img}`) || "/images/default.png"
                  }
                  alt={name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm">Rp. {item.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-red-500 text-white px-2 rounded" onClick={() => decreaseQty(name)}>-</button>
                <span>{item.qty}</span>
                <button className="bg-green-500 text-white px-2 rounded" onClick={() => increaseQty(name, item.price)}>+</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Keranjang anda kosong. Silakan tambahkan menu terlebih dahulu.
          </div>
        )}

        {/* Catatan */}
        <div className="mt-4">
          <p className="font-medium">Catatan <span className="text-sm">(Optional)</span></p>
          <input
            type="text"
            placeholder="Contoh: Sambalnya banyakin ya"
            className="w-full mt-1 p-2 border rounded-md bg-white text-gray-700"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Form Nama, No HP, No Meja */}
        <div className="mt-4">
          <p className="font-medium">Nama</p>
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            className={`w-full mt-1 p-2 border rounded-md bg-white text-gray-700 ${errors.name ? 'border-red-500' : ''}`}
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mt-4">
          <p className="font-medium">No HP</p>
          <input
            type="text"
            placeholder="Masukkan nomor HP Anda"
            className="w-full mt-1 p-2 border rounded-md bg-white text-gray-700"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <p className="font-medium">No Meja</p>
          <input
            type="text"
            placeholder="Masukkan nomor meja"
            className={`w-full mt-1 p-2 border rounded-md bg-white text-gray-700 ${errors.table ? 'border-red-500' : ''}`}
            value={customer.table}
            onChange={(e) => setCustomer({ ...customer, table: e.target.value })}
          />
          {errors.table && <p className="text-red-500 text-sm mt-1">{errors.table}</p>}
        </div>

        {/* Total Harga */}
        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp. {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Tombol Pesan */}
        <button 
          className="w-full bg-[#5E031C] text-white py-2 mt-4 rounded-lg"
          onClick={handleReviewOrder}
        >
          Lanjut ke Konfirmasi
        </button>
      </div>
    </div>
  );
};

export default TransactionPage;