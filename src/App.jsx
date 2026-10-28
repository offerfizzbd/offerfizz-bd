import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

// ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyAbQA6QPiq2WYHEZGiwrcRxLW5lUrWa3I",
  authDomain: "offerfizz-bd.firebaseapp.com",
  projectId: "offerfizz-bd",
  storageBucket: "offerfizz-bd.firebasestorage.app",
  messagingSenderId: "520069924104",
  appId: "1:520069924104:web:66243c62fcbcao2ec9d8bd",
  measurementId: "G-8NS7RNZ9Q5"
};

// ফায়ারবেস ইনিশিয়ালাইজ
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Exclusive Padding Jacket for Men 🧥",
    regularPrice: 1800,
    price: 1300,
    category: "Fashion",
    subcategory: "Men",
    colors: ["Black", "Navy Blue", "Olive"],
    colorImages: {
      "Black": "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80",
      "Navy Blue": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      "Olive": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    },
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80"
    ],
    description: "🔥 Exclusive European Style Winter Jacket\n✨ Stylish and comfortable for winter\n📏 Size Chart: M, L, XL",
    sizes: ["M", "L", "XL"],
    stock: 15
  }
];

const INITIAL_SETTINGS = {
  storeName: "OfferFizz BD",
  bannerTitle: "Welcome to OfferFizz BD!",
  bannerSubtitle: "কম দামে সেরা অফারে প্রিমিয়াম প্রোডাক্ট কিনুন।",
  bannerImage: "",
  bkashNumber: "01963590338",
  nagadNumber: "01963590338",
  contactPhone: "01963590338",
  contactEmail: "support@offerfizzbd.com",
  facebookUrl: "https://facebook.com",
  whatsappUrl: "https://wa.me/8801963590338",
  superAdminUser: "জুয়েল",
  superAdminPass: "1234",
  deliveryPolicyUrl: "",
  returnPolicyUrl: ""
};

const INITIAL_CATEGORIES = [
  { name: 'All', subcategories: [] },
  { name: 'Fashion', subcategories: ['Men', 'Women', 'Kids'] },
  { name: 'Gadgets', subcategories: ['Mobile Accessories', 'Smartwatch'] },
  { name: 'Electronics', subcategories: ['Home Appliance'] },
  { name: 'Beauty', subcategories: ['Skincare'] }
];

export default function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('offerfizz_products')) || INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('offerfizz_orders')) || []);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('offerfizz_settings')) || INITIAL_SETTINGS);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('offerfizz_categories')) || INITIAL_CATEGORIES);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('offerfizz_customers')) || []);
  const [customPages, setCustomPages] = useState(() => JSON.parse(localStorage.getItem('offerfizz_pages')) || []);

  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProductDetails, setViewProductDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorForOrder, setSelectedColorForOrder] = useState('');

  const [customerUser, setCustomerUser] = useState(() => JSON.parse(localStorage.getItem('offerfizz_customer_logged')) || null);
  const [customerAuthForm, setCustomerAuthForm] = useState({ name: '', mobile: '', address: '', password: '' });
  const [isCustomerAuthMode, setIsCustomerAuthMode] = useState('login');

  const [orderForm, setOrderForm] = useState({
    name: '', mobile: '', address: '', size: '', color: '', quantity: 1,
    paymentMethod: 'COD', trxId: '', paymentScreenshot: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminSection, setAdminSection] = useState('dashboard');

  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', regularPrice: '', price: '', category: 'Fashion', subcategory: '',
    colorsStr: 'Black, Navy Blue', images: [], colorImages: {}, description: '', sizes: 'M, L, XL', stock: 10
  });

  const [newCatName, setNewCatName] = useState('');
  const [newSubCatName, setNewSubCatName] = useState('');
  const [selectedCatForSub, setSelectedCatForSub] = useState('Fashion');
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  const [newPageForm, setNewPageForm] = useState({ title: '', content: '' });
  const [activePageContent, setActivePageContent] = useState(null);

  useEffect(() => {
    // ফায়ারবেস অ্যানালিটিক্স পেজ ভিউ লগ করা
    logEvent(analytics, 'page_view', { page_title: 'Home' });

    const handleHashOrPath = () => {
      const path = window.location.pathname + window.location.hash;
      if (path.includes('Admin.J')) {
        setActiveTab('admin');
      }
    };
    handleHashOrPath();
    window.addEventListener('popstate', handleHashOrPath);
    return () => window.removeEventListener('popstate', handleHashOrPath);
  }, []);

  useEffect(() => { localStorage.setItem('offerfizz_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('offerfizz_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('offerfizz_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('offerfizz_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('offerfizz_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('offerfizz_customer_logged', JSON.stringify(customerUser)); }, [customerUser]);
  useEffect(() => { localStorage.setItem('offerfizz_pages', JSON.stringify(customPages)); }, [customPages]);

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
    const defaultColor = product.colors?.[0] || '';
    setSelectedColorForOrder(defaultColor);
    setOrderForm({
      name: customerUser ? customerUser.name : '',
      mobile: customerUser ? customerUser.mobile : '',
      address: customerUser ? customerUser.address : '',
      size: product.sizes?.[0] || 'Standard',
      color: defaultColor,
      quantity: 1,
      paymentMethod: 'COD', trxId: '', paymentScreenshot: ''
    });
    setFormErrors({});
  };

  const isInsideDhaka = orderForm.address.toLowerCase().includes('dhaka') || orderForm.address.includes('ঢাকা');
  const deliveryCharge = isInsideDhaka ? 60 : 120;

  // ফায়ারবেস ডাটাবেজে অর্ডার সেভ করার ফাংশন
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!orderForm.name.trim()) errors.name = true;
    if (!orderForm.mobile.trim() || orderForm.mobile.length < 11) errors.mobile = true;
    if (!orderForm.address.trim()) errors.address = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return alert("দয়া করে নাম, সঠিক মোবাইল নম্বর এবং ঠিকানা পূরণ করুন। ভুল ফিল্ডগুলো লাল চিহ্নিত করা হয়েছে।");
    }

    if ((orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') && (!orderForm.trxId || !orderForm.paymentScreenshot)) {
      return alert("দয়া করে TrxID এবং পেমেন্ট স্ক্রিনশট আপলোড করুন।");
    }

    const nowTime = new Date().toLocaleString('bn-BD', { hour12: true });
    const chosenColor = selectedColorForOrder || orderForm.color || '';
    const finalImg = selectedProduct.colorImages?.[chosenColor] || selectedProduct.images?.[0] || '';

    const unitPrice = selectedProduct.price;
    const qty = Number(orderForm.quantity) || 1;
    const totalAmount = (unitPrice * qty) + deliveryCharge;

    const newOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      productName: selectedProduct.name,
      
      productPrice: unitPrice,
      quantity: qty,
      size: orderForm.size,
      color: chosenColor,
      customerMobile: orderForm.mobile,
      customerName: orderForm.name, 
      mobile: orderForm.mobile, 
      address: orderForm.address,
      deliveryArea: isInsideDhaka ? 'inside' : 'outside', 
      deliveryCharge, 
      totalAmount,
      paymentMethod: orderForm.paymentMethod, 
      trxId: orderForm.trxId || 'N/A', 
      paymentScreenshot: orderForm.paymentScreenshot || null,
      status: 'Pending', 
      orderTime: nowTime,
      confirmedTime: null
    };

    try {
      // Firestore Database-এ অর্ডার সেভ করা
      await addDoc(collection(db, "orders"), newOrder);
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
    }

    setOrders([newOrder, ...orders]);
    setSelectedProduct(null);
    alert("আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে! অর্ডার আইডি: " + newOrder.id);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const confirmTimeStr = new Date().toLocaleString('bn-BD', { hour12: true });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, confirmedTime: confirmTimeStr } : o));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("অর্ডারটি মুছে ফেলতে চান?")) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSub = selectedSubCategory === 'All' || p.subcategory === selectedSubCategory;
    return matchesSearch && matchesCat && matchesSub;
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsernameInput.trim() === settings.superAdminUser && adminPasswordInput.trim() === settings.superAdminPass) {
      setIsAdminLoggedIn(true);
    } else {
      alert("ভুল ইউজারনেম বা পাসওয়ার্ড!");
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return alert("নাম এবং দাম আবশ্যক!");

    const colorsList = productForm.colorsStr ? productForm.colorsStr.split(',').map(c => c.trim()) : [];
    let colorImgs = productForm.colorImages || {};
    if (productForm.images.length > 0 && colorsList.length > 0) {
      colorsList.forEach((clr, idx) => {
        colorImgs[clr] = productForm.images[idx % productForm.images.length];
      });
    }

    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p, 
        name: productForm.name, 
        regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price), 
        category: productForm.category, 
        subcategory: productForm.subcategory || '', 
        colors: colorsList,
        colorImages: colorImgs,
        images: productForm.images.length > 0 ? productForm.images : p.images,
        description: productForm.description, 
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'], 
        stock: Number(productForm.stock)
      } : p));
      setEditingProductId(null);
      alert("প্রোডাক্ট আপডেট হয়েছে!");
    } else {
      const newProd = {
        id: Date.now(), 
        name: productForm.name, 
        regularPrice: Number(productForm.regularPrice) || Number(productForm.price),
        price: Number(productForm.price), 
        category: productForm.category, 
        subcategory: productForm.subcategory || '',
        colors: colorsList,
        colorImages: colorImgs,
        images: productForm.images.length > 0 ? productForm.images : ["https://via.placeholder.com/150"],
        description: productForm.description || "প্রিমিয়াম প্রোডাক্ট।", 
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : ['Standard'], 
        stock: Number(productForm.stock)
      };
      setProducts(prevProducts => [newProd, ...prevProducts]);
      alert("নতুন প্রোডাক্ট সফলভাবে পোস্ট করা হয়েছে!");
    }
    setProductForm({ name: '', regularPrice: '', price: '', category: 'Fashion', subcategory: '', colorsStr: 'Black, Navy Blue', images: [], colorImages: {}, description: '', sizes: 'M, L, XL', stock: 10 });
  };

  const handleEditProductClick = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name, 
      regularPrice: product.regularPrice || product.price, 
      price: product.price,
      category: product.category, 
      subcategory: product.subcategory || '', 
      colorsStr: product.colors ? product.colors.join(', ') : '',
      images: product.images || [], 
      colorImages: product.colorImages || {},
      description: product.description,
      sizes: product.sizes ? product.sizes.join(', ') : 'Standard', 
      stock: product.stock
    });
  };

  const deleteProduct = (id) => {
    if (window.confirm("প্রোডাক্টটি মুছে ফেলতে চান?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) return alert("ক্যাটাগরি ইতিমধ্যে আছে!");
    setCategories([...categories, { name: newCatName.trim(), subcategories: [] }]);
    setNewCatName('');
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!newSubCatName.trim()) return;
    setCategories(categories.map(cat => {
      if (cat.name === selectedCatForSub) {
        const subs = cat.subcategories || [];
        if (subs.includes(newSubCatName.trim())) return cat;
        return { ...cat, subcategories: [...subs, newSubCatName.trim()] };
      }
      return cat;
    }));
    setNewSubCatName('');
  };

  const deleteCategory = (catName) => {
    if (catName === 'All') return alert("ডিফল্ট ক্যাটাগরি মোছা যাবে না।");
    if (window.confirm(`"${catName}" ক্যাটাগরি মুছতে চান?`)) {
      setCategories(categories.filter(c => c.name !== catName));
      if (selectedCategory === catName) setSelectedCategory('All');
    }
  };

  const deleteSubcategory = (catName, subName) => {
    setCategories(categories.map(cat => {
      if (cat.name === catName) {
        return { ...cat, subcategories: (cat.subcategories || []).filter(s => s !== subName) };
      }
      return cat;
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passForm.oldPass !== settings.superAdminPass) return alert("পুরানো পাসওয়ার্ড ভুল!");
    if (passForm.newPass !== passForm.confirmPass) return alert("নতুন পাসওয়ার্ড মিলছে না!");
    if (!passForm.newPass) return alert("নতুন পাসওয়ার্ড দিন!");

    setSettings({ ...settings, superAdminPass: passForm.newPass });
    setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
    alert("অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");
  };

  const handleCustomerAuth = (e) => {
    e.preventDefault();
    if (isCustomerAuthMode === 'register') {
      if (!customerAuthForm.name || !customerAuthForm.mobile || !customerAuthForm.password) return alert("সব ফিল্ড পূরণ করুন!");
      const existing = customers.find(c => c.mobile === customerAuthForm.mobile);
      if (existing) return alert("এই নম্বরে ইতিমধ্যে অ্যাকাউন্ট আছে!");

      const newCust = { ...customerAuthForm, isFrozen: false, id: Date.now() };
      setCustomers([...customers, newCust]);
      setCustomerUser(newCust);
      alert("সফলভাবে রেজিস্টার্ড হয়েছে!");
    } else {
      const found = customers.find(c => c.mobile === customerAuthForm.mobile && c.password === customerAuthForm.password);
      if (!found) return alert("নম্বর বা পাসওয়ার্ড ভুল!");
      if (found.isFrozen) return alert("আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক ফ্রিজ (স্থগিত) করা হয়েছে!");
      setCustomerUser(found);
      alert("লগইন সফল হয়েছে!");
    }
  };

  const handleCustomerProfileUpdate = (e) => {
    e.preventDefault();
    const updated = { ...customerUser, name: customerAuthForm.name || customerUser.name, address: customerAuthForm.address || customerUser.address };
    setCustomerUser(updated);
    setCustomers(customers.map(c => c.mobile === updated.mobile ? updated : c));
    alert("প্রোফাইল আপডেট হয়েছে!");
  };

  const toggleCustomerFreeze = (mobile) => {
    setCustomers(customers.map(c => c.mobile === mobile ? { ...c, isFrozen: !c.isFrozen } : c));
    if (customerUser && customerUser.mobile === mobile) {
      setCustomerUser(prev => ({ ...prev, isFrozen: !prev.isFrozen }));
    }
  };

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (!newPageForm.title || !newPageForm.content) return alert("পেজের শিরোনাম ও কন্টেন্ট দিন!");
    const newPage = { id: Date.now(), title: newPageForm.title, content: newPageForm.content };
    setCustomPages([...customPages, newPage]);
    setNewPageForm({ title: '', content: '' });
    alert("নতুন পেজ সফলভাবে তৈরি হয়েছে!");
  };

  const deleteCustomPage = (id) => {
    if (window.confirm("পেজটি মুছে ফেলতে চান?")) {
      setCustomPages(customPages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 flex flex-col justify-between">
      <div>
        <header className="bg-white shadow-sm border-b sticky top-0 z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setActiveTab('home'); setActivePageContent(null); }}>
            <span className="text-2xl">🛍️</span>
            <h1 className="text-xl font-bold text-purple-700">{settings.storeName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setActiveTab('profile'); setActivePageContent(null); }} className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-bold">👤 Profile</button>
          </div>
        </header>

          {activePageContent ? (
          <main className="p-4 max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border mt-4 text-xs space-y-3">
            <button onClick={() => setActivePageContent(null)} className="bg-purple-100 text-purple-700 px-3 py-1 rounded font-bold mb-2">← ফিরে যান</button>
            <h2 className="text-lg font-bold text-purple-800 border-b pb-2">{activePageContent.title}</h2>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">{activePageContent.content}</p>
          </main>
        ) : activeTab === 'home' && (
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
            {/* Category Tabs */}
            <div className="px-3 mb-2 flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button key={cat.name} onClick={() => { setSelectedCategory(cat.name); setSelectedSubCategory('All'); }} className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${selectedCategory === cat.name ? 'bg-purple-700 text-white' : 'bg-white text-gray-600 border'}`}>{cat.name}</button>
              ))}
            </div>

            {/* SubCategory Tabs */}
            {selectedCategory !== 'All' && (() => {
              const currentCatObj = categories.find(c => c.name === selectedCategory);
              if (currentCatObj && currentCatObj.subcategories && currentCatObj.subcategories.length > 0) {
                return (
                  <div className="px-3 mb-3 flex gap-1.5 overflow-x-auto pb-1">
                    <button onClick={() => setSelectedSubCategory('All')} className={`px-2.5 py-0.5 rounded-md text-[11px] ${selectedSubCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>All {selectedCategory}</button>
                    {currentCatObj.subcategories.map(sub => (
                      <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-2.5 py-0.5 rounded-md text-[11px] whitespace-nowrap ${selectedSubCategory === sub ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>{sub}</button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}

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
        {/* Product Details Modal */}
        {viewProductDetails && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 text-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-2"><h3 className="font-bold text-sm text-purple-700">{viewProductDetails.name}</h3><button onClick={() => setViewProductDetails(null)} className="text-gray-500 font-bold text-base">✕</button></div>
              <div className="space-y-2">
                <div className="w-full h-56 rounded-xl overflow-hidden border bg-gray-100">
                  <img src={viewProductDetails.images?.[activeImageIndex] || viewProductDetails.images?.[0] || "https://via.placeholder.com/150"} alt="" className="w-full h-full object-cover" />
                </div>
                {viewProductDetails.images && viewProductDetails.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {viewProductDetails.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" onClick={() => setActiveImageIndex(idx)} className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${activeImageIndex === idx ? 'border-purple-600' : 'border-transparent'}`} />
                    ))}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-purple-700">৳ {viewProductDetails.price}</span>
                  {viewProductDetails.regularPrice > viewProductDetails.price && (
                    <span className="text-xs text-gray-400 line-through">৳ {viewProductDetails.regularPrice}</span>
                  )}
                </div>
                <p className="whitespace-pre-line text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border">{viewProductDetails.description}</p>
                <button onClick={() => openOrderModal(viewProductDetails)} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl">Order Now</button>
              </div>
            </div>
          </div>
        )}
        {/* Customer Profile Tab */}
        {activeTab === 'profile' && !activePageContent && (
          <main className="p-4 max-w-md mx-auto text-xs space-y-4">
            {customerUser && !customerUser.isFrozen ? (
              <div className="bg-white p-4 rounded-2xl border space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-sm text-purple-700">👤 আমার প্রোফাইল</h3>
                  <button onClick={() => setCustomerUser(null)} className="bg-red-50 text-red-600 px-2 py-1 rounded">লগআউট</button>
                </div>
                <form onSubmit={handleCustomerProfileUpdate} className="space-y-2">
                  <div><label className="font-bold block mb-1">নাম:</label><input type="text" defaultValue={customerUser.name} onChange={(e) => setCustomerAuthForm({ ...customerAuthForm, name: e.target.value })} className="border p-2 rounded w-full" /></div>
                  <div><label className="font-bold block mb-1">মোবাইল নম্বর:</label><input type="text" disabled value={customerUser.mobile} className="border p-2 rounded w-full bg-gray-100 text-gray-500" /></div>
                  <div><label className="font-bold block mb-1">ঠিকানা:</label><textarea defaultValue={customerUser.address} onChange={(e) => setCustomerAuthForm({ ...customerAuthForm, address: e.target.value })} className="border p-2 rounded w-full" rows="2"></textarea></div>
                  <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded">প্রোফাইল আপডেট করুন</button>
                </form>

                {/* Customer Orders & Notification History */}
                <div className="mt-4 border-t pt-3 space-y-2">
                  <h4 className="font-bold text-gray-700">আমার অর্ডার ও নোটিফিকেশন:</h4>
                  {orders.filter(o => o.customerMobile === customerUser.mobile || o.mobile === customerUser.mobile).length === 0 ? (
                    <p className="text-gray-400 bg-gray-50 p-3 rounded-lg text-center">আপনার কোনো অর্ডার নেই।</p>
                  ) : (
                    orders.filter(o => o.customerMobile === customerUser.mobile || o.mobile === customerUser.mobile).map(ord => (
                      <div key={ord.id} className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-purple-800">{ord.id} ({ord.productName})</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${ord.status === 'Confirmed' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600">অর্ডারের সময়: {ord.orderTime}</p>
                        {ord.confirmedTime && (
                          <p className="text-[11px] text-emerald-700 font-semibold">🔔 নোটিফিকেশন: আপনার অর্ডারটি {ord.confirmedTime} এ কনফার্ম করা হয়েছে!</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border space-y-3">
                <div className="flex justify-center gap-4 border-b pb-2 font-bold">
                  <button onClick={() => setIsCustomerAuthMode('login')} className={isCustomerAuthMode === 'login' ? 'text-purple-700 border-b-2 border-purple-700 pb-1' : 'text-gray-400'}>লগইন</button>
                  <button onClick={() => setIsCustomerAuthMode('register')} className={isCustomerAuthMode === 'register' ? 'text-purple-700 border-b-2 border-purple-700 pb-1' : 'text-gray-400'}>রেজিস্ট্রেশন</button>
                </div>
                <form onSubmit={handleCustomerAuth} className="space-y-2">
                  {isCustomerAuthMode === 'register' && (
                    <div><label className="font-bold block mb-1">নাম:</label><input type="text" required placeholder="আপনার নাম" value={customerAuthForm.name} onChange={(e) => setCustomerAuthForm({ ...customerAuthForm, name: e.target.value })} className="border p-2 rounded w-full" /></div>
                  )}
                  <div><label className="font-bold block mb-1">মোবাইল নম্বর:</label><input type="tel" required placeholder="01XXXXXXXXX" value={customerAuthForm.mobile} onChange={(e) => setCustomerAuthForm({ ...customerAuthForm, mobile: e.target.value })} className="border p-2 rounded w-full" /></div>
                  <div><label className="font-bold block mb-1">পাসওয়ার্ড:</label><input type="password" required placeholder="পাসওয়ার্ড" value={customerAuthForm.password} onChange={(e) => setCustomerAuthForm({ ...customerAuthForm, password: e.target.value })} className="border p-2 rounded w-full" /></div>
                  {isCustomerAuthMode === 'register' && (
                    <div><label className="font-bold block mb-1">ঠিকানা:</label><textarea placeholder="আপনার ঠিকানা" value={customerAuthForm.address} onChange={(e) => setCustomerAuthForm({ ...customerAuthForm, address: e.target.value })} className="border p-2 rounded w-full" rows="2"></textarea></div>
                  )}
                  <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2.5 rounded">{isCustomerAuthMode === 'login' ? 'লগইন করুন' : 'রেজিস্ট্রেশন করুন'}</button>
                </form>
              </div>
            )}
          </main>
        )}
        {/* Admin Tab */}
        {activeTab === 'admin' && !activePageContent && (
          <main className="p-4 max-w-2xl mx-auto text-xs">
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="bg-white p-5 rounded-2xl shadow-md border max-w-sm mx-auto space-y-3">
                <h3 className="font-bold text-center text-sm">Admin Login</h3>
                <input type="text" placeholder="ইউজারনেম (জুয়েল)" value={adminUsernameInput} onChange={(e) => setAdminUsernameInput(e.target.value)} className="w-full border rounded-xl p-2" />
                <input type="password" placeholder="পাসওয়ার্ড (1234)" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border rounded-xl p-2" />
                <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded-xl">লগইন করুন</button>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4 bg-purple-900 text-white p-3 rounded-xl">
                  <h2 className="font-bold">Admin Dashboard</h2>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="bg-purple-800 px-2.5 py-1 rounded">লগআউট</button>
                </div>
                <div className="flex gap-2 mb-4 border-b pb-2 overflow-x-auto">
                  {['dashboard', 'orders', 'products', 'categories', 'customers', 'pages', 'settings'].map(tab => (
                    <button key={tab} onClick={() => setAdminSection(tab)} className={`px-3 py-1 rounded-lg capitalize font-bold whitespace-nowrap ${adminSection === tab ? 'bg-purple-700 text-white' : 'bg-white border'}`}>{tab}</button>
                  ))}
                </div>
                 {adminSection === 'dashboard' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border">মোট অর্ডার: <h3 className="text-lg font-bold">{orders.length}</h3></div>
                    <div className="bg-white p-3 rounded-xl border">মোট বিক্রি: <h3 className="text-lg font-bold text-emerald-600">৳ {orders.reduce((sum, o) => sum + o.totalAmount, 0)}</h3></div>
                  </div>
                )}

                {/* Orders Management */}
                {adminSection === 'orders' && (
                  <div className="space-y-3">
                    {orders.length === 0 ? <p className="text-center bg-white p-4 rounded-xl border text-gray-500">কোনো অর্ডার নেই</p> : (
                      orders.map(ord => (
                        <div key={ord.id} className="bg-white p-3 rounded-xl border space-y-2">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-purple-700">{ord.id}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${ord.status === 'Confirmed' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>{ord.status}</span>
                              {ord.status === 'Pending' && (
                                <button onClick={() => updateOrderStatus(ord.id, 'Confirmed')} className="bg-emerald-600 text-white px-2.5 py-1 rounded font-bold shadow-sm">Confirm</button>
                              )}
                              <button onClick={() => deleteOrder(ord.id)} className="bg-red-50 text-red-600 px-2 py-1 rounded font-bold">ডিলিট</button>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            {ord.productImage && <img src={ord.productImage} alt="" className="w-12 h-12 object-cover rounded border" />}
                            <div>
                              <p><strong>প্রোডাক্ট:</strong> {ord.productName} {ord.color && `(${ord.color})`} ({ord.size}) - পিস: {ord.quantity || 1}</p>
                              <p><strong>কাস্টমার:</strong> {ord.customerName} ({ord.mobile})</p>
                            </div>
                          </div>
                          <p><strong>ঠিকানা:</strong> {ord.address}</p>
                          <p><strong>পেমেন্ট:</strong> {ord.paymentMethod} | TrxID: {ord.trxId}</p>
                          {ord.paymentScreenshot && (
                            <div>
                              <p className="font-semibold text-purple-700">পেমেন্ট স্ক্রিনশট:</p>
                              <img src={ord.paymentScreenshot} alt="Payment Screenshot" className="w-20 h-20 object-cover rounded border mt-1" />
                            </div>
                          )}
                          <p className="text-gray-500 text-[11px]">অর্ডারের সময়: {ord.orderTime}</p>
                          {ord.confirmedTime && <p className="text-emerald-700 text-[11px]">কনফার্মেশনের সময়: {ord.confirmedTime}</p>}
                          <p className="font-bold text-emerald-700">মোট: ৳{ord.totalAmount}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {/* Products & Editing */}
                {adminSection === 'products' && (
                  <div className="space-y-4">
                    <form onSubmit={handleSaveProduct} className="bg-white p-3.5 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1 text-purple-800">{editingProductId ? "✏️ প্রোডাক্ট এডিট করুন" : "➕ নতুন প্রোডাক্ট যুক্ত করুন (পোস্ট করুন)"}</h3>
                      <input type="text" placeholder="প্রোডাক্ট নাম" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="border p-2 rounded w-full" required />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">আগের দাম (Regular Price):</label>
                          <input type="number" placeholder="আগের দাম (৳)" value={productForm.regularPrice} onChange={(e) => setProductForm({ ...productForm, regularPrice: e.target.value })} className="border p-2 rounded w-full" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">অফার দাম (Offer Price):</label>
                          <input type="number" placeholder="অফার দাম (৳)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="border p-2 rounded w-full" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold mb-1">ক্যাটাগরি:</label>
                          <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value, subcategory: '' })} className="w-full border p-2 rounded bg-white">
                            {categories.filter(c => c.name !== 'All').map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">সাব-ক্যাটাগরি:</label>
                          <select value={productForm.subcategory} onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })} className="w-full border p-2 rounded bg-white">
                            <option value="">-- সিলেক্ট করুন --</option>
                            {categories.find(c => c.name === productForm.category)?.subcategories?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-600 mb-1">কালারসমূহ (কমা দিয়ে লিখুন, যেমন: Black, Blue, Red):</label>
                        <input type="text" placeholder="Black, Navy Blue" value={productForm.colorsStr} onChange={(e) => setProductForm({ ...productForm, colorsStr: e.target.value })} className="border p-2 rounded w-full" />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-600 mb-1">প্রোডাক্ট ছবি নির্বাচন করুন:</label>
                        {editingProductId && productForm.images.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {productForm.images.map((img, idx) => (
                              <img key={idx} src={img} alt="" className="w-12 h-12 object-cover rounded border" />
                            ))}
                          </div>
                        )}
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
                            <div>
                              <p className="font-bold line-clamp-1">{p.name}</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-purple-700 font-bold">৳{p.price}</span>
                                {p.regularPrice > p.price && <span className="text-[10px] text-gray-400 line-through">৳{p.regularPrice}</span>}
                              </div>
                           </div>
                          </div>
                          <div
                            className="flex gap-1">
                            <button onClick={() => handleEditProductClick(p)} className="bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded">✏️ Edit</button>
                            <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 font-bold px-2 py-1 rounded">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}Categories Management */}
                {adminSection === 'categories' && (
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl border space-y-3">
                      <h3 className="font-bold border-b pb-1">নতুন ক্যাটাগরি যোগ করুন</h3>
                      <form onSubmit={handleAddCategory} className="flex gap-2">
                        <input type="text" placeholder="ক্যাটাগরি নাম" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="border p-2 rounded flex-1" />
                        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded font-bold">Add Category</button>
                      </form>
                    </div>

                    <div className="bg-white p-3 rounded-xl border space-y-3">
                      <h3 className="font-bold border-b pb-1">নতুন সাব-ক্যাটাগরি যোগ করুন</h3>
                      <form onSubmit={handleAddSubcategory} className="space-y-2">
                        <select value={selectedCatForSub} onChange={(e) => setSelectedCatForSub(e.target.value)} className="w-full border p-2 rounded bg-white">
                          {categories.filter(c => c.name !== 'All').map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                        <div className="flex gap-2">
                          <input type="text" placeholder="সাব-ক্যাটাগরি নাম" value={newSubCatName} onChange={(e) => setNewSubCatName(e.target.value)} className="border p-2 rounded flex-1" />
                          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded font-bold">Add Subcategory</button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-white p-3 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1">ক্যাটাগরি তালিকা</h3>
                      {categories.map(cat => (
                        <div key={cat.name} className="border-b pb-2 mb-2">
                          <div className="flex justify-between items-center font-bold text-purple-700">
                            <span>📂 {cat.name}</span>
                            {cat.name !== 'All' && <button onClick={() => deleteCategory(cat.name)} className="text-red-500 text-[10px]">Delete</button>}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cat.subcategories && cat.subcategories.map(sub => (
                              <span key={sub} className="bg-gray-100 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                                {sub} <button onClick={() => deleteSubcategory(cat.name, sub)} className="text-red-500 font-bold">×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}{/* Customers Management */}
                {adminSection === 'customers' && (
                  <div className="space-y-3">
                    <h3 className="font-bold">কাস্টমার অ্যাকাউন্ট ম্যানেজমেন্ট</h3>
                    {customers.length === 0 ? <p className="bg-white p-4 rounded border text-center text-gray-500">কোনো রেজিস্টার্ড কাস্টমার নেই</p> : (
                      customers.map(cust => (
                        <div key={cust.mobile} className="bg-white p-3 rounded-xl border flex justify-between items-center">
                          <div>
                            <p className="font-bold text-purple-800">নাম: {cust.name}</p>
                            <p className="text-gray-700 font-semibold">মোবাইল: {cust.mobile}</p>
                            <p className="text-gray-600 text-[11px]">ঠিকানা: {cust.address || 'ঠিকানা দেওয়া হয়নি'}</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] inline-block mt-1 ${cust.isFrozen ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {cust.isFrozen ? 'Frozen' : 'Active'}
                            </span>
                          </div>
                          <button onClick={() => toggleCustomerFreeze(cust.mobile)} className={`px-3 py-1.5 rounded font-bold text-white ${cust.isFrozen ? 'bg-emerald-600' : 'bg-red-600'}`}>
                            {cust.isFrozen ? 'Unfreeze' : 'Freeze'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Dynamic Pages Management */}
                {adminSection === 'pages' && (
                  <div className="space-y-4">
                    <form onSubmit={handleCreatePage} className="bg-white p-3.5 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1 text-purple-800">📄 নতুন পেজ তৈরি করুন</h3>
                      <input type="text" placeholder="পেজের শিরোনাম" value={newPageForm.title} onChange={(e) => setNewPageForm({ ...newPageForm, title: e.target.value })} className="border p-2 rounded w-full" required />
                      <textarea placeholder="পেজের বিস্তারিত কন্টেন্ট..." value={newPageForm.content} onChange={(e) => setNewPageForm({ ...newPageForm, content: e.target.value })} className="border p-2 rounded w-full" rows="4" required></textarea>
                      <button type="submit" className="bg-purple-700 text-white font-bold py-2 rounded w-full">পেজ পাবলিশ করুন</button>
                    </form>

                    <div className="bg-white p-3 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1">তৈরি করা পেজসমূহ:</h3>
                      {customPages.length === 0 ? <p className="text-gray-400">কোনো পেজ তৈরি করা হয়নি।</p> : (
                        customPages.map(page => (
                          <div key={page.id} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <p className="font-bold text-purple-700">{page.title}</p>
                              <p className="text-[10px] text-gray-500">ID: {page.id}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { navigator.clipboard.writeText(page.id.toString()); alert("পেজ আইডি কপি হয়েছে!"); }} className="bg-gray-100 px-2 py-1 rounded">আইডি কপি</button>
                              <button onClick={() => deleteCustomPage(page.id)} className="bg-red-50 text-red-600 px-2 py-1 rounded">ডিলিট</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}{/* Settings */}
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
                      <h3 className="font-bold border-b pb-1">ফুটার পলিসি পেজ আইডি সেটআপ</h3>
                      <div><label className="block font-semibold mb-1">ডেলিভারি সিস্টেম পেজ আইডি:</label><input type="text" value={settings.deliveryPolicyUrl} onChange={(e) => setSettings({ ...settings, deliveryPolicyUrl: e.target.value })} className="border rounded p-2 w-full" /></div>
                      <div><label className="block font-semibold mb-1">রিটার্ন পলিসি পেজ আইডি:</label><input type="text" value={settings.returnPolicyUrl} onChange={(e) => setSettings({ ...settings, returnPolicyUrl: e.target.value })} className="border rounded p-2 w-full" /></div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1">ফুটার ও কন্টাক্ট ইনফরমেশন</h3>
                      <div><label className="block font-semibold mb-1">হটলাইন নম্বর (Phone):</label><input type="text" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} className="border rounded p-2 w-full" /></div>
                      <div><label className="block font-semibold mb-1">সাপোর্ট ইমেইল (Email):</label><input type="text" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="border rounded p-2 w-full" /></div>
                      <div><label className="block font-semibold mb-1">ফেসবুক পেজ লিঙ্ক:</label><input type="text" value={settings.facebookUrl} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} className="border rounded p-2 w-full" /></div>
                      <div><label className="block font-semibold mb-1">হোয়াটসঅ্যাপ লিঙ্ক:</label><input type="text" value={settings.whatsappUrl} onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })} className="border rounded p-2 w-full" /></div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border space-y-2">
                      <h3 className="font-bold border-b pb-1">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-2">
                        <input type="password" placeholder="পুরানো পাসওয়ার্ড" value={passForm.oldPass} onChange={(e) => setPassForm({ ...passForm, oldPass: e.target.value })} className="w-full border p-2 rounded" />
                        <input type="password" placeholder="নতুন পাসওয়ার্ড" value={passForm.newPass} onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })} className="w-full border p-2 rounded" />
                        <input type="password" placeholder="কনফার্ম নতুন পাসওয়ার্ড" value={passForm.confirmPass} onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })} className="w-full border p-2 rounded" />
                        <button type="submit" className="w-full bg-purple-700 text-white font-bold py-2 rounded">পাসওয়ার্ড পরিবর্তন করুন</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        )} {/* Order Modal */}
{selectedProduct.images && selectedProduct.images.length > 0 && (
  <div className="mb-2">
    <label className="block font-bold mb-1">ছবি সিলেক্ট করুন:</label>
    <div className="flex gap-2 flex-wrap">
      {selectedProduct.images.map((imgUrl, idx) => {
        const isSelected = (orderForm.productImage || selectedProduct.images[0]) === imgUrl;
        return (
          <div 
            key={idx} 
            onClick={() => setOrderForm({ ...orderForm, productImage: String(imgUrl) })} 
            className={`cursor-pointer border-2 rounded-lg p-1 flex items-center ${isSelected ? 'border-purple-700 bg-purple-50' : 'border-gray-200'}`}
          >
            <img src={imgUrl} alt="" className="w-12 h-12 object-cover rounded" />
          </div>
        );
      })}
    </div>
  </div>
)}

                <div>
                  <label className="block font-bold mb-1">আপনার নাম:</label>
                  <input type="text" placeholder="আপনার নাম লিখুন" value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} className={`w-full border rounded p-2 ${formErrors.name ? 'border-red-500 bg-red-50' : ''}`} />
                </div>
                
                <div>
                  <label className="block font-bold mb-1">মোবাইল নম্বর:</label>
                  <input type="tel" placeholder="01XXXXXXXXX" value={orderForm.mobile} onChange={(e) => setOrderForm({ ...orderForm, mobile: e.target.value })} className={`w-full border rounded p-2 ${formErrors.mobile ? 'border-red-500 bg-red-50' : ''}`} />
                </div>

                <div>
                  <label className="block font-bold mb-1">সম্পূর্ণ ঠিকানা:</label>
                  <textarea placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন..." value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} className={`w-full border rounded p-2 ${formErrors.address ? 'border-red-500 bg-red-50' : ''}`} rows="2"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">সাইজ:</label>
                    <select value={orderForm.size} onChange={(e) => setOrderForm({ ...orderForm, size: e.target.value })} className="w-full border rounded p-2 bg-white">
                      {selectedProduct.sizes?.map((sz, idx) => <option key={idx} value={sz}>{sz}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">পরিমাণ (পিস):</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={orderForm.quantity} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setOrderForm({ ...orderForm, quantity: val === '' ? '' : Math.max(1, Number(val)) });
                      }} 
                      className="w-full border rounded p-2 bg-white" 
                    />
                  </div>
                </div>

                <div
                  className="bg-gray-100 p-2 rounded-xl border text-[11px] font-semibold text-gray-700">
                  📍 ডেলিভারি এলাকা: <span className="text-purple-700 font-bold">{isInsideDhaka ? 'ঢাকার ভেতরে (চার্জ: ৳৬০)' : 'ঢাকার বাইরে (চার্জ: ৳১২০)'}</span>
                </div>

                <div>
                  <label className="block font-bold mb-1">পেমেন্ট পদ্ধতি:</label>
                  <select value={orderForm.paymentMethod} onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })} className="w-full border rounded p-2 bg-white">
                    <option value="COD">ক্যাশ অন ডেলিভারি (COD)</option>
                    <option value="bKash">বিকাশ পার্সোনাল ({settings.bkashNumber})</option>
                    <option value="Nagad">নগদ পার্সোনাল ({settings.nagadNumber})</option>
                  </select>
                </div>
                {(orderForm.paymentMethod === 'bKash' || orderForm.paymentMethod === 'Nagad') && (
                  <div className="bg-purple-50 p-2 rounded-xl border space-y-2">
                    <p className="text-[11px] text-purple-800 font-semibold">টাকা পাঠিয়ে TrxID এবং স্ক্রিনশট দিন:</p>
                    <input type="text" placeholder="TrxID লিখুন" required value={orderForm.trxId} onChange={(e) => setOrderForm({ ...orderForm, trxId: e.target.value })} className="w-full border rounded p-1.5 bg-white" />
                    <input type="file" accept="image/*" required onChange={handleScreenshotUpload} className="w-full bg-white border p-1 rounded" />
                  </div>
                )}

                <div className="border-2 border-dashed border-emerald-500 bg-emerald-50 p-2 rounded-xl text-center font-bold text-emerald-800">
                  সর্বমোট: ৳ {(selectedProduct.price * (Number(orderForm.quantity) || 1)) + deliveryCharge} (ডেলিভারি চার্জসহ)
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-md">অর্ডার কনফার্ম করুন</button>
              </form>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10 text-gray-600 text-[11px]">
          <button onClick={() => { setActiveTab('home'); setActivePageContent(null); }} className={activeTab === 'home' && !activePageContent ? 'text-purple-700 font-bold' : ''}>🛍️ হোম</button>
          <button onClick={() => { setActiveTab('profile'); setActivePageContent(null); }} className={activeTab === 'profile' && !activePageContent ? 'text-purple-700 font-bold' : ''}>👤 প্রোফাইল</button>
        </div>
      </div>

            <footer className="bg-gray-900 text-gray-300 p-6 mt-8 text-xs space-y-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-800 pb-4">
          <div>
            <h4 className="font-bold text-white mb-2 text-sm">যোগাযোগ ও সোশ্যাল মিডিয়া</h4>
            <p>📞 হটলাইন: {settings.contactPhone}</p>
            <p>📧 ইমেইল: {settings.contactEmail}</p>
            <div className="flex gap-3 mt-3 text-lg">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" title="Facebook">📘</a>
              <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" title="WhatsApp">💬</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2 text-sm">নীতিমালা ও পলিসি</h4>
            <div className="space-y-1.5 flex flex-col items-start">
              <button 
                onClick={() => {
                  setActivePageContent({
                    title: "ডেলিভারি সিস্টেম ও চার্জ",
                    content: `আমাদের কাস্টমারদের দ্রুত এবং নিরাপদ হোম ডেলিভারি নিশ্চিত করতে আমরা বিশ্বস্ত কুরিয়ার সার্ভিসের মাধ্যমে সারা বাংলাদেশে পণ্য পৌঁছে দিচ্ছি।\n\n• ডেলিভারি সময়সীমা:\n- ঢাকা সিটির মধ্যে: অর্ডার কনফার্ম করার ১ থেকে ২ কার্যদিবসের মধ্যে।\n- ঢাকা সিটির বাইরে (সারা দেশ): অর্ডার কনফার্ম করার ৩ থেকে ৫ কার্যদিবসের মধ্যে।\n\n• ডেলিভারি চার্জ:\n- ঢাকা সিটি: ৳ ৭০\n- ঢাকা সিটি ও এর আশেপাশের এলাকা: ৳ ১০০\n- সারা বাংলাদেশ (হোম ডেলিভারি): ৳ ১৩০`
                  });
                }} 
                className="text-purple-400 font-semibold hover:underline text-left">
                📦 ডেলিভারি সিস্টেম
              </button>
              <button 
                onClick={() => {
                  setActivePageContent({
                    title: "রিটার্ন ও রিফান্ড পলিসি",
                    content: `আমাদের মূল লক্ষ্য হলো আপনাকে শতভাগ সন্তুষ্ট করা। তবে কোনো কারণে ত্রুটিযুক্ত পণ্য পেলে আমাদের রয়েছে সহজ রিটার্ন সুবিধা।\n\n• শর্তাবলী:\n- পণ্য হাতে পাওয়ার পর সর্বোচ্চ ৩ দিনের মধ্যে জানাতে হবে।\n- পণ্যটি অবশ্যই অব্যবহৃত ও অক্ষত থাকতে হবে।\n\n• রিফান্ড প্রক্রিয়া:\n- পণ্য হাতে পাওয়ার পর ৩ থেকে ৭ কার্যদিবসের মধ্যে আপনার বিকাশ বা ব্যাংক অ্যাকাউন্টে টাকা ফেরত দেওয়া হবে।`
                  });
                }} 
                className="text-purple-400 font-semibold hover:underline text-left">
                🔄 রিটার্ন পলিসি
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500">© {new Date().getFullYear()} {settings.storeName}. সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}

                    
                        
