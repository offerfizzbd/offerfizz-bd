import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ফাইলের ইনিশিয়াল কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyAbQA6p1qZwHYEZGiwrRXlw51UrWa3I",
  authDomain: "offerfizz-bd.firebaseapp.com",
  projectId: "offerfizz-bd",
  storageBucket: "offerfizz-bd.appspot.com",
  messagingSenderId: "52069924104",
  appId: "1:52069924104:web:66243c62fcbcao2ec9ddbd",
  measurementId: "G-8N57RNZ9Q5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const INITIAL_PRODUCTS = [];

const INITIAL_SETTINGS = {
  storeName: "Offerfizz BDI",
  bannerTitle: "স্বাগতম তো অফারফিজ BDI.",
  bannerSubtitle: "কম দামে সেরা অফারে ডিজিটাল প্রোডাক্ট কিনুন।",
  bannerImage: "",
  bkashNumber: "01963590338",
  nagadNumber: "01963590338",
  contactPhone: "01963590338",
  contactEmail: "support@offerfizzbd.com",
  facebookUrl: "https://facebook.com",
  whatsappurl: "https://wa.me/8801963590338",
  superAdminPass: "1234",
  deliveryPolicyUrl: "",
  returnPolicyUrl: ""
};

const INITIAL_CATEGORIES = [
  { name: 'All', subcategories: [] },
  { name: 'Gadgets', subcategories: ['Mobile Accessories', 'Smartwatch'] },
  { name: 'Electronics', subcategories: ['Home Appliance'] },
  { name: 'Beauty', subcategories: ['Skincare'] }
];

export default function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('offerfizz_products')) || INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('offerfizz_orders')) || []);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('offerfizz_settings')) || INITIAL_SETTINGS);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('offerfizz_categories')) || INITIAL_CATEGORIES);
  const [customPages, setCustomPages] = useState(() => JSON.parse(localStorage.getItem('offerfizz_customPages')) || []);

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProductDetails, setViewProductDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorForOrder, setSelectedColorForOrder] = useState('');

  const [customerUser, setCustomerUser] = useState(() => JSON.parse(localStorage.getItem('offerfizz_customer_logged')) || null);
  const [customerAuthForm, setCustomerAuthForm] = useState({ name: '', mobile: '', password: '' });
  const [isCustomerAuthMode, setIsCustomerAuthMode] = useState('login');

  const [orderForm, setOrderForm] = useState({
    name: '', mobile: '', address: '', size: '', color: '',
    paymentMethod: 'COD', trxid: '', paymentScreenshot: null
  });
  const [formErrors, setFormErrors] = useState({});

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const newOrder = {
        product: selectedProduct.name,
        price: selectedProduct.price,
        ...orderForm,
        date: new Date().toISOString(),
        status: 'Pending'
      };
      
      await addDoc(collection(db, "orders"), newOrder);
      alert('অর্ডার সফলভাবে সাবমিট হয়েছে!');
      setSelectedProduct(null);
      setOrderForm({ name: '', mobile: '', address: '', size: '', color: '', paymentMethod: 'COD', trxid: '', paymentScreenshot: null });
    } catch (err) {
      console.error("Error saving order to Firestore:", err);
      alert('অর্ডার সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <header className="bg-white sticky top-0 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-lg text-purple-700">{settings.storeName}</h1>
        <div className="space-x-2">
          <button onClick={() => setActiveTab('home')} className={`px-3 py-1 rounded ${activeTab === 'home' ? 'bg-purple-700 text-white' : 'bg-gray-100'}`}>Home</button>
          <button onClick={() => setActiveTab('profile')} className={`px-3 py-1 rounded ${activeTab === 'profile' ? 'bg-purple-700 text-white' : 'bg-gray-100'}`}>Profile</button>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto w-full space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold">{settings.bannerTitle}</h2>
          <p className="text-sm mt-1">{settings.bannerSubtitle}</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-3 rounded-xl shadow border flex flex-col justify-between">
              <div>
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                <p className="text-purple-700 font-bold text-sm">৳ {product.price}</p>
              </div>
              <button 
                onClick={() => setSelectedProduct(product)} 
                className="mt-2 w-full bg-purple-700 text-white text-xs py-1.5 rounded-lg font-bold"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer & Bottom Navigation */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-4">
            <h3 className="font-bold text-lg text-purple-400">{settings.storeName}</h3>
            <div className="flex space-x-4 mt-2 md:mt-0 text-sm">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400">Facebook</a>
              <a href={settings.whatsappurl} target="_blank" rel="noreferrer" className="hover:text-purple-400">WhatsApp</a>
              <span className="cursor-pointer hover:text-purple-400" onClick={() => setActiveTab('home')}>Home</span>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400">
            <p className="text-purple-400 font-semibold mb-1">যোগাযোগ ও হেল্পলাইন</p>
            <p>মোবাইল: {settings.contactPhone} | ইমেইল: {settings.contactEmail}</p>
            <p className="mt-2">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 space-y-3 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between font-bold border-b pb-2">
              <h3 className="text-purple-800">Confirm order.</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-red-500">✕</button>
            </div>

            {/* প্রোডাক্টের ছবি */}
            {selectedProduct?.images?.[0] && (
              <div className="flex justify-center my-2">
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name} 
                  className="w-24 h-24 object-cover rounded-lg border shadow-sm" 
                />
              </div>
            )}

            <form onSubmit={handleConfirmOrder} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Product:</label>
                <p className="bg-gray-100 p-2 rounded">{selectedProduct.name}</p>
              </div>

              <div>
                <label className="block font-bold mb-1">Your name:</label>
                <input 
                  type="text" 
                  placeholder="আপনার নাম লিখুন" 
                  value={orderForm.name} 
                  onChange={(e) => setOrderForm({...orderForm, name: e.target.value})} 
                  className="w-full border p-2 rounded"
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Mobile number:</label>
                <input 
                  type="tel" 
                  placeholder="01XXXXXXXXX" 
                  value={orderForm.mobile} 
                  onChange={(e) => setOrderForm({...orderForm, mobile: e.target.value})} 
                  className="w-full border p-2 rounded"
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Full address:</label>
                <textarea 
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন..." 
                  value={orderForm.address} 
                  onChange={(e) => setOrderForm({...orderForm, address: e.target.value})} 
                  className="w-full border p-2 rounded"
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg">
                Confirm order.
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
