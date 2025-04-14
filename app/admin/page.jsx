"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "" });
  const [editForm, setEditForm] = useState({ id: null, name: "", price: "", stock: "", category: "" });
  const [image, setImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*')) {
        setError("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }
      
      setImage(file);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*')) {
        setError("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }
      
      setEditImage(file);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!form.name || !form.price || !form.stock || !form.category) {
      setError("All fields are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      if (image) formData.append("image", image);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add product");
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setForm({ name: "", price: "", stock: "", category: "" });
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditForm({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
    setEditImagePreview(product.imgUrl || (product.img ? `${API_URL}${product.img}` : null));
    setEditImage(null);
    
    // Scroll to edit form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ id: null, name: "", price: "", stock: "", category: "" });
    setEditImage(null);
    setEditImagePreview(null);
    setError("");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!editForm.name || !editForm.price || !editForm.stock || !editForm.category) {
      setError("All fields are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("price", editForm.price);
      formData.append("stock", editForm.stock);
      formData.append("category", editForm.category);
      if (editImage) formData.append("image", editImage);

      const response = await fetch(`${API_URL}/products/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      const updatedProduct = await response.json();
      
      // Update the products array with the updated product
      setProducts(products.map(product => 
        product.id === editForm.id ? {
          ...updatedProduct,
          imgUrl: updatedProduct.imgUrl || updatedProduct.img ? `${API_URL}${updatedProduct.img}` : null
        } : product
      ));
      
      // Reset form
      setIsEditing(false);
      setEditForm({ id: null, name: "", price: "", stock: "", category: "" });
      setEditImage(null);
      setEditImagePreview(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      // Remove the deleted product from the state
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete product");
    }
  };

  const transactionAdmin = () => {
    router.push("/admin/transaction");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <button
            onClick={transactionAdmin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Transaksi
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Product name" 
                value={editForm.name} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Price" 
                type="number" 
                value={editForm.price} 
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Stock" 
                type="number" 
                value={editForm.stock} 
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select 
                className="w-full border p-2 rounded" 
                value={editForm.category} 
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input 
              type="file" 
              className="border p-2 rounded w-full" 
              onChange={handleEditImageChange}
              accept="image/*"
            />
            
            {editImagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img 
                  src={editImagePreview} 
                  alt="Preview" 
                  className="h-32 w-auto object-contain border rounded" 
                />
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
            <button 
              type="button" 
              className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Product name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Price" 
                type="number" 
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Stock" 
                type="number" 
                value={form.stock} 
                onChange={(e) => setForm({ ...form, stock: e.target.value })} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select 
                className="w-full border p-2 rounded" 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input 
              type="file" 
              className="border p-2 rounded w-full" 
              onChange={handleImageChange}
              accept="image/*"
            />
            
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-auto object-contain border rounded" 
                />
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="border p-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{product.id}</td>
                  <td className="border p-2 text-center">
                    {product.img ? (
                      <div className="flex justify-center">
                        <img 
                          src={product.imgUrl || `${API_URL}${product.img}`} 
                          alt={product.name} 
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded mx-auto">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2 text-right">{product.price}</td>
                  <td className="border p-2 text-center">{product.stock}</td>
                  <td className="border p-2 text-center capitalize">{product.category}</td>
                  <td className="border p-2 text-center">
                    {product.created_at 
                      ? new Date(product.created_at).toLocaleDateString() 
                      : "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;