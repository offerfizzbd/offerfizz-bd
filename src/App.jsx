import React, { useState, useEffect } from 'react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "পুরুষদের এক্সক্লুসিভ প্যাডিং জ্যাকেট",
    regularPrice: 1800,
    price: 1300,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80"],
    description: "স্টাইলিশ ও আরামদায়ক উইন্টার জ্যাকেট। সাইজ: M, L, XL",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviewsCount: 12,
    stock: 15
  },
  {
    id: 2,
    name: "Wireless Bluetooth Smartwatch Ultra",
    regularPrice: 2500,
    price: 1950,
    category: "Gadgets",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
    description: "স্মার্ট ওয়াচ উইথ হেলথ ট্র্যাকিং এবং ব্লুটুথ কলিং ফিচার।",
    sizes: ["Standard"],
    rating: 4.5,
    reviewsCount: 8,
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
  superAdminUser: "Md Jewel",
  superAdminPass: "Jewel@338"
};

const INITIAL_CATEGORIES = ['All', 'Fashion', 'Gadgets', 'Electronics', 'Beauty'];

export default function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('offerfizz_products')) || INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('offerfizz_orders')) || []);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('offerfizz_settings')) || INITIAL_SETTINGS);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('offerfizz_categories')) || INITIAL_CATEGORIES);
  const [admins, setAdmins] = useState(() => JSON.parse(localStorage.getItem('offerfizz_admins')) || [{ username: 'Md Jewel', role: 'Super Admin', isFrozen: false }]);

  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProductDetails, setViewProductDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [customerUser, setCustomerUser] = useState(() => JSON.parse(localStorage.getItem('offerfizz_customer')) || null);
  const [customerForm, setCustomerForm] = useState({ name: '', mobile: '', address: '', password: '' });
  const [isCustomerAuthMode, setIsCustomerAuthMode] = useState('login');

  const [orderForm, setOrderForm] = useState({ name: '', mobile: '', address: '', size: '', deliveryArea: 'outside', paymentMethod: 'COD', trxId: '', paymentScreenshot: '' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loggedInAdminUser, setLoggedInAdminUser] = useState('');
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminSection, setAdminSection] = useState('dashboard');

  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', regularPrice: '', price: '', category: 'Fashion', images: [], description: '', sizes: 'M, L, XL', stock: 10 });
  const [newCatName, setNewCatName] = useState('');
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  useEffect(() => { localStorage.setItem('offerfizz_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('offerfizz_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('offerfizz_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('offerfizz_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('offerfizz_admins', JSON.stringify(admins)); }, [admins]);
  useEffect(() => { customerUser ? localStorage.setItem('offerfizz_customer', JSON.stringify(customerUser)) : localStorage.removeItem('offerfizz_customer'); }, [customerUser]);

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

  const handleCustomerAuth = (e) => {
    e.preventDefault();
    if (isCustomerAuthMode === 'signup') {
      if (!customerForm.name || !customerForm.mobile || !customerForm.password) return alert("দয়া করে সকল তথ্য দিন!");
      setCustomerUser({ ...customerForm });
      alert("অ্যাকাউন্ট তৈরি হয়েছে!");
    } else {
      if (customerUser && customerUser.mobile === customerForm.mobile && customerUser.password === customerForm.password) alert("লগইন সফল!");
      else alert("তথ্য ভুল বা অ্যাকাউন্ট নেই!");
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
    if (!orderForm.name || !orderForm.mobile || !orderForm.address) return alert("সব তথ্য সঠিকভাবে দিন।");
    if ((orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') && (!orderForm.trxId || !orderForm.paymentScreenshot)) return alert("TrxID এবং স্ক্রিনশট দিন।");

    const deliveryCharge = orderForm.deliveryArea === 'inside' ? 60 : 120;
    const newOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      productName: selectedProduct.name,
      productImage: selectedProduct.images?.[0] || '',
      productPrice: selectedProduct.price,
      size: orderForm.size, customerName: orderForm.name, mobile: orderForm.mobile, address: orderForm.address,
      deliveryArea: orderForm.deliveryArea, deliveryCharge, totalAmount: selectedProduct.price + deliveryCharge,
      paymentMethod: orderForm.paymentMethod, trxId: orderForm.trxId || 'N/A', paymentScreenshot: orderForm.paymentScreenshot || null,
      status: 'Pending', packingStatus: 'Processing', estimatedDelivery: '3-5 Days', date: new Date().toLocaleDateString('bn-BD')
    };

    setOrders([newOrder, ...orders]);
    setSelectedProduct(null);
    alert("অর্ডার গৃহীত হয়েছে! আইডি: " + newOrder.id);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory === 'All' || p.category === selectedCategory));

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const adminAccount = admins.find(a => a.username === adminUsernameInput);
    if (adminAccount?.isFrozen) return alert("⚠️ আপনার অ্যাকাউন্ট ফ্রিজ করা রয়েছে!");
    if (adminUsernameInput === settings.superAdminUser && adminPasswordInput === settings.superAdminPass) {
      setIsAdminLoggedIn(true);
      setLoggedInAdminUser(adminUsernameInput);
    } else alert("ভুল ইউজারনেম বা পাসওয়ার্ড!");
  };

  const toggleFreezeAdmin = (username) => {
    if (username === settings.superAdminUser) return alert("সুপার অ্যাডমিন ফ্রিজ করা সম্ভব নয়!");
    setAdmins(admins.map(a => a.username === username ? { ...a, isFrozen: !a.isFrozen } : a));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;
    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p, name: productForm.name, regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price), category: productForm.category, images: productForm.images.length > 0 ? productForm.images : p.images,
        description: productForm.description, sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'], stock: Number(productForm.stock)
      } : p));
      setEditingProductId(null);
    } else {
      setProducts([{
        id: Date.now(), name: productForm.name, regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price), category: productForm.category, images: productForm.images.length > 0 ? productForm.images : ["https://via.placeholder.com/150"],
        description: productForm.description || "প্রিমিয়াম প্রোডাক্ট।", sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'], rating: 5.0, reviewsCount: 1, stock: Number(productForm.stock)
      }, ...products]);
    }
    setProductForm({ name: '', regularPrice: '', price: '', category: 'Fashion', images: [], description: '', sizes: 'M, L, XL', stock: 10 });
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
                          <span className="text-sm font-bold text-purple-700">৳ {product.price}</span>
                          {product.regularPrice > product.price && <span className="text-[10px] text-gray-400 line-through">৳ {product.regularPrice}</span>}
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

        {activeTab === 'profile' && (
          <main className="p-4 max-w-md mx-auto">
            {!customerUser ? (
              <div className="bg-white p-5 rounded-2xl shadow-md border text-xs">
                <div className="flex justify-around border-b pb-2 mb-4">
                  <button onClick={() => setIsCustomerAuthMode('login')} className={`font-bold pb-1 ${isCustomerAuthMode === 'login' ? 'text-purple-700 border-b-2' : 'text-gray-500'}`}>লগইন</button>
                  <button onClick={() => setIsCustomerAuthMode('signup')} className={`font-bold pb-1 ${isCustomerAuthMode === 'signup' ? 'text-purple-700 border-b-2' : 'text-gray-500'}`}>রেজিস্ট্রেশন</button>
                </div>
                <form onSubmit={handleCustomerAuth} className="space-y-3">
                  {isCustomerAuthMode === 'signup' && (
                    <input type="text" placeholder="নাম" required value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} className="w-full border rounded-xl p-2" />
                  )}
                  <input type="tel" placeholder="মোবাইল নম্বর" required value={customerForm.mobile} onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })} className="w-full border rounded-xl p-2" />
                  <input type="password" placeholder="পাসওয়ার্ড" required value={customerForm.password} onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })} className="w-full border rounded-xl p-2" />
                  <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-xl">{isCustomerAuthMode === 'login' ? 'Login' : 'Sign Up'}</button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border text-xs space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-sm text-purple-800">👤 প্রোফাইল</h3>
                  <button onClick={() => setCustomerUser(null)} className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Logout</button>
                </div>
                <p><strong>নাম:</strong> {customerUser.name}</p>
                <p><strong>মোবাইল:</strong> {customerUser.mobile}</p>
              </div>
            )}
          </main>
        )}

        {activeTab === 'orders' && (
          <main className="p-4 max-w-md mx-auto text-xs">
            <h2 className="text-base font-bold mb-3">📦 ট্র্যাকিং ও অর্ডার ইতিহাস</h2>
            {orders.length === 0 ? <p className="text-center py-8 bg-white rounded-xl border text-gray-500">কোনো অর্ডার ইতিহাস নেই।</p> : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-white p-3.5 rounded-xl border space-y-2">
                    <div className="flex justify-between font-bold text-purple-700"><span>{ord.id}</span><span>{ord.status}</span></div>
                    <p><strong>প্রোডাক্ট:</strong> {ord.productName} (৳{ord.totalAmount})</p>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {activeTab === 'admin' && (
          <main className="p-4 max-w-2xl mx-auto text-xs">
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="bg-white p-5 rounded-2xl shadow-md border max-w-sm mx-auto space-y-3">
                <h3 className="font-bold text-center text-sm">Admin Login</h3>
                <input type="text" placeholder="Username" value={adminUsernameInput} onChange={(e) => setAdminUsernameInput(e.target.value)} className="w-full border rounded-xl p-2" />
                <input type="password" placeholder="Password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border rounded-xl p-2" />
                <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-xl">Login</button>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4 bg-purple-900 text-white p-3 rounded-xl">
                  <h2 className="font-bold">Admin Dashboard</h2>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="bg-purple-800 px-2 py-1 rounded">Logout</button>
                </div>
                <div className="flex gap-2 mb-4 border-b pb-2">
                  {['dashboard', 'orders', 'products', 'settings'].map(tab => (
                    <button key={tab} onClick={() => setAdminSection(tab)} className={`px-3 py-1 rounded-lg capitalize ${adminSection === tab ? 'bg-purple-700 text-white' : 'bg-white border'}`}>{tab}</button>
                  ))}
                </div>
                {adminSection === 'dashboard' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border">Total Orders: <h3 className="text-lg font-bold">{orders.length}</h3></div>
                    <div className="bg-white p-3 rounded-xl border">Sales: <h3 className="text-lg font-bold text-emerald-600">৳ {orders.reduce((sum, o) => sum + o.totalAmount, 0)}</h3></div>
                  </div>
                )}
                {adminSection === 'settings' && (
                  <div className="bg-white p-3 rounded-xl border space-y-2">
                    <h3 className="font-bold">ব্যানার আপলোড</h3>
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="w-full border p-1 rounded bg-gray-50" />
                  </div>
                )}
              </div>
            )}
          </main>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 text-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3">
              <div className="flex justify-between font-bold border-b pb-2"><h3 className="text-emerald-700">Confirm Order</h3><button onClick={() => setSelectedProduct(null)}>✕</button></div>
              <form onSubmit={handleConfirmOrder} className="space-y-2">
                <input type="text" placeholder="Your Name" required value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} className="w-full border rounded p-2" />
                <input type="tel" placeholder="Mobile Number" required value={orderForm.mobile} onChange={(e) => setOrderForm({ ...orderForm, mobile: e.target.value })} className="w-full border rounded p-2" />
                <textarea placeholder="Address" required value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} className="w-full border rounded p-2" rows="2"></textarea>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl">Confirm Order (৳{selectedProduct.price + 120})</button>
              </form>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10 text-gray-600 text-[11px]">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-purple-700 font-bold' : ''}>🛍️ Home</button>
          <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'text-purple-700 font-bold' : ''}>📦 Tracking</button>
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'text-purple-700 font-bold' : ''}>👤 Account</button>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 p-4 mt-8 text-center text-xs">
        <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
