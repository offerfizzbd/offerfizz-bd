import React, { useState } from 'react';
import { 
  ShoppingBag, Search, User, ShoppingCart, ShieldCheck, 
  Upload, CheckCircle, XCircle, Clock, Trash2, Edit3, Plus, ArrowRight, Eye, Phone 
} from 'lucide-react';

// Sample Product Data with Variants & Specific Images
const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Cotton Smart Polo Shirt',
    category: 'Fashion',
    price: 1050,
    discountPrice: 850,
    description: '100% Export quality premium cotton polo shirt with elegant finish.',
    colors: [
      { name: 'Red', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500' },
      { name: 'Black', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500' },
      { name: 'Navy Blue', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500' }
    ],
    sizes: ['M', 'L', 'XL'],
    featured: true
  },
  {
    id: 'p2',
    name: 'Wireless Bluetooth Smartwatch Ultra',
    category: 'Gadgets',
    price: 2500,
    discountPrice: 1950,
    description: 'HD Display, Heart Rate Sensor, Long Battery Life with IP68 Waterproof.',
    colors: [
      { name: 'Black', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
      { name: 'Silver', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500' }
    ],
    sizes: ['Standard'],
    featured: true
  }
];

export default function App() {
  const [view, setView] = useState('home'); // home, admin
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  
  // Selected Product Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState('');
  
  // Checkout & Payment Form State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, bkash, nagad
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', area: '60' });
  const [paymentDetails, setPaymentDetails] = useState({ trxId: '', screenshot: null, screenshotPreview: '' });
  
  // Admin Authentication State
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Handle Color Selection (Updates Image Immediately)
  const handleColorSelect = (colorObj) => {
    setSelectedColor(colorObj.name);
    setActiveImage(colorObj.image);
  };

  // Open Order Modal for a Product
  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]?.name || '');
    setActiveImage(product.colors[0]?.image || '');
    setSelectedSize(product.sizes[0] || '');
    setIsCheckoutOpen(true);
  };

  // Handle Screenshot Upload Preview
  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentDetails({
          ...paymentDetails,
          screenshot: file,
          screenshotPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Order Logic
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!selectedColor) {
      alert('অনুগ্রহ করে একটি কালার সিলেক্ট করুন!');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!paymentDetails.trxId || !paymentDetails.screenshotPreview)) {
      alert('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) এবং পেমেন্টের স্ক্রিনশট আপলোড করুন!');
      return;
    }

    const deliveryCharge = parseFloat(customerInfo.area);
    const itemPrice = selectedProduct.discountPrice || selectedProduct.price;
    const grandTotal = itemPrice + deliveryCharge;

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString(),
      productName: selectedProduct.name,
      color: selectedColor,
      size: selectedSize,
      productImage: activeImage,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      paymentMethod: paymentMethod.toUpperCase(),
      trxId: paymentDetails.trxId || 'N/A',
      screenshot: paymentDetails.screenshotPreview || null,
      totalAmount: grandTotal,
      status: paymentMethod === 'cod' ? 'Confirmed' : 'Pending Payment Verification'
    };

    setOrders([newOrder, ...orders]);
    alert(paymentMethod === 'cod' ? 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!' : 'আপনার এডভান্স পেমেন্টের তথ্য জমা হয়েছে। অ্যাডমিন ভেরিফাই করার পর অর্ডার কনফার্ম হবে।');
    
    // Reset Modal
    setIsCheckoutOpen(false);
    setPaymentDetails({ trxId: '', screenshot: null, screenshotPreview: '' });
    setCustomerInfo({ name: '', phone: '', address: '', area: '60' });
  };

  // Admin Order Status Update
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-purple-600 text-white p-2 rounded-lg"><ShoppingBag size={22} /></div>
            <span className="text-xl font-black tracking-tight text-purple-700">OfferFizz BD</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${view === 'home' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}>
              ওয়েবসাইট
            </button>
            <button onClick={() => setView('admin')} className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-1 ${view === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <ShieldCheck size={16} /> অ্যাডমিন প্যানেল
            </button>
          </div>
        </div>
      </header>

      {/* CUSTOMER WEBSITE VIEW */}
      {view === 'home' && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-2xl p-6 md:p-10 mb-8 shadow-lg">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2">OfferFizz BD-তে আপনাকে স্বাগতম!</h1>
            <p className="text-purple-100 mb-4 text-sm md:text-base">সেরা মূল্যে প্রিমিয়াম কোয়ালিটি অলটারনেটিভ প্রোডাক্ট কিনুন আকর্ষণীয় অফারে।</p>
            <span className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-1.5 rounded-full text-xs md:text-sm">দ্রুততম হোম ডেলিভারি 🚚</span>
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-900 border-l-4 border-purple-600 pl-3">সকল প্রোডাক্ট</h2>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <img src={product.colors[0]?.image} alt={product.name} className="w-full h-52 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-black text-red-600">৳{product.discountPrice || product.price}</span>
                    {product.discountPrice && <span className="text-xs text-gray-400 line-through">৳{product.price}</span>}
                  </div>
                  <button 
                    onClick={() => openOrderModal(product)} 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> এখনই অর্ডার করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ORDER / CHECKOUT MODAL */}
      {isCheckoutOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            <h3 className="text-lg font-bold text-center border-b pb-3 mb-4">অর্ডার নিশ্চিত করুন</h3>

            {/* Selected Product Preview */}
            <div className="flex items-center gap-4 bg-purple-50 p-3 rounded-xl mb-4 border border-purple-100">
              <img src={activeImage} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded-lg border bg-white" />
              <div>
                <h4 className="font-bold text-sm text-gray-900">{selectedProduct.name}</h4>
                <p className="text-xs text-purple-700 font-semibold mt-0.5">সিলেক্ট করা পিকচার লকড 🔒</p>
                <div className="text-sm font-black text-red-600 mt-1">৳{selectedProduct.discountPrice || selectedProduct.price}</div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-2">১. কালার সিলেক্ট করুন (বাধ্যতামূলক):</label>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleColorSelect(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedColor === c.name ? 'border-purple-600 bg-purple-600 text-white shadow-sm' : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block border"></span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম:</label>
                <input required type="text" placeholder="পুরো নাম লিখুন" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-purple-600" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর:</label>
                <input required type="tel" placeholder="01XXXXXXXXX" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-purple-600" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা (বাসা, থানা, জেলা):</label>
                <textarea required placeholder="ঠিকানা লিখুন..." value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-purple-600 h-16"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ডেলিভারি এলাকা:</label>
                <select value={customerInfo.area} onChange={e => setCustomerInfo({...customerInfo, area: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-purple-600 bg-white">
                  <option value="60">ঢাকার ভেতরে (চার্জ: ৳৬০)</option>
                  <option value="120">ঢাকার বাইরে (চার্জ: ৳১২০)</option>
                </select>
              </div>

              {/* Payment Method Option */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-2">২. পেমেন্ট মেথড নির্বাচন করুন:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['cod', 'bkash', 'nagad'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 text-xs font-bold rounded-lg border uppercase ${paymentMethod === method ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* ADVANCED PAYMENT PROOF SECTION */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="bg-pink-50 border border-pink-200 p-3.5 rounded-xl space-y-3 mt-2">
                  <div className="text-xs text-pink-900 font-medium">
                    অনুগ্রহ করে আমাদের <strong className="uppercase">{paymentMethod}</strong> নম্বর (<strong>01963-590338</strong>)-এ সেন্ড মানি বা পেমেন্ট করে নিচের তথ্যগুলো পূরণ করুন।
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Transaction ID (TrxID):</label>
                    <input required type="text" placeholder="যেমন: 9J87X10KL" value={paymentDetails.trxId} onChange={e => setPaymentDetails({...paymentDetails, trxId: e.target.value})} className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">পেমেন্ট স্ক্রিনশট আপলোড করুন:</label>
                    <input required type="file" accept="image/*" onChange={handleScreenshotUpload} className="w-full text-xs text-gray-500 bg-white p-1 rounded-lg border" />
                    {paymentDetails.screenshotPreview && (
                      <img src={paymentDetails.screenshotPreview} alt="Proof" className="w-20 h-20 object-cover mt-2 rounded border" />
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-100 p-3 rounded-xl text-center font-bold text-sm text-gray-800 my-2">
                সর্বমোট প্রদেয়: ৳{(selectedProduct.discountPrice || selectedProduct.price) + parseFloat(customerInfo.area)}
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition">
                অর্ডার নিশ্চিত করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PANEL VIEW */}
      {view === 'admin' && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          {!adminAuth ? (
            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-md text-center mt-10">
              <ShieldCheck size={48} className="mx-auto text-purple-600 mb-3" />
              <h2 className="text-lg font-bold mb-4">অ্যাডমিন প্যানেল লগইন</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (adminPasswordInput === 'Jewel@338') setAdminAuth(true);
                else alert('ভুল পাসওয়ার্ড!');
              }}>
                <input 
                  type="password" 
                  placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন" 
                  value={adminPasswordInput} 
                  onChange={e => setAdminPasswordInput(e.target.value)} 
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-4 outline-none focus:border-purple-600"
                />
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg text-sm">
                  লগইন করুন
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h2>
                <button onClick={() => setAdminAuth(false)} className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg">লগআউট</button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 border-b font-bold text-sm text-gray-700">কাস্টমার অর্ডার ও পেমেন্ট ভেরিফিকেশন লিস্ট</div>
                
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">এখনো কোনো অর্ডার আসেনি।</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-600 uppercase border-b">
                        <tr>
                          <th className="p-3">অর্ডার তথ্য</th>
                          <th className="p-3">প্রোডাক্ট ও সিলেক্টেড ছবি</th>
                          <th className="p-3">কাস্টমার এড্রেস</th>
                          <th className="p-3">পেমেন্ট মেথড & TrxID</th>
                          <th className="p-3">পেমেন্ট স্ক্রিনশট (প্রুফ)</th>
                          <th className="p-3">স্ট্যাটাস</th>
                          <th className="p-3">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-bold text-purple-700">{order.id}</div>
                              <div className="text-gray-400">{order.date}</div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <img src={order.productImage} alt="Selected Color" className="w-12 h-12 object-cover rounded border" />
                                <div>
                                  <div className="font-bold text-gray-800">{order.productName}</div>
                                  <div className="text-gray-500">কালার: <span className="font-bold text-gray-700">{order.color}</span></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold">{order.customerName}</div>
                              <div>{order.customerPhone}</div>
                              <div className="text-gray-500 max-w-xs">{order.customerAddress}</div>
                            </td>
                            <td className="p-3">
                              <span className="font-bold uppercase text-gray-800">{order.paymentMethod}</span>
                              <div className="text-gray-500">TrxID: {order.tr
