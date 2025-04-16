'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stockError, setStockError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    fetchTransactions();
  }, [router]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data);

      // Auto-select first transaction if available
      if (data.length > 0 && !selectedTransaction) {
        viewTransactionDetails(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const viewTransactionDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction details');
      }
      
      const data = await response.json();
      setSelectedTransaction(data);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setError('Failed to load transaction details');
    }
  };

  const updateTransactionStatus = async (id, status) => {
    try {
      setStatusUpdating(true);
      setError('');
      setStockError('');
      const token = localStorage.getItem("token");
      
      // If moving to processing, show a confirmation dialog
      if (status === 'processing' && selectedTransaction?.status === 'pending') {
        if (!window.confirm('Updating to processing status will reduce product stock. Continue?')) {
          setStatusUpdating(false);
          return;
        }
      }
      
      const response = await fetch(`${API_URL}/transactions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Check if it's a stock-related error
        if (result.error && result.error.includes('stock')) {
          setStockError(result.error);
        } else {
          setError(result.error || 'Failed to update transaction status');
        }
        return;
      }
      
      // Update local transaction list
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction.id === id ? { ...transaction, status } : transaction
        )
      );
      
      // Update selected transaction if open
      if (selectedTransaction && selectedTransaction.id === id) {
        setSelectedTransaction({ ...selectedTransaction, status });
      }
      
      // Show success message if processing (stock reduced)
      if (status === 'processing') {
        alert('Status updated to processing. Product stock has been reduced.');
      } else if (status === 'cancelled' && selectedTransaction?.status === 'processing') {
        alert('Order cancelled. Product stock has been restored.');
      }
      
    } catch (err) {
      console.error('Error updating transaction status:', err);
      setError('Failed to update transaction status');
    } finally {
      setStatusUpdating(false);
    }
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatCurrency = (amount) => {
    return `Rp ${parseInt(amount).toLocaleString('id-ID')}`;
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'processing';
      case 'processing': return 'completed';
      case 'completed': return 'completed'; // Already completed
      case 'cancelled': return 'cancelled'; // Can't change from cancelled
      default: return 'processing';
    }
  };

  const filteredTransactions = filterStatus === 'all'
    ? transactions
    : transactions.filter(transaction => transaction.status === filterStatus);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {stockError && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          <span className="font-bold">Stock Error:</span> {stockError}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Status
        </label>
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <a href="/admin">
              Back
            </a>
          </button>
        <select
          className="border rounded p-2 w-full md:w-64"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading transactions...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Transactions List */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Orders ({filteredTransactions.length})</h2>
              </div>
              
              {filteredTransactions.length === 0 ? (
                <div className="text-gray-500 text-center py-12">
                  <p>No transactions found</p>
                  <p className="text-sm mt-1">Try changing the filter or refresh the page</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map(transaction => (
                        <tr 
                          key={transaction.id} 
                          onClick={() => viewTransactionDetails(transaction.id)}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedTransaction?.id === transaction.id ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm">#{transaction.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{transaction.customer_name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{transaction.table_number}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(transaction.created_at)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatCurrency(transaction.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Transaction Details */}
          <div className="w-full lg:w-1/2">
            {selectedTransaction ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Order Details #{selectedTransaction.id}</h2>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Information</h3>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm mb-1"><span className="font-medium">Name:</span> {selectedTransaction.customer_name}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {selectedTransaction.customer_phone || '-'}</p>
                        <p className="text-sm"><span className="font-medium">Table:</span> {selectedTransaction.table_number}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Order Information</h3>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm mb-1"><span className="font-medium">Date:</span> {formatDate(selectedTransaction.created_at)}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Total:</span> {formatCurrency(selectedTransaction.total_amount)}</p>
                        <p className="text-sm"><span className="font-medium">Items:</span> {selectedTransaction.items?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedTransaction.note && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Note</h3>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm italic">"{selectedTransaction.note}"</p>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Items</h3>
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    {selectedTransaction.items && selectedTransaction.items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Qty</th>
                              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedTransaction.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-2 py-2 text-sm">{item.product_name}</td>
                                <td className="px-2 py-2 text-sm text-center">{item.quantity}</td>
                                <td className="px-2 py-2 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                                <td className="px-2 py-2 text-sm text-right">{formatCurrency(item.subtotal)}</td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100">
                              <td colSpan="3" className="px-2 py-2 text-sm font-medium text-right">Total</td>
                              <td className="px-2 py-2 text-sm font-medium text-right">{formatCurrency(selectedTransaction.total_amount)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No items found</p>
                    )}
                  </div>
                  
                  {/* Status Update Actions */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Update Order Status</h3>
                    
                    {selectedTransaction.status === 'pending' && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded mb-3">
                        <p className="text-sm">
                          <span className="font-bold">Note:</span> Updating to "Processing" will reduce product stock.
                        </p>
                      </div>
                    )}
                    
                    {selectedTransaction.status === 'processing' && (
                      <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded mb-3">
                        <p className="text-sm">
                          <span className="font-bold">Note:</span> Cancelling will restore product stock. Completing will maintain reduced stock.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedTransaction.status !== 'pending' && (
                        <button
                          className={`px-3 py-1 text-sm font-medium rounded ${getStatusBadgeColor('pending')} ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => updateTransactionStatus(selectedTransaction.id, 'pending')}
                          disabled={statusUpdating || selectedTransaction.status === 'completed' || selectedTransaction.status === 'cancelled'}
                        >
                          Mark as Pending
                        </button>
                      )}
                      
                      {selectedTransaction.status !== 'processing' && (
                        <button
                          className={`px-3 py-1 text-sm font-medium rounded ${getStatusBadgeColor('processing')} ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => updateTransactionStatus(selectedTransaction.id, 'processing')}
                          disabled={statusUpdating || selectedTransaction.status === 'completed' || selectedTransaction.status === 'cancelled'}
                        >
                          Mark as Processing
                        </button>
                      )}
                      
                      {selectedTransaction.status !== 'completed' && (
                        <button
                          className={`px-3 py-1 text-sm font-medium rounded ${getStatusBadgeColor('completed')} ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => updateTransactionStatus(selectedTransaction.id, 'completed')}
                          disabled={statusUpdating || selectedTransaction.status === 'cancelled'}
                        >
                          Mark as Completed
                        </button>
                      )}
                      
                      {selectedTransaction.status !== 'cancelled' && (
                        <button
                          className={`px-3 py-1 text-sm font-medium rounded ${getStatusBadgeColor('cancelled')} ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => updateTransactionStatus(selectedTransaction.id, 'cancelled')}
                          disabled={statusUpdating || selectedTransaction.status === 'completed'}
                        >
                          Cancel Order
                        </button>
                      )}
                      
                      {/* Progress button for common workflow */}
                      {(selectedTransaction.status === 'pending' || selectedTransaction.status === 'processing') && (
                        <button
                          className={`px-3 py-1 text-sm font-medium rounded bg-blue-500 text-white ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => updateTransactionStatus(selectedTransaction.id, getNextStatus(selectedTransaction.status))}
                          disabled={statusUpdating}
                        >
                          {statusUpdating ? 'Updating...' : `Progress to ${getNextStatus(selectedTransaction.status)}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;