'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { name: "Nasi Rames", price: 10000, img: "/images/nasirames.png", category: "Makanan" },
  { name: "Nasi Uduk", price: 12000, img: "/images/nasiuduk.png", category: "Makanan" },
  { name: "Nasi Kuning", price: 10000, img: "/images/nasikuning.png", category: "Makanan" },
  { name: "Nasi Ayam", price: 15000, img: "/images/nasiayam.png", category: "Makanan" },
  { name: "Nasi Goreng", price: 10000, img: "/images/nasigoreng.png", category: "Makanan" },
  { name: "Es/Panas", price: 3000, img: "/images/es-panas.png", category: "Minuman" },
  { name: "Jus Jeruk Es/Panas", price: 5000, img: "/images/jus-jeruk.png", category: "Minuman" },
  { name: "Kopi Es/Panas", price: 7000, img: "/images/kopi.png", category: "Minuman" },
  { name: "Air Putih", price: 5000, img: "/images/air-putih.png", category: "Minuman" },
];

const Page = () => {
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("Semua");
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

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/transaksi");
  };

  return (
    <div className="bg-[#5E031C] text-white min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm uppercase text-[#E6C48E]">Menu Kami</h2>
            <h1 className="text-4xl font-bold mt-2">Discover <br/> Our Menu</h1>
          </div>
          <p className="max-w-xs text-sm mt-28 text-right">
            Menu Rumah Makan Oma menyajikan hidangan yang penuh dengan kehangatan dan cita rasa khas masakan rumahan.
          </p>
        </div>

        <div className="flex gap-6 mb-4 text-lg">
          {['Semua', 'Makanan', 'Minuman'].map((cat) => (
            <button 
              key={cat} 
              className={`uppercase ${category === cat ? 'font-bold' : 'opacity-50'}`} 
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {menuItems.filter(item => category === "Semua" || item.category === category).map((item, index) => (
            <div key={index} className="bg-[#8A2B3E] p-2 rounded-lg">
              <Image src={item.img} alt={item.name} width={200} height={200} className="w-full h-40 object-cover rounded-md" />
              <div className="p-3">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm">Rp. {item.price.toLocaleString()}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <button className="bg-white text-black px-2 py-1 rounded" onClick={() => decreaseQty(item.name)}>-</button>
                    <span>{cart[item.name]?.qty || 0}</span>
                    <button className="bg-white text-black px-2 py-1 rounded" onClick={() => increaseQty(item.name, item.price)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#8A2B3E] p-4 w-full rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/images/cart.png" alt="Cart" width={30} height={30} />
            <div>
              <p className="text-lg font-semibold">Total: Rp. {totalPrice.toLocaleString()}</p>
              <p className="text-sm">Detail Pesanan</p>
            </div>
          </div>
          <button className="text-white px-6 py-2 rounded text-lg" onClick={handleCheckout}>
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;