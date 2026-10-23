import React, { useState } from 'react';

// আপনার হোয়াটসঅ্যাপ নাম্বার (৮৮ সহ দিন)
const WHATSAPP_NUMBER = "8801963590338"; 

const dummyProducts = [
  {
    id: 1,
    name: "🔥 পুরুষদের জন্য এক্সক্লুসিভ প্যাডিং জ্যাকেট 🧥",
    price: 1300,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80",
    description: "উচ্চমানের শীতকালীন জ্যাকেট, খুবই আরামদায়ক ও ট্রেন্ডি design।",
    sizes: ["M", "L", "XL", "Free Size / Standard"]
  },
  {
    id: 2,
    name: "Wireless Bluetooth Smartwatch Ultra",
    price: 1950,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "স্মার্ট ওয়াচ, হেলথ ট্র্যাকিং এবং কলিং সুবিধাসহ।",
    sizes: ["Standard"]
  },
  {
    id: 3,
    name: "Premium Cotton Smart Polo Shirt",
    price: 750,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "১০০% প্রিমিয়াম কটন ফ্যাব্রিক, স্টাইলিশ অ্যান্ড ক্যাজুয়াল লুক।",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Stylish Running Sneaker Shoes",
    price: 1550,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "হালকা এবং টেকসই, প্রতিদিনের ব্যবহারের জন্য পারফেক্ট।",
    sizes: ["39", "40", "41", "42", "43"]
  }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // ফর্ম স্টেট
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [size, setSize] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('outside'); // 'inside' or 'outside'
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const deliveryCharge = deliveryArea === 'inside' ? 60 : 120;
  const totalPrice = selectedProduct ? selectedProduct.price + deliveryCharge : 0;

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size / Standard');
    setDeliveryArea('outside');
    setName('');
    setMobile('');
    setAddress('');
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!name || !mobile || !address) {
      alert("দয়া করে নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন।");
      return;
    }

    const message = `🛍️ *নতুন অর্ডার (OfferFizz BD)* 🛍️\n\n` +
      `📦 *প্রোডাক্ট:* ${selectedProduct.name}\n` +
      `📏 *সাইজ:* ${size}\n` +
      `💰 *প্রোডাক্ট মূল্য:* Tk ${selectedProduct.price}\n` +
      `🚚 *ডেলিভারি চার্জ:* Tk ${deliveryCharge} (${deliveryArea === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})\n` +
      `💵 *সর্বমোট মূল্য:* Tk ${totalPrice}\n\n` +
      `👤 *গ্রাহকের নাম:* ${name}\n` +
      `📞 *মোবাইল নম্বর:* ${mobile}\n` +
      `📍 *ঠিকানা:* ${address}\n` +
      `💳 *পেমেন্ট মেথড:* ${paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : paymentMethod}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-10">
      {/* হেডার */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🛍️</span>
          <h1 className="text-xl font-bold text-purple-700">OfferFizz BD</h1>
        </div>
      </header>

      {/* ব্যানার */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-1">Welcome to OfferFizz BD!</h2>
          <p className="text-sm opacity-90">Buy premium products at the best prices with attractive offers.</p>
        </div>
      </div>

      {/* প্রোডাক্ট সেকশন (মোবাইলে ২ কলম Grid) */}
      <main className="px-3">
        <h3 className="text-lg font-bold mb-3 text-gray-800">All products</h3>
        
        {/* grid-cols-2 দেওয়া হয়েছে যাতে ২ কলমে দেখায় */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {dummyProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
              <div>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-36 sm:h-48 object-cover" 
                />
                <div className="p-2.5">
                  <h4 className="font-semibold text-xs sm:text-sm line-clamp-2 text-gray-800 leading-snug">
                    {product.name}
                  </h4>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-sm sm:text-base font-bold text-purple-700">৳ {product.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-2 pt-0">
                <button
                  onClick={() => openOrderModal(product)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold py-2 px-2 rounded-lg transition text-center"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* অর্ডার ফর্ম পপআপ মডাল (Confirm Order Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 relative my-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* হেডার ও ক্লোজ বাটন */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-extrabold text-emerald-700">Confirm order.</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-3.5 text-xs sm:text-sm">
              
              {/* সিলেক্টেড প্রোডাক্ট দেখানোর বক্স */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Products:</label>
                <div className="bg-gray-100 p-2.5 rounded-lg border font-medium text-gray-800 flex items-center">
                  <span className="line-clamp-1">{selectedProduct.name}</span>
                </div>
              </div>

              {/* নাম */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Your name:</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:outline-emerald-500 bg-white"
                />
              </div>

              {/* নম্বর */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile number:</label>
                <input 
                  type="tel" 
                  required
                  placeholder="01XXXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:outline-emerald-500 bg-white"
                />
              </div>

              {/* ঠিকানা */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full address (home, police station, district):</label>
                <textarea 
                  required
                  rows="2"
                  placeholder="Example: Mirpur, Dhaka or Thana, District..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:outline-emerald-500 bg-white"
                ></textarea>
              </div>

              {/* ডেলিভারি এরিয়া নোটিশ */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg flex items-center space-x-1 font-medium">
                <span>📍</span>
                <span>
                  Delivery area: {deliveryArea === 'inside' ? 'Inside Dhaka (Charge: ৳60)' : 'Outside Dhaka (Charge: ৳120)'}
                </span>
              </div>

              {/* সাইজ সিলেক্ট */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select size:</label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-white focus:outline-emerald-500"
                >
                  {selectedProduct.sizes?.map((sz, idx) => (
                    <option key={idx} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              {/* ডেলিভারি এলাকা নির্বাচন */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select delivery area:</label>
                <select 
                  value={deliveryArea} 
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-white focus:outline-emerald-500"
                >
                  <option value="outside">Outside Dhaka — (charge: ৳120)</option>
                  <option value="inside">Inside Dhaka — (charge: ৳60)</option>
                </select>
              </div>

              {/* পেমেন্ট মেথড */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Payment method:</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-white focus:outline-emerald-500"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>

              {/* সর্বমোট হিসাবের বক্স */}
              <div className="border-2 border-dashed border-emerald-500 bg-emerald-50 p-3 rounded-xl text-center font-bold text-emerald-800 text-sm sm:text-base">
                Product: Tk {selectedProduct.price} + Delivery: Tk {deliveryCharge} =<br/>
                <span className="text-base sm:text-lg text-emerald-900">Total: Tk {totalPrice}</span>
              </div>

              {/* সাবমিট বাটন */}
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-base mt-2"
              >
                Confirm order.
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
