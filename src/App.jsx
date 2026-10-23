HTML

<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#6d28d9">
<title>OfferFizz BD | Shop Smart</title>
<style>
:root {
  --primary: #6d28d9;
  --secondary: #ff5b79;
  --bg: #f7f5fc;
  --text: #211a35;
  --muted: #77718a;
  --white: #fff;
  --radius: 18px;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, "Noto Sans Bengali", sans-serif;
  background: var(--bg);
  color: var(--text);
}
button, input { font: inherit; }
button { cursor: pointer; }
header {
  background: var(--white);
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 2px 15px #27134c0b;
}
.top {
  max-width: 1200px;
  margin: auto;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-between;
}
.logo {
  font-size: 23px;
  font-weight: 900;
  color: var(--primary);
  white-space: nowrap;
}
.logo span { color: var(--secondary); }
.search {
  flex: 1;
  max-width: 470px;
  display: flex;
  background: #f4f1fb;
  border-radius: 30px;
  padding: 5px 12px;
}
.search input {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  padding: 9px;
}
.search button, .primary {
  border: 0;
  background: var(--primary);
  color: white;
  border-radius: 25px;
  padding: 10px 17px;
}
.actions { display: flex; gap: 8px; }
.icon-btn {
  background: #f3edff;
  color: var(--primary);
  border: 0;
  border-radius: 13px;
  padding: 11px;
  font-weight: 700;
}
main {
  max-width: 1200px;
  margin: auto;
  padding: 20px 16px 90px;
}
.hero {
  border-radius: 26px;
  padding: 34px;
  min-height: 270px;
  color: white;
  background: linear-gradient(120deg,#5720c5,#8b5cf6 60%,#ff6585);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
}
.hero h1 {
  font-size: clamp(30px,5vw,52px);
  margin: 10px 0;
  line-height: 1.15;
}
.hero p { line-height: 1.8; max-width: 480px; }
.hero-art {
  font-size: clamp(75px,13vw,145px);
  filter: drop-shadow(0 15px 20px #32116b55);
}
.pill {
  display: inline-block;
  background: #ffffff28;
  padding: 7px 13px;
  border-radius: 30px;
  font-size: 13px;
}
.section { margin-top: 34px; }
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.section h2 { margin: 0; font-size: 22px; }
.muted { color: var(--muted); font-size: 14px; }
.categories {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 3px 0 10px;
}
.cat {
  flex: 0 0 100px;
  border: 1px solid #eee7fa;
  background: white;
  border-radius: 18px;
  padding: 15px 8px;
  text-align: center;
  color: var(--text);
  transition: .2s;
}
.cat:hover, .cat.active {
  border-color: var(--primary);
  transform: translateY(-3px);
  background: #f0e8ff;
}
.cat-icon { display: block; font-size: 29px; margin-bottom: 8px; }
.grid {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 16px;
}
.card {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid #eeeaf5;
  transition: transform .2s, box-shadow .2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px #36205e12;
}
.product-image {
  background: linear-gradient(145deg,#f2eaff,#ffeaf0);
  height: 170px;
  display: grid;
  place-items: center;
  position: relative;
}
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}
.emoji { font-size: 65px; }
.discount {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--secondary);
  color: white;
  font-size: 12px;
  border-radius: 20px;
  padding: 5px 8px;
}
.heart {
  position: absolute;
  right: 10px;
  top: 10px;
  border: 0;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  background: white;
  font-size: 17px;
}
.product-info { padding: 13px; }
.product-info h3 {
  font-size: 15px;
  margin: 0 0 9px;
  min-height: 40px;
}
.rating { color: #e89b12; font-size: 13px; }
.price { font-weight: 800; font-size: 18px; margin-top: 8px; }
.old {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
  font-weight: 400;
  margin-left: 5px;
}
.add {
  width: 100%;
  margin-top: 12px;
  border: 0;
  border-radius: 12px;
  background: #eee6ff;
  color: var(--primary);
  font-weight: 750;
  padding: 10px 5px;
}
.add:hover { background: var(--primary); color: white; }
.promo {
  background: #fff0f3;
  border: 1px solid #ffdae3;
  border-radius: 22px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
.promo h2 { margin: 0 0 8px; }
footer {
  background: #211536;
  color: white;
  padding: 32px 18px;
  text-align: center;
  line-height: 1.9;
}
footer p { color: #d5cce3; }
.bottom-nav {
  display: none;
  position: fixed;
  z-index: 8;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #eee8f5;
  justify-content: space-around;
  padding: 9px 3px calc(9px + env(safe-area-inset-bottom));
}
.bottom-nav button {
  border: 0;
  background: transparent;
  color: #77718a;
  font-size: 12px;
}
.bottom-nav span { display: block; font-size: 21px; margin-bottom: 2px; }
.empty {
  text-align: center;
  padding: 35px;
  color: var(--muted);
  grid-column: 1/-1;
}
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #211536;
  color: white;
  border-radius: 25px;
  padding: 12px 20px;
  z-index: 20;
  display: none;
  box-shadow: 0 8px 25px #0002;
}
.modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 15;
  background: #17102288;
  padding: 18px;
  align-items: center;
  justify-content: center;
}
.modal.show { display: flex; }
.modal-box {
  background: white;
  width: min(460px,100%);
  max-height: 85vh;
  overflow: auto;
  padding: 23px;
  border-radius: 22px;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-head h2 { margin-top: 0; }
.close {
  border: 0;
  background: #f2edfa;
  border-radius: 10px;
  padding: 8px 12px;
}
.cart-line {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}
.cart-line .grow { flex: 1; }
.qty { display: flex; align-items: center; gap: 10px; margin-top: 7px; }
.qty button {
  border: 0;
  border-radius: 7px;
  background: #eee6ff;
  padding: 4px 10px;
}
.total { font-weight: 800; font-size: 20px; margin: 18px 0; }
@media(max-width:850px) {
  .grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .product-image { height: 150px; }
  .top { flex-wrap: wrap; }
  .search { order: 3; flex-basis: 100%; max-width: none; }
}
@media(max-width:560px) {
  .top { gap: 10px; padding: 12px; }
  .logo { font-size: 20px; }
  .actions { gap: 5px; }
  .icon-btn { padding: 9px; }
  main { padding: 14px 12px 100px; }
  .hero { padding: 23px 18px; min-height: 225px; }
  .hero h1 { font-size: 30px; }
  .hero-art { font-size: 65px; }
  .hero p { font-size: 13px; }
  .grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
  .product-image { height: 145px; }
  .product-info { padding: 10px; }
  .product-info h3 { font-size: 14px; }
  .price { font-size: 16px; }
  .section h2 { font-size: 19px; }
  .bottom-nav { display: flex; }
  .promo { padding: 18px; }
}
</style>
</head>
<body>

<header>
  <div class="top">
    <div class="logo">OfferFizz <span>BD</span></div>

    <form class="search" id="searchForm">
      <input id="searchInput" placeholder="আপনার পছন্দের পণ্য খুঁজুন..." />
      <button type="submit">🔎</button>
    </form>

    <div class="actions">
      <button class="icon-btn" onclick="openAccount()">👤</button>
      <button class="icon-btn" onclick="openCart()">🛒 <b id="cartCount">0</b></button>
    </div>
  </div>
</header>

<main>
  <section class="hero">
    <div>
      <span class="pill">✨ আপনার কেনাকাটায় বিশেষ অফার</span>
      <h1>সেরা পণ্য,<br>সেরা দামে!</h1>
      <p>আপনার পছন্দের পণ্য কিনুন সহজে। আকর্ষণীয় অফার ও দারুণ সব কালেকশন এক জায়গায়।</p>
      <button class="primary" onclick="scrollProducts()">এখনই কেনাকাটা করুন →</button>
    </div>
    <div class="hero-art">🛍️</div>
  </section>

  <section class="section">
    <div class="section-head">
      <h2>🧩 ক্যাটাগরি</h2>
      <span class="muted">পছন্দ করুন</span>
    </div>
    <div class="categories" id="categories"></div>
  </section>

  <section class="section" id="sale">
    <div class="promo">
      <div>
        <h2>🔥 দারুণ সব অফার!</h2>
        <div class="muted">ডিসকাউন্টের পণ্যগুলো ঘুরে দেখুন।</div>
      </div>
      <button class="primary" onclick="showOffers()">অফার দেখুন</button>
    </div>
  </section>

  <section class="section" id="productsSection">
    <div class="section-head">
      <div>
        <h2 id="sectionTitle">✨ জনপ্রিয় পণ্য</h2>
        <div class="muted">আপনার পছন্দের কালেকশন</div>
      </div>
      <select id="sort" onchange="renderProducts()"
        style="max-width:135px;padding:9px;border-radius:12px;border:1px solid #e6dff0;background:white">
        <option value="popular">জনপ্রিয়</option>
        <option value="low">কম দাম</option>
        <option value="high">বেশি দাম</option>
        <option value="name">নাম অনুযায়ী</option>
      </select>
    </div>
    <div class="grid" id="productGrid"></div>
  </section>
</main>

<footer>
  <div class="logo" style="color:white">OfferFizz <span>BD</span></div>
  <p>আপনার অনলাইন কেনাকাটার সহজ ঠিকানা।</p>
  <p>যোগাযোগ | শর্তাবলি | প্রাইভেসি পলিসি</p>
  <small>© <span id="year"></span> OfferFizz BD. সর্বস্বত্ব সংরক্ষিত।</small>
</footer>

<nav class="bottom-nav">
  <button onclick="window.scrollTo({top:0,behavior:'smooth'})"><span>🏠</span>হোম</button>
  <button onclick="focusSearch()"><span>🔎</span>সার্চ</button>
  <button onclick="openCart()"><span>🛒</span>কার্ট</button>
  <button onclick="openAccount()"><span>👤</span>অ্যাকাউন্ট</button>
</nav>

<div class="modal" id="modal" onclick="if(event.target===this)closeModal()">
  <div class="modal-box">
    <div class="modal-head">
      <h2 id="modalTitle">আপনার কার্ট</h2>
      <button class="close" onclick="closeModal()">✕</button>
    </div>
    <div id="modalContent"></div>
  </div>
</div>
<div class="toast" id="toast"></div>

<script>
const categories = [
  {name:"সব পণ্য", icon:"✨"},
  {name:"ইলেকট্রনিক্স", icon:"🎧"},
  {name:"ফ্যাশন", icon:"👕"},
  {name:"বিউটি", icon:"💄"},
  {name:"হোম", icon:"🏠"},
  {name:"গ্যাজেটস", icon:"⌚"},
  {name:"অ্যাকসেসরিজ", icon:"🎒"}
];

// এগুলো নমুনা পণ্য। বাস্তব ব্যবহারের আগে নিজের পণ্য যুক্ত করুন।
const products = [
  {id:1,name:"ওয়্যারলেস হেডফোন",category:"ইলেকট্রনিক্স",price:1250,old:1650,emoji:"🎧",rating:4.8,pop:98},
  {id:2,name:"স্মার্ট ওয়াচ",category:"গ্যাজেটস",price:1850,old:2400,emoji:"⌚",rating:4.7,pop:95},
  {id:3,name:"স্টাইলিশ ব্যাকপ্যাক",category:"অ্যাকসেসরিজ",price:950,old:1250,emoji:"🎒",rating:4.6,pop:87},
  {id:4,name:"প্রিমিয়াম সানগ্লাস",category:"ফ্যাশন",price:550,old:750,emoji:"🕶️",rating:4.5,pop:84},
  {id:5,name:"স্কিন কেয়ার সেট",category:"বিউটি",price:780,old:990,emoji:"🧴",rating:4.8,pop:92},
  {id:6,name:"ডেস্ক ল্যাম্প",category:"হোম",price:690,old:890,emoji:"💡",rating:4.4,pop:72},
  {id:7,name:"স্পোর্টস জুতা",category:"ফ্যাশন",price:1450,old:1900,emoji:"👟",rating:4.7,pop:89},
  {id:8,name:"ব্লুটুথ স্পিকার",category:"ইলেকট্রনিক্স",price:1150,old:1490,emoji:"🔊",rating:4.6,pop:91}
];

let activeCategory = "সব পণ্য";
let offersOnly = false;
let cart = {};
let wishlist = new Set();

try {
  cart = JSON.parse(localStorage.getItem("ofb-cart") || "{}");
  wishlist = new Set(JSON.parse(localStorage.getItem("ofb-wishlist") || "[]"));
} catch(e) {
  cart = {};
  wishlist = new Set();
}

const money = n => "৳" + Number(n).toLocaleString("en-BD");
const save = () => {
  localStorage.setItem("ofb-cart",JSON.stringify(cart));
  localStorage.setItem("ofb-wishlist",JSON.stringify([...wishlist]));
};

function renderCategories() {
  document.getElementById("categories").innerHTML = categories.map(c => `
    <button class="cat ${activeCategory===c.name?'active':''}"
      onclick="selectCategory('${c.name}')">
      <span class="cat-icon">${c.icon}</span>${c.name}
    </button>
  `).join("");
}

function selectCategory(name) {
  activeCategory = name;
  offersOnly = false;
  document.getElementById("sectionTitle").textContent =
    name === "সব পণ্য" ? "✨ জনপ্রিয় পণ্য" : name;
  renderCategories();
  renderProducts();
  document.getElementById("productsSection").scrollIntoView({behavior:"smooth"});
}

function renderProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  let list = products.filter(p => {
    const matchCategory = activeCategory==="সব পণ্য" || p.category===activeCategory;
    const matchQuery = (p.name+" "+p.category).toLowerCase().includes(query);
    const matchOffer = !offersOnly || p.old>p.price;
    return matchCategory && matchQuery && matchOffer;
  });

  const sort = document.getElementById("sort").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  if(sort==="popular") list.sort((a,b)=>b.pop-a.pop);

  document.getElementById("productGrid").innerHTML = list.length
    ? list.map(p => `
      <article class="card">
        <div class="product-image">
          <span class="emoji">${p.emoji}</span>
          <span class="discount">${Math.round((1-p.price/p.old)*100)}% OFF</span>
          <button class="heart" aria-label="উইশলিস্ট"
            onclick="toggleWish(${p.id})">${wishlist.has(p.id)?"❤️":"🤍"}</button>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="rating">★ ${p.rating} <span class="muted">(${p.pop}+) </span></div>
          <div class="price">${money(p.price)}
            <span class="old">${money(p.old)}</span>
          </div>
          <button class="add" onclick="addToCart(${p.id})">＋ কার্টে যোগ করুন</button>
        </div>
      </article>
    `).join("")
    : `<div class="empty">😕<p>কোনো পণ্য পাওয়া যায়নি।</p></div>`;
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  save();
  updateCount();
  toast("পণ্য কার্টে যোগ হয়েছে!");
}

function toggleWish(id) {
  wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
  save();
  renderProducts();
  toast(wishlist.has(id) ? "উইশলিস্টে যোগ হয়েছে" : "উইশলিস্ট থেকে সরানো হয়েছে");
}

function updateCount() {
  document.getElementById("cartCount").textContent =
    Object.values(cart).reduce((a,b)=>a+b,0);
}

function openCart() {
  document.getElementById("modalTitle").textContent = "🛒 আপনার শপিং কার্ট";
  const entries = Object.entries(cart).filter(([id,q])=>q>0);
  let subtotal = 0;

  const lines = entries.map(([id,q]) => {
    const p = products.find(x=>x.id===Number(id));
    if(!p) return "";
    subtotal += p.price*q;
    return `<div class="cart-line">
      <div style="font-size:30px">${p.emoji}</div>
      <div class="grow">
        <b>${p.name}</b>
        <div>${money(p.price)} × ${q}</div>
        <div class="qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span>${q}</span>
          <button onclick="changeQty(${p.id},1)">＋</button>
          <button onclick="removeItem(${p.id})">🗑️</button>
        </div>
      </div>
      <b>${money(p.price*q)}</b>
    </div>`;
  }).join("");

  document.getElementById("modalContent").innerHTML = entries.length
    ? `${lines}
      <div class="total">সাবটোটাল: ${money(subtotal)}</div>
      <p class="muted">ডেলিভারি চার্জ ও চূড়ান্ত মূল্য চেকআউটে নিশ্চিত করতে হবে।</p>
      <button class="primary" style="width:100%" onclick="checkout()">চেকআউট করুন →</button>`
    : `<div class="empty">🛒<p>আপনার কার্ট খালি।</p></div>`;

  document.getElementById("modal").classList.add("show");
}

function changeQty(id,delta) {
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id]<=0) delete cart[id];
  save(); updateCount(); openCart();
}
function removeItem(id) {
  delete cart[id];
  save(); updateCount(); openCart();
}
function checkout() {
  document.getElementById("modalTitle").textContent = "চেকআউট";
  document.getElementById("modalContent").innerHTML = `
    <p class="muted">অর্ডার সম্পন্ন করতে আপনার তথ্য দিন।</p>
    <form onsubmit="submitOrder(event)">
      <label>আপনার নাম</label>
      <input required name="name" style="${inputStyle}" placeholder="সম্পূর্ণ নাম">
      <label>মোবাইল নম্বর</label>
      <input required name="phone" inputmode="tel" style="${inputStyle}" placeholder="01XXXXXXXXX">
      <label>সম্পূর্ণ ঠিকানা</label>
      <textarea required name="address" style="${inputStyle}" placeholder="বাড়ি, এলাকা, জেলা"></textarea>
      <button class="primary" style="width:100%;margin-top:15px">অর্ডার নিশ্চিত করুন</button>
    </form>
    <p class="muted">নোট: এই সংস্করণে অর্ডার সার্ভারে পাঠানো হয় না।</p>`;
}

const inputStyle = "display:block;width:100%;padding:12px;margin:7px 0 14px;border:1px solid #ddd5eb;border-radius:10px;background:white;color:#211a35";

function submitOrder(e) {
  e.preventDefault();
  toast("ডেমো: বাস্তব অর্ডারের জন্য ব্যাকএন্ড সংযোগ প্রয়োজন।");
}

function openAccount() {
  document.getElementById("modalTitle").textContent = "👤 আমার অ্যাকাউন্ট";
  document.getElementById("modalContent").innerHTML = `
    <p>OfferFizz BD-তে স্বাগতম!</p>
    <p class="muted">বাস্তব লগইন ও রেজিস্ট্রেশনের জন্য Firebase Authentication যুক্ত করতে হবে।</p>
    <button class="primary" style="width:100%" onclick="toast('Firebase Auth এখনো সংযুক্ত নয়')">লগইন / সাইন আপ</button>
    <hr>
    <button class="add" onclick="showWishlist()">🤍 আমার উইশলিস্ট (${wishlist.size})</button>`;
  document.getElementById("modal").classList.add("show");
}
function showWishlist() {
  document.getElementById("modalTitle").textContent = "🤍 আমার উইশলিস্ট";
  const items = products.filter(p=>wishlist.has(p.id));
  document.getElementById("modalContent").innerHTML = items.length
    ? items.map(p=>`<p>${p.emoji} ${p.name} — ${money(p.price)}</p>`).join("")
    : "<p>আপনার উইশলিস্ট এখন খালি।</p>";
}
function showOffers() {
  activeCategory = "সব পণ্য";
  offersOnly = true;
  document.getElementById("sectionTitle").textContent = "🔥 বিশেষ অফার";
  renderCategories(); renderProducts();
  document.getElementById("productsSection").scrollIntoView({behavior:"smooth"});
}
function scrollProducts() {
  document.getElementById("productsSection").scrollIntoView({behavior:"smooth"});
}
function focusSearch() {
  document.getElementById("searchInput").focus();
  window.scrollTo({top:0,behavior:"smooth"});
}
function closeModal() {
  document.getElementById("modal").classList.remove("show");
}
let toastTimer;
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.style.display="none",2200);
}
document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  renderProducts();
  document.getElementById("productsSection").scrollIntoView({behavior:"smooth"});
});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("year").textContent = new Date().getFullYear();
renderCategories();
renderProducts();
updateCount();
</script>
</body>
</html>
  
