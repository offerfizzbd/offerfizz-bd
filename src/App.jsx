import React, { useState, useEffect } from 'react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "🔥 পুরুষদের জন্য এক্সক্লুসিভ প্যাডিং জ্যাকেট 🧥",
    regularPrice: 1800,
    price: 1300,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80"
    ],
    description: "🔥 Exclusive Padding Jacket for Men 🧥\n✨ Exclusive European Style ❄️ Stylish and comfortable for winter\n🧵 Fabric: Micro Fabric\n💎 Padding: 6 ounces\n👌 Inside: Taffeta Lining\n📏 Size Chart:\n✅ M: Chest 40\" | Length 27\"\n✅ L: Chest 42\" | Length 28\"\n✅ XL: Chest 44\" | Length 29\"",
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
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    ],
    description: "⌚ Smart Watch Ultra Edition\n❤️ Heart Rate & Health Tracking\n📞 Bluetooth Calling Feature\n🔋 Long Battery Life\n💧 Water Resistant",
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
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('offerfizz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('offerfizz_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('offerfizz_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('offerfizz_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [admins, setAdmins] = useState(() => {
    const saved = localStorage.getItem('offerfizz_admins');
    return saved ? JSON.parse(saved) : [
      { username: 'Md Jewel', role: 'Super Admin', isFrozen: false }
    ];
  });

  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProductDetails, setViewProductDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('offerfizz_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const [customerForm, setCustomerForm] = useState({
    name: '', mobile: '', address: '', password: ''
  });
  const [isCustomerAuthMode, setIsCustomerAuthMode] = useState('login');

  const [orderForm, setOrderForm] = useState({
    name: '', mobile: '', address: '', size: '',
    deliveryArea: 'outside', paymentMethod: 'COD',
    trxId: '', paymentScreenshot: ''
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loggedInAdminUser, setLoggedInAdminUser] = useState('');
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminSection, setAdminSection] = useState('dashboard');

  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', regularPrice: '', price: '', category: 'Fashion',
    images: [], description: '', sizes: 'M, L, XL', stock: 10
  });

  const [newCatName, setNewCatName] = useState('');
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  useEffect(() => {
    localStorage.setItem('offerfizz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('offerfizz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('offerfizz_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('offerfizz_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('offerfizz_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('offerfizz_customer', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('offerfizz_customer');
    }
  }, [customerUser]);

  const handleMultipleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(uploadedImages => {
        setProductForm(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      });
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, bannerImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrderForm(prev => ({ ...prev, paymentScreenshot: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomerAuth = (e) => {
    e.preventDefault();
    if (isCustomerAuthMode === 'signup') {
      if (!customerForm.name || !customerForm.mobile || !customerForm.password) {
        alert("দয়া করে সকল তথ্য পুরণ করুন!");
        return;
      }
      const user = { name: customerForm.name, mobile: customerForm.mobile, address: customerForm.address, password: customerForm.password };
      setCustomerUser(user);
      alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
    } else {
      if (customerUser && customerUser.mobile === customerForm.mobile && customerUser.password === customerForm.password) {
        alert("সফলভাবে লগইন হয়েছে!");
      } else {
        alert("মোবাইল নম্বর বা পাসওয়ার্ড ভুল অথবা অ্যাকাউন্ট নেই!");
      }
    }
  };

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setViewProductDetails(null);
    setOrderForm({
      name: customerUser ? customerUser.name : '',
      mobile: customerUser ? customerUser.mobile : '',
      address: customerUser ? customerUser.address : '',
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard',
      deliveryArea: 'outside',
      paymentMethod: 'COD',
      trxId: '',
      paymentScreenshot: ''
    });
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.mobile || !orderForm.address) {
      alert("দয়া করে নাম, মোবাইল নম্বর এবং ঠিকানা সঠিকভাবে দিন।");
      return;
    }

    if (orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') {
      if (!orderForm.trxId) {
        alert("দয়া করে বিকাশ/নগদ পেমেন্টের TrxID প্রদান করুন।");
        return;
      }
      if (!orderForm.paymentScreenshot) {
        alert("দয়া করে পেমেন্টের স্ক্রিনশট আপলোড করুন।");
        return;
      }
    }

    const deliveryCharge = orderForm.deliveryArea === 'inside' ? 60 : 120;
    const totalAmount = selectedProduct.price + deliveryCharge;

    const newOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      productName: selectedProduct.name,
      productImage: selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : '',
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
      paymentScreenshot: orderForm.paymentScreenshot || null,
      status: 'Pending',
      packingStatus: 'Processing',
      estimatedDelivery: '3-5 Days',
      date: new Date().toLocaleDateString('bn-BD')
    };

    setOrders([newOrder, ...orders]);
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
    const adminAccount = admins.find(a => a.username === adminUsernameInput);
    
    if (adminAccount && adminAccount.isFrozen) {
      alert("⚠️ আপনার অ্যাডমিন অ্যাকাউন্টটি বর্তমানে ফ্রিজ (Freeze) করা রয়েছে!");
      return;
    }

    if (adminUsernameInput === settings.superAdminUser && adminPasswordInput === settings.superAdminPass) {
      setIsAdminLoggedIn(true);
      setLoggedInAdminUser(adminUsernameInput);
    } else {
      alert("ভুল ইউজারনেম বা পাসওয়ার্ড!");
    }
  };

  const toggleFreezeAdmin = (username) => {
    if (username === settings.superAdminUser) {
      alert("সুপার অ্যাডমিন অ্যাকাউন্ট ফ্রিজ করা সম্ভব নয়!");
      return;
    }
    setAdmins(admins.map(a => a.username === username ? { ...a, isFrozen: !a.isFrozen } : a));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const updateOrderDeliveryDetails = (orderId, packingStatus, estimatedDelivery) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, packingStatus, estimatedDelivery } : o));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই অর্ডারটি ডিলিট করতে চান?")) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p,
        name: productForm.name,
        regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price),
        category: productForm.category,
        images: productForm.images.length > 0 ? productForm.images : p.images,
        description: productForm.description,
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'],
        stock: Number(productForm.stock)
      } : p));
      setEditingProductId(null);
      alert("প্রোডাক্ট এডিট সম্পন্ন হয়েছে!");
    } else {
      const added = {
        id: Date.now(),
        name: productForm.name,
        regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price),
        category: productForm.category,
        images: productForm.images.length > 0 ? productForm.images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
        description: productForm.description || "উচ্চমানের প্রিমিয়াম প্রোডাক্ট।",
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'],
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(productForm.stock)
      };
      setProducts([added, ...products]);
      alert("নতুন প্রোডাক্ট যুক্ত হয়েছে!");
    }

    setProductForm({ name: '', regularPrice: '', price: '', category: 'Fashion', images: [], description: '', sizes: 'M, L, XL', stock: 10 });
  };

  const handleEditProductClick = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      regularPrice: product.regularPrice || product.price,
      price: product.price,
      category: product.category,
      images: product.images || [],
      description: product.description,
      sizes: product.sizes ? product.sizes.join(', ') : 'Standard',
      stock: product.stock
    });
  };

  const deleteProduct = (id) => {
    if (window.confirm("প্রোডাক্টটি ডিলিট করতে চান?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCatName.trim() && !categories.includes(newCatName.trim())) {
      setCategories([...categories, newCatName.trim()]);
      setNewCatName('');
      alert("নতুন ক্যাটাগরি যুক্ত হয়েছে!");
    }
  };

  const deleteCategory = (cat) => {
    if (cat === 'All') return;
    if (window.confirm(`"${cat}" ক্যাটাগরি ডিলিট করতে চান?`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passForm.oldPass !== settings.superAdminPass) {
      alert("বর্তমান পাসওয়ার্ডটি সঠিক নয়!");
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      alert("নতুন পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }

    setSettings({ ...settings, superAdminPass: passForm.newPass });
    setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
    alert("পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!");
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
            <button 
              onClick={() => setActiveTab('profile')} 
              className="text-xs bg-gray-100 text-gray-700 font-bold px-2.5 py-1.5 rounded-lg"
            >
              👤 Profile
            </button>
            <button 
              onClick={() => setActiveTab('admin')} 
              className="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              🔑 Admin
            </button>
          </div>
        </header>

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
              {settings.bannerImage ? (
                <div className="relative rounded-2xl overflow-hidden shadow-md h-36">
                  <img src={settings.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl shadow-md">
                  <h2 className="text-lg font-bold mb-1">{settings.bannerTitle}</h2>
                  <p className="text-xs opacity-90">{settings.bannerSubtitle}</p>
                </div>
              )}
            </div>

            <div className="px-3 mb-3 flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
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

            <div className="px-3">
              <h3 className="text-xs font-bold text-gray-700 mb-2">সকল প্রোডাক্ট ({filteredProducts.length})</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
                    <div onClick={() => { setViewProductDetails(product); setActiveImageIndex(0); }} className="cursor-pointer">
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150"} 
                        alt={product.name} 
                        className="w-full h-36 object-cover" 
                      />
                      <div className="p-2.5">
                        <h4 className="font-semibold text-xs line-clamp-2 text-gray-800 leading-snug hover:text-purple-700">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                          ★ {product.rating || 5.0} <span className="text-gray-400 font-normal">({product.reviewsCount || 0})</span>
                        </div>

                        <div className="mt-2 flex items-baseline justify-between">
                          <div>
                            <span className="text-sm font-bold text-purple-700">৳ {product.price}</span>
                            {product.regularPrice > product.price && (
                              <span className="text-[10px] text-gray-400 line-through ml-1.5">৳ {product.regularPrice}</span>
                            )}
                          </div>
                          {product.images && product.images.length > 1 && (
                            <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-semibold">
                              {product.images.length} Colors
                            </span>
                          )}
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

        {activeTab === 'profile' && (
          <main className="p-4 max-w-md mx-auto">
            {!customerUser ? (
              <div className="bg-white p-5 rounded-2xl shadow-md border text-xs">
   
