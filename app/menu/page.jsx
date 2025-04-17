"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Page = () => {
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("Semua");
  const [menuItems, setMenuItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (name, price) => {
    const product = menuItems.find(item => item.name === name);
    if (!product) return;
    updateCart({
      ...cart,
      [name]: {
        product_id: product.id,
        qty: (cart[name]?.qty || 0) + 1,
        price,
      },
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

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/transaksi");
  };

  return (
    <div className="bg-[#5E031C] text-white min-h-screen px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xs md:text-sm uppercase text-[#E6C48E]">Menu Kami</h2>
            <h1 className="text-2xl md:text-4xl font-bold mt-1">Discover <br className="hidden md:block" /> Our Menu</h1>
          </div>
          <p className="text-sm max-w-md md:mt-0">
            Menu Rumah Makan Oma menyajikan hidangan yang penuh dengan kehangatan dan cita rasa khas masakan rumahan.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-4 mb-6 text-base md:text-lg flex-wrap">
          {["Semua", "Makanan", "Minuman"].map((cat) => (
            <button
              key={cat}
              className={`uppercase ${category === cat ? "font-bold" : "opacity-50"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems
            .filter(item => category === "Semua" || item.category.toLowerCase() === category.toLowerCase())
            .map((item, index) => (
              <div key={index} className="bg-[#8A2B3E] p-4 rounded-2xl shadow-md flex flex-col">
                <Image
                  src={item.img.startsWith("http") ? item.img : `${item.img}`}
                  alt={item.name}
                  width={500}
                  height={500}
                  className="w-full h-60 object-cover rounded-xl"
                />

                <div className="p-2 text-white flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm mt-1">Rp. {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2 items-center">
                      <button
                        className="bg-white text-black px-3 py-1 rounded-md font-bold"
                        onClick={() => decreaseQty(item.name)}
                      >
                        -
                      </button>

                      <span className="text-lg">{cart[item.name]?.qty || 0}</span>

                      <button
                        className="bg-white text-black px-3 py-1 rounded-md font-bold"
                        onClick={() => increaseQty(item.name, item.price)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-[#8A2B3E] p-4 w-full rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/cart.png" alt="Cart" width={30} height={30} />
            <div>
              <p className="text-base md:text-lg font-semibold">Total: Rp. {totalPrice.toLocaleString()}</p>
              <p className="text-xs">Detail Pesanan</p>
            </div>
          </div>
          <button
            className="bg-[#E6C48E] text-black px-6 py-2 rounded text-base font-semibold hover:bg-[#f0d79f] transition"
            onClick={handleCheckout}
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
