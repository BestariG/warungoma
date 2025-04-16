'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TransactionDetailPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get order details from localStorage
    const storedCart = localStorage.getItem("cart");
    const storedCustomer = localStorage.getItem("customerDetails");
    const storedNote = localStorage.getItem("orderNote");

    if (storedCart && storedCustomer) {
      const cart = JSON.parse(storedCart);
      const customer = JSON.parse(storedCustomer);
      const note = storedNote ? JSON.parse(storedNote) : "";
      
      const totalPrice = Object.values(cart).reduce(
        (sum, item) => sum + item.qty * item.price, 
        0
      );

      setOrderDetails({
        customer,
        cart,
        note,
        total: totalPrice,
      });
    } else {
      // If no data, redirect back to transaction page
      router.push("/transaction");
    }
  }, [router]);

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirmOrder = async () => {
    if (!orderDetails) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }
      
      // Clear cart and other order data from localStorage
      localStorage.removeItem("cart");
      localStorage.removeItem("customerDetails");
      localStorage.removeItem("orderNote");
      
      // Store transaction ID for reference on success page
      localStorage.setItem("lastTransactionId", data.transactionId);
      
      // Redirect to success page
      router.push("/sukses");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOrder = () => {
    router.push("/transaksi");
  };

  if (!orderDetails) {
    return (
      <div className="bg-[#E6C48E] min-h-screen flex justify-center items-center">
        <div className="bg-[#F5E1B7] p-6 rounded-xl shadow-lg">
          <p className="text-center">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E6C48E] min-h-screen flex justify-center items-center p-6">
      <div className="bg-[#F5E1B7] p-6 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-2">KONFIRMASI PESANAN</h2>
        <p className="text-center text-gray-600 mb-6">{formatDate()}</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Customer Details */}
        <div className="bg-white p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Detail Pelanggan</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-600">Nama:</p>
              <p className="font-medium">{orderDetails.customer.name}</p>
            </div>
            <div>
              <p className="text-gray-600">No. HP:</p>
              <p className="font-medium">{orderDetails.customer.phone || "-"}</p>
            </div>
            <div>
              <p className="text-gray-600">No. Meja:</p>
              <p className="font-medium">{orderDetails.customer.table}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Daftar Pesanan</h3>
          
          {Object.entries(orderDetails.cart).map(([name, item], index) => (
            <div key={index} className="flex justify-between border-b py-2 last:border-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.qty}x</span>
                <span>{name}</span>
              </div>
              <div className="text-right">
                <p>Rp {item.price.toLocaleString()}</p>
                <p className="font-medium">Rp {(item.qty * item.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
          
          {orderDetails.note && (
            <div className="mt-3 pt-2 border-t">
              <p className="text-gray-600">Catatan:</p>
              <p>{orderDetails.note}</p>
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="bg-white p-4 rounded-lg mb-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Total Pembayaran</span>
            <span>Rp {orderDetails.total.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gray-300 py-3 rounded-lg font-medium"
            onClick={handleEditOrder}
            disabled={isSubmitting}
          >
            Ubah Pesanan
          </button>
          <button 
            className="flex-1 bg-[#5E031C] text-white py-3 rounded-lg font-medium flex items-center justify-center"
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Memproses...</span>
            ) : (
              <span>Konfirmasi Pesanan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;