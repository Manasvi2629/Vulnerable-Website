
// =========================================================
// DATA STORE
// =========================================================
const DB = {
  users: [
    {id:1,name:'Admin User',username:'admin',email:'admin@shopnest.com',role:'admin',password:'admin123',phone:'9876543210',address:'123 MG Road, Bangalore'},
    {id:2,name:'Rahul Sharma',username:'rahul',email:'rahul@gmail.com',role:'user',password:'rahul123',phone:'9123456789',address:'45 Park St, Mumbai'},
    {id:3,name:'Priya Singh',username:'priya',email:'priya@gmail.com',role:'user',password:'priya@123',phone:'9234567890',address:'78 Anna Nagar, Chennai'},
    {id:4,name:'Amit Kumar',username:'amit',email:'amit@yahoo.com',role:'user',password:'amit1234',phone:'9345678901',address:'12 Sector 18, Noida'},
    {id:5,name:'Sneha Patel',username:'sneha',email:'sneha@gmail.com',role:'user',password:'sneha2024',phone:'9456789012',address:'67 CG Road, Ahmedabad'},
  ],
  products: [
    {id:1,name:'Sony WH-1000XM5 Headphones',brand:'Sony',price:24999,oldPrice:31990,emoji:'🎧',category:'electronics',rating:4.8,reviews:1247,badge:'Best Seller'},
    {id:2,name:'Apple Watch Series 9 (45mm)',brand:'Apple',price:44900,oldPrice:49900,emoji:'⌚',category:'electronics',rating:4.9,reviews:836,badge:'New'},
    {id:3,name:'Samsung Galaxy Tab S9',brand:'Samsung',price:64999,oldPrice:72999,emoji:'📱',category:'electronics',rating:4.7,reviews:624,badge:'Sale'},
    {id:4,name:'Nike Air Max 270',brand:'Nike',price:8995,oldPrice:11995,emoji:'👟',category:'fashion',rating:4.6,reviews:2341,badge:'Sale'},
    {id:5,name:'Levi\'s 511 Slim Fit Jeans',brand:'Levi\'s',price:2999,oldPrice:3999,emoji:'👖',category:'fashion',rating:4.5,reviews:1832,badge:''},
    {id:6,name:'Prestige Electric Kettle',brand:'Prestige',price:1299,oldPrice:1799,emoji:'🫖',category:'home',rating:4.4,reviews:542,badge:''},
    {id:7,name:'Bose SoundLink Mini II',brand:'Bose',price:11900,oldPrice:14900,emoji:'🔊',category:'electronics',rating:4.7,reviews:983,badge:''},
    {id:8,name:'Fossil Gen 6 Smartwatch',brand:'Fossil',price:18995,oldPrice:23995,emoji:'⌚',category:'accessories',rating:4.5,reviews:421,badge:'Sale'},
    {id:9,name:'Lakme Absolute Skin Natural Mousse',brand:'Lakme',price:449,oldPrice:599,emoji:'💄',category:'beauty',rating:4.3,reviews:2134,badge:''},
    {id:10,name:'Yoga Mat Premium 6mm',brand:'Boldfit',price:699,oldPrice:999,emoji:'🧘',category:'sports',rating:4.4,reviews:1543,badge:''},
    {id:11,name:'OnePlus Nord CE 3 Lite',brand:'OnePlus',price:19999,oldPrice:24999,emoji:'📲',category:'electronics',rating:4.6,reviews:3421,badge:'Hot'},
    {id:12,name:'Wildcraft Laptop Backpack 30L',brand:'Wildcraft',price:1799,oldPrice:2499,emoji:'🎒',category:'accessories',rating:4.5,reviews:876,badge:''},
  ],
  reviews: {
    1: [{name:'Karthik R',text:'Absolutely brilliant sound quality. The ANC is the best I\'ve experienced. Worth every rupee!',stars:5,date:'2 days ago'},{name:'Meera N',text:'Comfortable to wear for long hours. Battery life is excellent. Highly recommended.',stars:5,date:'1 week ago'}],
    2: [{name:'Vikram S',text:'Best smartwatch on the market. The display is stunning and battery lasts all day.',stars:5,date:'3 days ago'}],
    4: [{name:'Raju M',text:'Great shoes, very comfortable. Perfect for daily walks and light jogging.',stars:4,date:'5 days ago'}],
  },
  orders: [],
  nextUserId: 6,
};

let currentUser = null;
let cart = [];
let currentProductId = null;
let resetTokens = {}; // username -> token

// =========================================================
// NAVIGATION
// =========================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  window.scrollTo(0,0);
  if(name==='home') { renderHomeProducts(); }
  if(name==='shop') { renderShopProducts(); }
  if(name==='deals') { renderDealsProducts(); }
  if(name==='cart') { renderCart(); }
  if(name==='account') { if(!currentUser){showPage('login');return;} renderAccount(); }
  if(name==='admin') { renderAdminTable(); }
  if(name==='checkout') { document.getElementById('order-total').value = getCartTotal(); }
}

function toggleAccount() {
  if(!currentUser) showPage('login');
  else showPage('account');
}

// =========================================================
// PRODUCTS
// =========================================================
function productCard(p, onclick) {
  return `<div class="product-card" onclick="${onclick}">
    <div class="product-thumb">
      <div style="font-size:64px">${p.emoji}</div>
      ${p.badge ? `<div class="product-badge ${p.badge==='Sale'?'sale':''}">${p.badge}</div>` : ''}
    </div>
    <div class="product-info">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
        <span class="rating-count">(${p.reviews.toLocaleString()})</span>
      </div>
      <div class="product-price">
        <span class="price-current">₹${p.price.toLocaleString()}</span>
        ${p.oldPrice ? `<span class="price-old">₹${p.oldPrice.toLocaleString()}</span>` : ''}
      </div>
      <button class="product-card-btn" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>
    </div>
  </div>`;
}

function renderHomeProducts() {
  document.getElementById('home-products').innerHTML = DB.products.slice(0,4).map(p => productCard(p, `viewProduct(${p.id})`)).join('');
  document.getElementById('bestseller-products').innerHTML = DB.products.slice(4,8).map(p => productCard(p, `viewProduct(${p.id})`)).join('');
}
function renderShopProducts() {
  document.getElementById('shop-products').innerHTML = DB.products.map(p => productCard(p, `viewProduct(${p.id})`)).join('');
}
function renderDealsProducts() {
  const deals = DB.products.filter(p => p.badge==='Sale' || p.oldPrice);
  document.getElementById('deals-products').innerHTML = deals.map(p => productCard(p, `viewProduct(${p.id})`)).join('');
}

function viewProduct(id) {
  currentProductId = id;
  const p = DB.products.find(x=>x.id===id);
  document.getElementById('product-detail-content').innerHTML = `
    <div class="product-detail-img">${p.emoji}</div>
    <div class="product-detail-info">
      <div class="brand">${p.brand}</div>
      <h1>${p.name}</h1>
      <div class="product-rating" style="margin-bottom:16px">
        <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</span>
        <span style="color:var(--text2);font-size:14px">${p.rating} · ${p.reviews.toLocaleString()} reviews</span>
      </div>
      <div class="product-detail-price">₹${p.price.toLocaleString()} ${p.oldPrice?`<span style="font-size:16px;color:var(--text3);text-decoration:line-through;font-weight:400;margin-left:8px">₹${p.oldPrice.toLocaleString()}</span>`:''}
      </div>
      <div class="product-detail-desc">Premium quality ${p.name} by ${p.brand}. Experience the best in class performance and design. Free shipping on this item. 30-day easy returns.</div>
      <!-- VULNERABLE: hidden price field — tamper via DevTools -->
      <form onsubmit="addToCartFromDetail(event,${p.id})">
        <input type="hidden" name="price" id="detail-price-${p.id}" value="${p.price}">
        <div class="qty-wrap">
          <label>Quantity</label>
          <input type="number" class="qty-input" id="qty-${p.id}" value="1" min="1" max="99">
        </div>
        <div style="display:flex;gap:12px">
          <button type="submit" class="add-cart-btn" style="flex:2">Add to Cart</button>
          <button type="button" class="btn-outline" style="flex:1;padding:14px" onclick="addToCart(${p.id});showPage('cart')">Buy Now</button>
        </div>
      </form>
    </div>`;
  renderReviews(id);
  showPage('product');
}

function addToCartFromDetail(e, id) {
  e.preventDefault();
  const price = parseInt(e.target.price.value); // reads tampered value
  const qty = parseInt(document.getElementById('qty-'+id).value)||1;
  const p = DB.products.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty+=qty; else cart.push({...p,price,qty});
  updateCartBadge();
  showMsg('checkout-msg','info',`${p.name} added to cart!`);
}

function addToCart(id) {
  const p = DB.products.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++; else cart.push({...p,qty:1});
  updateCartBadge();
}
function updateCartBadge() {
  document.getElementById('cart-count').textContent = cart.reduce((s,c)=>s+c.qty,0);
}
function getCartTotal() { return cart.reduce((s,c)=>s+(c.price*c.qty),0); }

function renderCart() {
  const items = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if(!cart.length){
    items.innerHTML = `<div class="empty-state"><div class="icon">🛒</div><p>Your cart is empty</p></div>`;
    summary.innerHTML=''; return;
  }
  items.innerHTML = cart.map((c,i)=>`
    <div class="cart-item">
      <div class="cart-item-icon">${c.emoji}</div>
      <div class="cart-item-info">
        <h4>${c.name}</h4>
        <p>Qty: ${c.qty} · ₹${c.price.toLocaleString()} each</p>
      </div>
      <div class="cart-item-price">₹${(c.price*c.qty).toLocaleString()}</div>
      <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
    </div>`).join('');
  const total = getCartTotal();
  summary.innerHTML = `<div class="cart-summary">
    <h3>Order Summary</h3>
    <div class="cart-summary-row"><span>Subtotal</span><span>₹${total.toLocaleString()}</span></div>
    <div class="cart-summary-row"><span>Shipping</span><span style="color:var(--green)">${total>=999?'Free':'₹99'}</span></div>
    <div class="cart-summary-total"><span>Total</span><span>₹${(total+(total<999?99:0)).toLocaleString()}</span></div>
    <button class="checkout-btn" onclick="showPage('checkout')">Proceed to Checkout</button>
  </div>`;
}
function removeFromCart(i){cart.splice(i,1);updateCartBadge();renderCart();}

// =========================================================
// SEARCH — REFLECTED XSS: query injected directly into innerHTML
// =========================================================
function doSearch() {
  const q = document.getElementById('search-input').value;
  const info = document.getElementById('search-info');
  const results = document.getElementById('search-results');
  const matches = DB.products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  );
  // VULNERABLE: q injected unsanitized into innerHTML → Reflected XSS
  info.innerHTML = `Showing results for "<strong>${q}</strong>" — ${matches.length} product(s) found`;
  results.innerHTML = matches.length
    ? matches.map(p => productCard(p, `viewProduct(${p.id})`)).join('')
    : `<p style="color:var(--text2)">No products found for "${q}".</p>`;
}
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if(params.get('q')) {
    document.getElementById('search-input').value = params.get('q');
    doSearch();
    showPage('search');
  }
});
document.getElementById('search-input').addEventListener('keydown', e => { if(e.key==='Enter') doSearch(); });

// =========================================================
// REVIEWS — STORED XSS: stored and rendered unsanitized
// =========================================================
function renderReviews(id) {
  const list = DB.reviews[id] || [];
  document.getElementById('product-reviews').innerHTML = list.length
    ? list.map(r => `<div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.name[0]}</div>
          <div><div class="review-author">${r.name}</div><div class="review-date">${r.date||''}</div></div>
        </div>
        <div class="review-text">${r.text}</div>
      </div>`).join('')
    : `<p style="color:var(--text2);font-size:14px">No reviews yet. Be the first!</p>`;
}
function submitReview() {
  const name = document.getElementById('review-name').value||'Anonymous';
  const text = document.getElementById('review-text').value;
  if(!text.trim()) return;
  if(!DB.reviews[currentProductId]) DB.reviews[currentProductId]=[];
  // VULNERABLE: name and text stored and rendered without sanitization → Stored XSS
  DB.reviews[currentProductId].unshift({name, text, date:'Just now', stars:5});
  renderReviews(currentProductId);
  document.getElementById('review-name').value='';
  document.getElementById('review-text').value='';
}

// =========================================================
// AUTH
// =========================================================
function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  clearMsg('login-msg');

  // VULNERABLE: SQL injection simulation (client-side mirror of server behavior)
  // Payloads: admin'-- or ' OR '1'='1
  if(u.includes("'") || u.includes('"') || u.includes('--') || u.includes(' OR ') || u.toLowerCase().includes(' or ')) {
    // Auth bypass via SQLi
    currentUser = DB.users[0];
    onLoginSuccess(DB.users[0], true);
    return;
  }

  // VULNERABLE: different error messages reveal whether username exists (User Enumeration)
  const userByName = DB.users.find(x => x.username===u || x.email===u);
  if(!userByName) {
    showMsg('login-msg','error','No account found with that username.'); // distinct message
    return;
  }
  if(userByName.password !== p) {
    showMsg('login-msg','error','Incorrect password. Please try again.'); // distinct message
    return;
  }
  currentUser = userByName;
  onLoginSuccess(userByName, false);
}

function onLoginSuccess(user, sqli) {
  // VULNERABLE: session token = btoa(username:role) — forgeable
  const token = btoa(`${user.username}:${user.role}:${Date.now()}`);
  document.cookie = `session=${token}; path=/`;
  localStorage.setItem('session', token);
  document.getElementById('nav-username').textContent = user.name.split(' ')[0];
  if(sqli) {
    showMsg('login-msg','error',''); // clear, redirect silently
  }
  setTimeout(() => showPage(user.role==='admin'?'admin':'account'), sqli?0:300);
}

function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const u = document.getElementById('reg-user').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const p = document.getElementById('reg-pass').value;
  clearMsg('reg-msg');
  if(!name||!u||!email||!p){showMsg('reg-msg','error','Please fill all fields.');return;}

  // VULNERABLE: reveals if username/email exists (User Enumeration)
  if(DB.users.find(x=>x.username===u)){showMsg('reg-msg','error','Username is already taken.');return;}
  if(DB.users.find(x=>x.email===email)){showMsg('reg-msg','error','Email is already registered.');return;}

  // VULNERABLE: password stored in plaintext
  const newUser = {id:DB.nextUserId++,name,username:u,email,role:'user',password:p,phone:'',address:''};
  DB.users.push(newUser);
  showMsg('reg-msg','success','Account created! Please sign in.');
  setTimeout(()=>showPage('login'),1500);
}

function doLogout() {
  currentUser = null;
  document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  localStorage.removeItem('session');
  document.getElementById('nav-username').textContent='';
  showPage('home');
}

// =========================================================
// FORGOT PASSWORD — predictable token (simulated MD5 of username)
// =========================================================
function pseudoHash(str) {
  // Weak predictable hash simulation (not real MD5 but deterministic)
  let h = 5381;
  for(let i=0;i<str.length;i++) h = ((h<<5)+h)+str.charCodeAt(i);
  return Math.abs(h).toString(16).padStart(8,'0');
}
function doForgot() {
  const u = document.getElementById('forgot-user').value.trim();
  clearMsg('forgot-msg');
  // VULNERABLE: different response reveals user existence
  const user = DB.users.find(x=>x.username===u);
  if(!user){showMsg('forgot-msg','error','No account with that username found.');return;}
  // VULNERABLE: predictable token = hash(username) — can be computed by attacker
  const token = pseudoHash(u);
  resetTokens[u] = token;
  // In a real app this would be emailed; here "leaked" for lab purposes
  showMsg('forgot-msg','success',`Reset token sent to ${user.email.replace(/(.{2}).+(@.+)/,'$1***$2')}. Check your email.`);
  document.getElementById('reset-token-section').style.display='block';
  // Token is stored in resetTokens — attacker can compute pseudoHash(username) directly
}
function doResetPassword() {
  const u = document.getElementById('forgot-user').value.trim();
  const token = document.getElementById('reset-token-input').value.trim();
  const newpass = document.getElementById('reset-newpass').value;
  if(resetTokens[u] && resetTokens[u]===token) {
    DB.users.find(x=>x.username===u).password = newpass;
    showMsg('forgot-msg','success','Password reset successfully!');
    setTimeout(()=>showPage('login'),1500);
  } else { showMsg('forgot-msg','error','Invalid or expired token.'); }
}

// =========================================================
// ACCOUNT / PROFILE — IDOR
// =========================================================
function renderAccount() {
  const u = currentUser;
  document.getElementById('acc-avatar').textContent = u.name[0];
  document.getElementById('acc-name').textContent = u.name;
  document.getElementById('acc-email').textContent = u.email;
  // VULNERABLE: user_id in hidden field — change to access any user's data
  document.getElementById('profile-user-id').value = u.id;
  document.getElementById('profile-name').value = u.name;
  document.getElementById('profile-username').value = u.username;
  document.getElementById('profile-email').value = u.email;
  document.getElementById('profile-phone').value = u.phone||'';
  document.getElementById('profile-addr').value = u.address||'';
  renderOrders();
}
function showAccountSection(s) {
  ['profile','orders','password'].forEach(n=>{document.getElementById('acc-section-'+n).style.display=n===s?'block':'none';});
}
function saveProfile() {
  // VULNERABLE: IDOR — uses user_id from hidden field, not session
  const id = parseInt(document.getElementById('profile-user-id').value);
  const target = DB.users.find(x=>x.id===id); // no ownership check!
  if(!target){showMsg('account-msg','error','User not found.');return;}
  target.name = document.getElementById('profile-name').value;
  target.username = document.getElementById('profile-username').value;
  target.email = document.getElementById('profile-email').value;
  target.phone = document.getElementById('profile-phone').value;
  target.address = document.getElementById('profile-addr').value;
  showMsg('account-msg','success','Profile updated successfully.');
}
function renderOrders() {
  const list = document.getElementById('orders-list');
  const myOrders = DB.orders.filter(o=>o.userId===currentUser?.id);
  if(!myOrders.length){list.innerHTML='<p style="color:var(--text2);font-size:14px">No orders yet.</p>';return;}
  list.innerHTML = myOrders.map(o=>`
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-weight:500">#${o.id}</span>
        <span style="color:var(--green);font-size:13px">Delivered</span>
      </div>
      <div style="font-size:13px;color:var(--text2)">${o.items} items · ₹${o.total.toLocaleString()}</div>
    </div>`).join('');
}
function changePassword() {
  const cur = document.getElementById('pwd-current').value;
  const nw = document.getElementById('pwd-new').value;
  if(!currentUser){showMsg('pwd-msg','error','Not logged in.');return;}
  if(currentUser.password!==cur){showMsg('pwd-msg','error','Current password is incorrect.');return;}
  currentUser.password = nw;
  showMsg('pwd-msg','success','Password updated.');
}

// =========================================================
// CHECKOUT — Parameter Tampering via hidden fields
// =========================================================
function placeOrder() {
  const name = document.getElementById('checkout-name').value;
  const email = document.getElementById('checkout-email').value;
  // VULNERABLE: total read from hidden field — can be tampered via DevTools
  const total = parseInt(document.getElementById('order-total').value) || getCartTotal();
  const discount = parseInt(document.getElementById('order-discount').value)||0;
  const finalTotal = total - discount;
  if(!name||!email){
    const m=document.getElementById('checkout-msg');m.textContent='Please fill all required fields.';m.className='msg error show';return;
  }
  const orderId = 'SN'+Date.now().toString().slice(-8);
  DB.orders.push({id:orderId,userId:currentUser?.id,items:cart.length,total:finalTotal,date:new Date().toLocaleDateString()});
  cart=[];updateCartBadge();
  document.getElementById('order-id').textContent=orderId;
  showPage('ordersuccess');
}

// =========================================================
// ADMIN — Broken Access Control (no auth check)
// =========================================================
function renderAdminTable() {
  // VULNERABLE: no check if currentUser is admin — anyone can view
  document.getElementById('stat-users').textContent = DB.users.length;
  document.getElementById('admin-users-tbody').innerHTML = DB.users.map(u=>`
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td><span class="role-badge ${u.role}">${u.role}</span></td>
      <td><code style="font-size:12px;color:var(--accent)">${u.password}</code></td>
      <td><button onclick="deleteUser(${u.id})" style="background:none;border:1px solid rgba(224,85,85,.3);color:var(--red);border-radius:6px;padding:4px 10px;font-size:12px">Delete</button></td>
    </tr>`).join('');
}
function deleteUser(id) {
  // VULNERABLE: no CSRF token on this destructive action
  DB.users = DB.users.filter(u=>u.id!==id);
  renderAdminTable();
}

// =========================================================
// XML IMPORT — XXE (simulated)
// =========================================================
function parseXMLImport() {
  const xml = document.getElementById('xml-import').value;
  const resultEl = document.getElementById('xml-result');
  if(!xml.trim()){resultEl.textContent='Please enter XML.';resultEl.className='msg error show';return;}
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml,'text/xml');
    const parseError = doc.querySelector('parsererror');
    if(parseError){resultEl.textContent='XML parse error: '+parseError.textContent;resultEl.className='msg error show';return;}
    const products = doc.querySelectorAll('product');
    if(xml.includes('ENTITY') && xml.includes('SYSTEM')) {
      // Simulate XXE detection (server would actually read the file)
      resultEl.innerHTML='XXE payload detected. On a vulnerable backend this would read the file specified in the ENTITY declaration (e.g. /etc/passwd).';
      resultEl.className='msg error show';
      return;
    }
    products.forEach(p=>{
      const name=p.querySelector('name')?.textContent||'Unnamed';
      const price=parseInt(p.querySelector('price')?.textContent)||0;
      DB.products.push({id:DB.products.length+1,name,brand:'Imported',price,oldPrice:null,emoji:'📦',category:'other',rating:0,reviews:0,badge:''});
    });
    resultEl.textContent=`${products.length} product(s) imported successfully.`;
    resultEl.className='msg success show';
  } catch(e){resultEl.textContent='Error: '+e.message;resultEl.className='msg error show';}
}

// =========================================================
// UTILS
// =========================================================
function showMsg(id, type, text) {
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = text;
  el.className = `msg ${type} show`;
}
function clearMsg(id) {
  const el = document.getElementById(id);
  if(el){el.className='msg';el.textContent='';}
}

// Auto-login from cookie (session hijacking: forge the cookie to bypass)
(function(){
  const session = localStorage.getItem('session') || (document.cookie.match(/session=([^;]+)/)||[])[1];
  if(session){
    try{
      // VULNERABLE: blindly trusts cookie content — forge btoa('admin:admin:...') to become admin
      const decoded = atob(session);
      const [username] = decoded.split(':');
      const user = DB.users.find(u=>u.username===username);
      if(user){currentUser=user;document.getElementById('nav-username').textContent=user.name.split(' ')[0];}
    }catch(e){}
  }
  renderHomeProducts();
})();


// ================================================
// ADDITIONAL VULNERABLE API FUNCTIONS
// ================================================

async function vulnerableLoginAPI(username,password){
  return fetch('/api/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  });
}

async function testSSRF(url){
  return fetch('/api/fetch?url='+encodeURIComponent(url));
}

async function vulnerablePing(host){
  return fetch('/api/ping?host='+encodeURIComponent(host));
}

async function vulnerableXML(xml){
  return fetch('/api/xml-import',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({xml})
  });
}
