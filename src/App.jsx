import React, { useState, useEffect } from 'react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "🔥 পুরুষদের জন্য এক্সক্লুসিভ প্যাডিং জ্যাকেট 🧥",
    price: 1300,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80",
    description: "উচ্চমানের শীতকালীন জ্যাকেট, খুবই আরামদায়ক ও ট্রেন্ডি ডিজাইন।",
    sizes: ["M", "L", "XL", "Free Size / Standard"],
    stock: 15
  },
  {
    id: 2,
    name: "Wireless Bluetooth Smartwatch Ultra",
    price: 1950,
    category: "Gadgets",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "স্মার্ট ওয়াচ, হেলথ ট্র্যাকিং এবং কলিং সুবিধাসহ।",
    sizes: ["Standard"],
    stock: 8
  },
  {
    id: 3,
    name: "Premium Cotton Smart Polo Shirt",
    price: 750,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "১০০% প্রিমিয়াম কটন ফ্যাব্রিক, স্টাইলিশ অ্যান্ড ক্যাজুয়াল লুক।",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 20
  },
  {
    id: 4,
    name: "Stylish Running Sneaker Shoes",
    price: 1550,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "হালকা এবং টেকসই, প্রতিদিনের ব্যবহারের জন্য পারফেক্ট।",
    sizes: ["39", "40", "41", "42", "43"],
    stock: 12
  }
];

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('offerfizz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('offerfizz_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({
    name: '',
    mobile: '',
    address: '',
    size: '',
    deliveryArea: 'outside',
    paymentMethod: 'COD',
    trxId: ''
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSection, setAdminSection] = useState('dashboard');

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Fashion',
    image: '',
    description: '',
    sizes: 'Standard',
    stock: 10
  });

  useEffect(() => {
    localStorage.setItem('offerfizz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('offerfizz_orders', JSON.stringify(orders));
  }, [orders]);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderForm({
      name: '',
      mobile: '',
      address: '',
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard',
      deliveryArea: 'outside',
      paymentMethod: 'COD',
      trxId: ''
    });
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.mobile || !orderForm.address) {
      alert("দয়া করে নাম, মোবাইল নম্বর এবং ঠিকানা সঠিকভাবে দিন।");
      return;
    }

    if ((orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') && !orderForm.trxId) {
      alert("দয়া করে বিকাশ/নগদ পেমেন্টের TrxID প্রদান করুন।");
      return;
    }

    const deliveryCharge = orderForm.deliveryArea === 'inside' ? 60 : 120;
    const totalAmount = selectedProduct.price + deliveryCharge;

    const newOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      productName: selectedProduct.name,
      productPrice: selectedProduct.price,
      size: orderForm.size,
      customerName: orderForm.name,
      mobile: orderForm.mobile,
      address: orderForm.address,
      deliveryArea: orderForm.deliveryArea,
      deliveryCharge: deliveryCharge,
      totalAmount: totalAmount,
      paymentMethod: orderForm.paymentMethod,
      trxId: orderForm.trxId || 'N/A',
      status: 'Pending',
      date: new Date().toLocaleDateString('bn-BD')
    };

    setOrders([newOrder, ...orders]);

    const message = `🛍️ *নতুন অর্ডার (OfferFizz BD)* 🛍️\n\n` +
      `🆔 *অর্ডার আইডি:* ${newOrder.id}\n` +
      `📦 *প্রোডাক্ট:* ${newOrder.productName}\n` +
      `📏 *সাইজ:* ${newOrder.size}\n` +
      `💰 *মূল্য:* Tk ${newOrder.productPrice}\n` +
      `🚚 *ডেলিভারি চার্জ:* Tk ${deliveryCharge} (${orderForm.deliveryArea === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})\n` +
      `💵 *সর্বমোট:* Tk ${totalAmount}\n\n` +
      `👤 *নাম:* ${newOrder.customerName}\n` +
      `📞 *মোবাইল:* ${newOrder.mobile}\n` +
      `📍 *ঠিকানা:* ${newOrder.address}\n` +
      `💳 *পেমেন্ট:* ${newOrder.paymentMethod} ${newOrder.trxId !== 'N/A' ? `(TrxID: ${newOrder.trxId})` : ''}`;

    const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSelectedProduct(null);
    alert("আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে! অর্ডার আইডি: " + newOrder.id);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === 'Md Jewel' && adminPassword === 'Jewel@338') {
      setIsAdminLoggedIn(true);
    } else {
      alert("ভুল নাম বা পাসওয়ার্ড!");
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const added = {
      id: Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      description: newProduct.description,
      sizes: newProduct.sizes.split(',').map(s => s.trim()),
      stock: Number(newProduct.stock)
    };

    setProducts([...products, added]);
    setNewProduct({ name: '', price: '', category: 'Fashion', image: '', description: '', sizes: 'Standard', stock: 10 });
    alert("প্রোডাক্ট যুক্ত হয়েছে!");
  };

  const deleteProduct = (id) => {
    if (window.confirm("প্রোডাক্টটি ডিলিট করতে চান?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20">
      
      {/* হেডার */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-2xl">🛍️</span>
          <h1 className="text-xl font-bold text-purple-700">OfferFizz BD</h1>
        </div>
        <button 
          onClick={() => setActiveTab('admin')} 
          className="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          👤 Admin
        </button>
      </header>

      {/* কাস্টমার ভিউ */}
      {activeTab === 'home' && (
        <main>
          <div className="p-3 bg-white border-b">
            <input 
              type="text" 
              placeholder="🔍 প্রোডাক্ট খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="p-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl shadow-md">
              <h2 className="text-lg font-bold mb-1">Welcome to OfferFizz BD!</h2>
              <p className="text-xs opacity-90">কম দামে সেরা অফারে প্রোডাক্ট কিনুন।</p>
            </div>
          </div>

          <div className="px-3 mb-3 flex gap-2 overflow-x-auto pb-1">
            {['All', 'Fashion', 'Gadgets', 'Electronics', 'Beauty'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ২-কলামের প্রোডাক্ট গ্রিড */}
          <div className="px-3">
            <h3 className="text-xs font-bold text-gray-700 mb-2">সকল প্রোডাক্ট ({filteredProducts.length})</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
                  <div>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-36 object-cover" 
                    />
                    <div className="p-2.5">
                      <h4 className="font-semibold text-xs line-clamp-2 text-gray-800 leading-snug">
                        {product.name}
                      </h4>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-purple-700">৳ {product.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 pt-0">
                    <button
                      onClick={() => openOrderModal(product)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition text-center"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* কাস্টমার অর্ডার লিস্ট */}
      {activeTab === 'orders' && (
        <main className="p-4 max-w-md mx-auto">
          <h2 className="text-base font-bold mb-3 text-gray-800">📦 আমার অর্ডারসমূহ</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border text-xs text-gray-500">
              কোনো অর্ডার ইতিহাস পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start border-b pb-1.5 mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-purple-700">{ord.id}</span>
                      <p className="text-[10px] text-gray-400">{ord.date}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ● {ord.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-gray-800">{ord.productName}</h4>
                  <p className="text-xs text-gray-600 mt-1">মোট: ৳{ord.totalAmount} ({ord.paymentMethod})</p>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* অ্যাডমিন প্যানেল */}
      {activeTab === 'admin' && (
        <main className="p-4 max-w-2xl mx-auto">
          {!isAdminLoggedIn ? (
            <div className="bg-white p-5 rounded-2xl shadow-md border max-w-sm mx-auto mt-6">
              <div className="text-center mb-4">
                <span className="text-3xl">🔑</span>
                <h3 className="text-base font-bold mt-1">Admin Login</h3>
                <p className="text-xs text-gray-500">Md Jewel</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="Md Jewel" 
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full border rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full border rounded-xl p-2 text-xs"
                  />
                </div>
                <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-xl text-xs">
                  Login
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4 bg-purple-900 text-white p-3.5 rounded-xl">
                <div>
                  <h2 className="font-bold text-sm">Admin Dashboard</h2>
                  <p className="text-[10px] opacity-80">Md Jewel</p>
                </div>
                <button 
                  onClick={() => setIsAdminLoggedIn(false)} 
                  className="bg-purple-800 hover:bg-purple-700 px-2.5 py-1 rounded text-xs"
                >
                  Logout
                </button>
              </div>

              <div className="flex gap-2 mb-4 border-b pb-2">
                <button 
                  onClick={() => setAdminSection('dashboard')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${adminSection === 'dashboard' ? 'bg-purple-700 text-white' : 'bg-white border'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setAdminSection('orders')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${adminSection === 'orders' ? 'bg-purple-700 text-white' : 'bg-white border'}`}
                >
                  Orders ({orders.length})
                </button>
                <button 
                  onClick={() => setAdminSection('products')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${adminSection === 'products' ? 'bg-purple-700 text-white' : 'bg-white border'}`}
                >
                  Products ({products.length})
                </button>
              </div>

              {adminSection === 'dashboard' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border">
                    <span className="text-[11px] text-gray-500">Total Orders</span>
                    <h3 className="text-lg font-bold text-gray-800">{orders.length}</h3>
                  </div>
                  <div className="bg-white p-3 rounded-xl border">
                    <span className="text-[11px] text-gray-500">Pending Orders</span>
                    <h3 className="text-lg font-bold text-amber-600">{orders.filter(o => o.status === 'Pending').length}</h3>
                  </div>
                  <div className="bg-white p-3 rounded-xl border col-span-2">
                    <span className="text-[11px] text-gray-500">Total Sales</span>
                    <h3 className="text-lg font-bold text-emerald-600">৳ {orders.reduce((sum, o) => sum + o.totalAmount, 0)}</h3>
                  </div>
                </div>
              )}

              {adminSection === 'orders' && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-500 bg-white p-3 rounded-xl border text-center">কোনো অর্ডার নেই</p>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="bg-white p-3 rounded-xl border space-y-1.5 text-xs">
                        <div className="flex justify-between border-b pb-1">
                          <span className="font-bold text-purple-700">{ord.id}</span>
                          <select 
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className="text-xs font-bold border rounded p-0.5 bg-gray-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                        <p><strong>প্রোডাক্ট:</strong> {ord.productName}</p>
                        <p><strong>কাস্টমার:</strong> {ord.customerName} ({ord.mobile})</p>
                        <p><strong>ঠিকানা:</strong> {ord.address}</p>
                        <p><strong>পেমেন্ট:</strong> {ord.paymentMethod} | <strong>TrxID:</strong> <span className="bg-yellow-100 font-bold px-1">{ord.trxId}</span></p>
                        <p className="font-bold text-emerald-700">মোট: ৳{ord.totalAmount}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {adminSection === 'products' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddProduct} className="bg-white p-3 rounded-xl border space-y-2 text-xs">
                    <h3 className="font-bold">নতুন প্রোডাক্ট যুক্ত করুন</h3>
                    <input 
                      type="text" 
                      placeholder="প্রোডাক্ট নাম" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="border p-2 rounded w-full"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="দাম (৳)" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border p-2 rounded"
                        required
                      />
                      <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="border p-2 rounded bg-white"
                      >
                        <option value="Fashion">Fashion</option>
                        <option value="Gadgets">Gadgets</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </div>
                    <input 
                      type="tex
