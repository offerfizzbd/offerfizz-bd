import React, { useState, useEffect } from 'react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Exclusive Padding Jacket for Men 🧥",
    regularPrice: 1800,
    price: 1300,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80"
    ],
    description: "🔥 Exclusive European Style Winter Jacket\n✨ Stylish and comfortable for winter\n📏 Size Chart: M, L, XL",
    sizes: ["M", "L", "XL"],
    stock: 15
  },
  {
    id: 2,
    name: "Stylish Denim Jacket for Winter",
    regularPrice: 1500,
    price: 1050,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80"
    ],
    description: "High quality premium denim jacket for men.",
    sizes: ["M", "L", "XL"],
    stock: 10
  },
  {
    id: 3,
    name: "Chinese Winter Shacket Jacket",
    regularPrice: 1800,
    price: 1400,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    ],
    description: "Exclusive winter shacket jacket with soft lining.",
    sizes: ["M", "L", "XL"],
    stock: 8
  }
];

const INITIAL_SETTINGS = {
  storeName: "OfferFizz BD",
  bannerTitle: "Welcome to OfferFizz BD!",
  bannerSubtitle: "কম দামে সেরা অফারে প্রিমিয়াম প্রোডাক্ট কিনুন।",
  bannerImage: "",
  bkashNumber: "01700000000",
  nagadNumber: "01700000000",
  contactPhone: "01700000000",
  contactEmail: "support@offerfizzbd.com",
  facebookUrl: "https://facebook.com",
  whatsappUrl: "https://wa.me/8801700000000",
  superAdminUser: "admin",
  superAdminPass: "1234"
};

const INITIAL_CATEGORIES = ['All', 'Fashion', 'Gadgets', 'Electronics', 'Beauty'];

export default function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('offerfizz_products')) || INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('offerfizz_orders')) || []);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('offerfizz_settings')) || INITIAL_SETTINGS);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('offerfizz_categories')) || INITIAL_CATEGORIES);

  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProductDetails, setViewProductDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [customerUser, setCustomerUser] = useState(() => JSON.parse(localStorage.getItem('offerfizz_customer')) || null);
  const [customerForm, setCustomerForm] = useState({ name: '', mobile: '', address: '', password: '' });
  const [isCustomerAuthMode, setIsCustomerAuthMode] = useState('login');

  const [orderForm, setOrderForm] = useState({
    name: '', mobile: '', address: '', size: '',
    deliveryArea: 'outside', paymentMethod: 'COD',
    trxId: '', paymentScreenshot: ''
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminSection, setAdminSection] = useState('products');

  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', regularPrice: '', price: '', category: 'Fashion',
    images: [], description: '', sizes: 'M, L, XL', stock: 10
  });

  const [newCatName, setNewCatName] = useState('');
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  useEffect(() => { localStorage.setItem('offerfizz_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('offerfizz_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('offerfizz_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('offerfizz_categories', JSON.stringify(categories)); }, [categories]);

  const handleMultipleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      Promise.all(files.map(file => new Promise(res => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result);
        reader.readAsDataURL(file);
      }))).then(imgs => setProductForm(prev => ({ ...prev, images: [...prev.images, ...imgs] })));
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSettings(prev => ({ ...prev, bannerImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOrderForm(prev => ({ ...prev, paymentScreenshot: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setViewProductDetails(null);
    setOrderForm({
      name: customerUser ? customerUser.name : '',
      mobile: customerUser ? customerUser.mobile : '',
      address: customerUser ? customerUser.address : '',
      size: product.sizes?.[0] || 'Standard',
      deliveryArea: 'outside', paymentMethod: 'COD', trxId: '', paymentScreenshot: ''
    });
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.mobile || !orderForm.address) return alert("দয়া করে নাম, মোবাইল এবং ঠিকানা দিন।");
    if ((orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') && (!orderForm.trxId || !orderForm.paymentScreenshot)) {
      return alert("দয়া করে TrxID এবং পেমেন্ট স্ক্রিনশট আপলোড করুন।");
    }

    const deliveryCharge = orderForm.deliveryArea === 'inside' ? 60 : 120;
    const newOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      productName: selectedProduct.name,
      productImage: selectedProduct.images?.[0] || '',
      productPrice: selectedProduct.price,
      size: orderForm.size, customerName: orderForm.name, mobile: orderForm.mobile, address: orderForm.address,
      deliveryArea: orderForm.deliveryArea, deliveryCharge, totalAmount: selectedProduct.price + deliveryCharge,
      paymentMethod: orderForm.paymentMethod, trxId: orderForm.trxId || 'N/A', paymentScreenshot: orderForm.paymentScreenshot || null,
      status: 'Pending', date: new Date().toLocaleDateString('bn-BD')
    };

    setOrders([newOrder, ...orders]);
    setSelectedProduct(null);
    alert("আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে! অর্ডার আইডি: " + newOrder.id);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory === 'All' || p.category === selectedCategory));

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsernameInput.trim() === 'admin' && adminPasswordInput.trim() === '1234') {
      setIsAdminLoggedIn(true);
    } else {
      alert("ভুল ইউজারনেম বা পাসওয়ার্ড!");
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return alert("নাম এবং দাম আবশ্যক!");

    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p, name: productForm.name, regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price), category: productForm.category, images: productForm.images.length > 0 ? productForm.images : p.images,
        description: productForm.description, sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'], stock: Number(productForm.stock)
      } : p));
      setEditingProductId(null);
      alert("প্রোডাক্ট আপডেট হয়েছে!");
    } else {
      setProducts([{
        id: Date.now(), name: productForm.name, regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price), category: productForm.category, images: productForm.images.length > 0 ? productForm.images : ["https://via.placeholder.com/150"],
        description: productForm.description || "প্রিমিয়াম প্রোডাক্ট।", sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'], stock: Number(productForm.stock)
      }, ...products]);
      alert("নতুন প্রোডাক্ট যুক্ত হয়েছে!");
    }
    setProductForm({ name: '', regularPrice: '', price: '', category: 'Fashion', images: [], description: '', sizes: 'M, L, XL', stock: 10 });
  };

  const handleEditProductClick = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name, regularPrice: product.regularPrice || product.price, price: product.price,
      category: product.category, images: product.images || [], description: product.description,
      sizes: product.sizes ? product.sizes.join(', ') : 'Standard', stock: product.stock
    });
  };

  const deleteProduct = (id) => {
    if (window.confirm("প্রোডাক্টটি মুছে ফেলতে চান?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 flex flex-col justify-between">
      <div>
        <header className="bg-white shadow-sm border-b sticky top-0 z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="text-2xl">🛍️</span>
            <h1 className="text-xl font-bold text-purple-700">{settings.storeName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('profile')} className="text-xs bg-gray-100 px-2.5 py-1.5 rounded-lg font-bold">👤 Profile</button>
            <button onClick={() => setActiveTab('admin')} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold">🔑 Admin</button>
          </div>
        </header>

        {activeTab === 'home' && (
          <main>
            <div className="p-3 bg-white border-b">
              <input type="text" placeholder="🔍 প্রোডাক্ট খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-100 rounded-xl px-4 py-2 text-xs" />
            </div>

            <div className="p-3">
              {settings.bannerImage ? (
                <div className="rounded-2xl overflow-hidden h-36"><img src={settings.bannerImage} alt="Banner" className="w-full h-full object-cover" /></div>
              ) : (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl shadow-md">
                  <h2 className="text-lg font-bold mb-1">{settings.bannerTitle}</h2>
                  <p className="text-xs opacity-90">{settings.bannerSubtitle}</p>
                </div>
              )}
            </div>

            <div className="px-3 mb-3 flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedCategory === cat ? 'bg-purple-700 text-white' : 'bg-white text-gray-600 border'}`}>{cat}</button>
              ))}
            </div>

            <div className="px-3">
              <h3 className="text-xs font-bold text-gray-700 mb-2">সকল প্রোডাক্ট ({filteredProducts.length})</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col justify-between">
                    <div onClick={() => { setViewProductDetails(product); setActiveImageIndex(0); }} className="cursor-pointer">
                      <img src={product.images?.[0] || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-36 object-cover" />
                      <div className="p-2.5">
                        <h4 className="font-semibold text-xs line-clamp-2 leading-snug">{product.name}</h4>
                        <div className="mt-2 flex items-baseline justify-between">
                          <div>
                            <span className="text-sm font-bold text-purple-700">৳ {product.price}</span>
                            {product.regularPrice > product.price && <span className="text-[10px] text-gray-400 line-through ml-1">৳ {product.regularPrice}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 pt-0">
                      <button onClick={() => openOrderModal(product)} className="w-full bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg">Order Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {activeTab === 'admin' && (
          <main className="p-4 max-w-2xl mx-auto text-xs">
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="bg-white p-5 rounded-2xl shadow-md border max-w-sm mx-auto space-y-3">
                <h3 className="font-bold text-center text-sm">Admin Login</h3>
                <input type="text" placeholder="Username (admin)" value={adminUsernameInput} onChange={(e) => setAdminUsernameInput(e.target.value)} className="w-full border rounded-xl p-2" />
                <input type="password" placeholder="Password (1234)" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border rounded-xl p-2" />
                <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-xl">Login</button>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4 bg-purple-900 text-white p-3 rounded-xl">
                  <h2 className="font-bold">Admin Dashboard</h2>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="bg-purple-800 px-2.5 py-1 rounded">Logout</button>
                </div>
                <div className="flex gap-2 mb-4 border-b pb-2 overflow-x-auto">
                  {['dashboard', 'orders', 'products', 'settings'].map(tab => (
                    <button key={tab} onClick={() => setAdminSection(tab)} className={`px-3 py-1 rounded-lg capitalize font-bold ${adminSection === tab ? 'bg-purple-700 text-white' : 'bg-white border'}`}>{tab}</button>
                  ))}
                </div>

                {adminSection === 'dashboard' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border">Total Orders: <h3 className="text-lg font-bold">{orders.length}</h3></div>
                    <div className="bg-white p-3 rounded-xl border">Sales: <h3 className="text-lg font-bold text-emerald-600">৳ {orders.reduce((sum, o) => sum + o.totalAmount, 0)}</h3></div>
                  </div>
                )}

                {adminSection === 'orders' && (
                  <div className="space-y-3">
                    {orders.length === 0 ? <p className="text-center bg-white p-4 rounded-xl border text-gray-500">কোনো অর্ডার নেই</p> : (
                      orders.map(ord => (
                        <div key={ord.id} className="bg-white p-3 rounded-xl border space-y-1">
                          <div className="flex justify-between font-bold text-purple-700"><span>{ord.id}</span><span>{ord.status}</span></div>
                          <p><strong>প্রোডাক্ট:</strong> {ord.productName} ({ord.size})</p>
                          <p><strong>কাস্টমার:</strong> {ord.customerName} ({ord.mobile})</p>
                          <p><strong>ঠিকানা:</strong> {ord.address}</p>
                          <p><strong>পেমেন্ট:</strong> {ord.paymentMethod} | TrxID: {ord.trxId}</p>
                          <p className="font-bold text-emerald-700">মোট: ৳{ord.totalAmount}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {adminSection === 'products' && (
                  <div className="space-y-4">
                    <form onSubmit={handleSaveProduct} className="bg-white p-3.5 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1 text-purple-800">{editingProductId ? "✏️ প্রোডাক্ট এডিট করুন" : "➕ নতুন প্রোডাক্ট যুক্ত করুন (পোস্ট করুন)"}</h3>
                      <input type="text" placeholder="প্রোডাক্ট নাম" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="border p-2 rounded w-full" required />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="আগের দাম (৳)" value={productForm.regularPrice} onChange={(e) => setProductForm({ ...productForm, regularPrice: e.target.value })} className="border p-2 rounded" />
                        <input type="number" placeholder="অফার দাম (৳)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="border p-2 rounded" required />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-600 mb-1">প্রোডাক্ট ছবি নির্বাচন করুন:</label>
                        <input type="file" accept="image/*" multiple onChange={handleMultipleImagesUpload} className="border p-1.5 rounded w-full bg-gray-50" />
                      </div>
                      <textarea placeholder="প্রোডাক্ট বিবরণ..." value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="border p-2 rounded w-full" rows="3"></textarea>
                      <input type="text" placeholder="সাইজসমূহ (যেমন: M, L, XL)" value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} className="border p-2 rounded w-full" />
                      <button type="submit" className="bg-emerald-600 text-white font-bold py-2 rounded w-full">{editingProductId ? "আপডেট করুন" : "পাবলিশ / পোস্ট করুন"}</button>
                    </form>

                    <div className="space-y-2">
                      <h4 className="font-bold">বিদ্যমান প্রোডাক্টসমূহ:</h4>
                      {products.map(p => (
                        <div key={p.id} className="bg-white p-2 rounded-xl border flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img src={p.images?.[0] || ''} alt={p.name} className="w-10 h-10 object-cover rounded" />
                            <div><p className="font-bold line-clamp-1">{p.name}</p><span className="text-purple-700">৳{p.price}</span></div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleEditProductClick(p)} className="bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded">✏️ Edit</button>
                            <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 font-bold px-2 py-1 rounded">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                 {adminSection === 'settings' && (
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1">ওয়েবসাইট সেটিংস</h3>
                      <label className="block font-semibold">স্টোর নাম:</label>
                      <input type="text" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="w-full border rounded p-2" />
                      <label className="block font-semibold mt-2">হোমপেজ ব্যানার আপলোড:</label>
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="w-full border p-1 rounded bg-gray-50" />
                    </div>

                    <div className="bg-white p-3 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1">পেমেন্ট নম্বর সেটিংস</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="block font-semibold mb-1">bKash নম্বর:</label><input type="text" value={settings.bkashNumber} onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })} className="border rounded p-2 w-full" /></div>
                        <div><label className="block font-semibold mb-1">Nagad নম্বর:</label><input type="text" value={settings.nagadNumber} onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })} className="border rounded p-2 w-full" /></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 text-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between font-bold border-b pb-2"><h3 className="text-emerald-700 text-sm">Confirm Order</h3><button onClick={() => setSelectedProduct(null)} className="text-gray-500">✕</button></div>
              <form onSubmit={handleConfirmOrder} className="space-y-2">
                <div><label className="block font-bold mb-1">Product:</label><p className="bg-gray-100 p-2 rounded">{selectedProduct.name}</p></div>
                <div><label className="block font-bold mb-1">Your Name:</label><input type="text" placeholder="Enter your name" required value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} className="w-full border rounded p-2" /></div>
                <div><label className="block font-bold mb-1">Mobile Number:</label><input type="tel" placeholder="01XXXXXXXXX" required value={orderForm.mobile} onChange={(e) => setOrderForm({ ...orderForm, mobile: e.target.value })} className="w-full border rounded p-2" /></div>
                <div><label className="block font-bold mb-1">Full Address:</label><textarea placeholder="Your address" required value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} className="w-full border rounded p-2" rows="2"></textarea></div>
                
                <div>
                  <label className="block font-bold mb-1">Select Size:</label>
                  <select value={orderForm.size} onChange={(e) => setOrderForm({ ...orderForm, size: e.target.value })} className="w-full border rounded p-2 bg-white">
                    {selectedProduct.sizes?.map((sz, idx) => <option key={idx} value={sz}>{sz}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Delivery Area:</label>
                  <select value={orderForm.deliveryArea} onChange={(e) => setOrderForm({ ...orderForm, deliveryArea: e.target.value })} className="w-full border rounded p-2 bg-white">
                    <option value="outside">Outside Dhaka — (Charge: ৳120)</option>
                    <option value="inside">Inside Dhaka — (Charge: ৳60)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Payment Method:</label>
                  <select value={orderForm.paymentMethod} onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })} className="w-full border rounded p-2 bg-white">
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="bKash">bKash Personal ({settings.bkashNumber})</option>
                    <option value="Nagad">Nagad Personal ({settings.nagadNumber})</option>
                  </select>
                </div>

                {(orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') && (
                  <div className="bg-purple-50 p-2 rounded-xl border space-y-2">
                    <p className="text-[11px] text-purple-800 font-semibold">টাকা পাঠিয়ে TrxID এবং স্ক্রিনশট দিন:</p>
                    <input type="text" placeholder="Enter TrxID" required value={orderForm.trxId} onChange={(e) => setOrderForm({ ...orderForm, trxId: e.target.value })} className="w-full border rounded p-1.5 bg-white" />
                    <input type="file" accept="image/*" required onChange={handleScreenshotUpload} className="w-full bg-white border p-1 rounded" />
                  </div>
                )}

                <div className="border-2 border-dashed border-emerald-500 bg-emerald-50 p-2 rounded-xl text-center font-bold text-emerald-800">
                  Total: ৳ {selectedProduct.price + (orderForm.deliveryArea === 'inside' ? 60 : 120)}
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-md">Confirm Order</button>
              </form>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10 text-gray-600 text-[11px]">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-purple-700 font-bold' : ''}>🛍️ Home</button>
          <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-purple-700 font-bold' : ''}>🔑 Admin</button>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 p-4 mt-8 text-center text-xs">
        <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
      </footer>
    </div>
  );
                                                                                                                                                                                               }
