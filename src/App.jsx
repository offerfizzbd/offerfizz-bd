import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, ShieldCheck } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Cotton Smart Polo Shirt',
    price: 850,
    oldPrice: 1050,
    colors: [
      { name: 'Red', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500' },
      { name: 'Black', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500' }
    ]
  },
  {
    id: 'p2',
    name: 'Wireless Bluetooth Smartwatch Ultra',
    price: 1950,
    oldPrice: 2500,
    colors: [
      { name: 'Black', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }
    ]
  }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleOrder = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]?.name || '');
    setActiveImage(product.colors[0]?.image || '');
  };

  const submitOrder = (e) => {
    e.preventDefault();
    alert('ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      <header className="bg-white border-b sticky top-0 z-40 p-4 shadow-sm flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-purple-600" />
          <span className="text-xl font-bold text-purple-700">OfferFizz BD</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-1">OfferFizz BD-তে স্বাগতম!</h1>
          <p className="text-sm opacity-90">সেরা মূল্যে প্রিমিয়াম প্রোডাক্ট কিনুন আকর্ষণীয় অফারে।</p>
        </div>

        <h2 className="text-xl font-bold mb-4">সকল প্রোডাক্ট</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border p-4 shadow-sm">
              <img src={product.colors[0]?.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
              <h3 className="font-bold text-lg">{product.name}</h3>
              <div className="text-red-600 font-bold my-2">৳{product.price} <span className="line-through text-gray-400 text-xs">৳{product.oldPrice}</span></div>
              <button onClick={() => handleOrder(product)} className="w-full bg-yellow-400 font-bold py-2 rounded-lg flex justify-center items-center gap-2">
                <ShoppingCart size={18} /> এখনই অর্ডার করুন
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-4 font-bold text-xl">✕</button>
            <h3 className="text-lg font-bold mb-4 text-center">অর্ডার তথ্য দিন</h3>

            <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg mb-4">
              <img src={activeImage} alt="" className="w-16 h-16 object-cover rounded" />
              <div>
                <div className="font-bold text-sm">{selectedProduct.name}</div>
                <div className="text-red-600 font-bold text-sm">৳{selectedProduct.price}</div>
              </div>
            </div>

            <form onSubmit={submitOrder} className="space-y-3">
              <input required type="text" placeholder="আপনার নাম" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              <input required type="tel" placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              <textarea required placeholder="পূর্ণাঙ্গ ঠিকানা" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded-lg text-sm h-16"></textarea>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg text-sm">অর্ডার কনফার্ম করুন</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
