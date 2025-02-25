'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TransactionPage = () => {
  const [cart, setCart] = useState({});
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", table: "" });
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
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

  const handleOrder = () => {
    const orderData = {
      customer,
      cart,
      note,
      total: totalPrice,
    };
    console.log("Order Submitted:", orderData);
    alert("Pesanan berhasil dikirim!");
    localStorage.removeItem("cart");
    setCart({});
    router.push("/sukses");
  };

  return (
    <div className="bg-[#E6C48E] min-h-screen flex justify-center items-center p-6">
      <div className="bg-[#F5E1B7] p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-center mb-4">PESANAN ANDA</h2>

        {/* List Pesanan */}
        {Object.entries(cart).map(([name, item], index) => (
          <div key={index} className="flex items-center justify-between border-b pb-3 mb-3">
            <div className="flex items-center gap-3">
              <Image src={`/images/${name.toLowerCase().replace(/\s+/g, '-')}.png`} alt={name} width={50} height={50} className="rounded-full" />
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
        ))}

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
            className="w-full mt-1 p-2 border rounded-md bg-white text-gray-700"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
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
            className="w-full mt-1 p-2 border rounded-md bg-white text-gray-700"
            value={customer.table}
            onChange={(e) => setCustomer({ ...customer, table: e.target.value })}
          />
        </div>

        {/* Total Harga */}
        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp. {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Tombol Pesan */}
        <button className="w-full bg-[#5E031C] text-white py-2 mt-4 rounded-lg" onClick={handleOrder}>
          Pesan
        </button>
      </div>
    </div>
  );
};

export default TransactionPage;
