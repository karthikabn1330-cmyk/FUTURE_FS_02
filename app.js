
// --- State & Config ---
const state = {
    products: window.products || [],
    admins: window.admins || [],
    showrooms: window.showrooms || [],
    orders: window.orders || [],
    cart: [],
    testRides: [], // New
    user: null,
    filters: {
        category: 'all',
        search: '',
        fuel: 'all',
        trans: 'all',
        priceRange: 100000000
    },
    authMode: 'buyer',
    isRegistering: false,
    checkoutMode: 'full' // 'full' | 'emi'
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    loadSession();
    renderHome();
    updateCartUI();
});

// --- Navigation & Views ---
function renderHome() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <!-- Hero -->
        <section class="h-[70vh] flex items-center justify-center relative overflow-hidden bg-black">
             <div class="absolute inset-0 flex">
                 <div class="w-1/2 h-full bg-[url('https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center">
                     <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60"></div>
                 </div>
                 <div class="w-1/2 h-full bg-[url('https://images.pexels.com/photos/16812630/pexels-photo-16812630.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center">
                      <div class="absolute inset-0 bg-gradient-to-l from-black/20 to-black/60"></div>
                 </div>
             </div>
             <!-- Removed blur layer for better visibility -->
             <div class="absolute inset-0 bg-black/20"></div>
             <div class="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
             <div class="text-center relative z-10 p-4">
                 <h1 class="text-4xl md:text-6xl font-serif font-bold text-white mb-4 animate-slide-up">Your dream ride, <span class="text-gold">made effortless.</span></h1>
                 <p class="text-gray-300 text-lg mb-8 max-w-2xl mx-auto animate-fade-in">C&BStore brings luxury and affordable cars & bikes together for a smooth buying experience.</p>
                 <button onclick="document.getElementById('catalog').scrollIntoView({behavior:'smooth'})" class="bg-gold text-black px-8 py-3 rounded font-bold hover:bg-white transition-colors animate-fade-in">
                     Explore
                 </button>
             </div>
        </section>

        </section>
        
        <!-- Catalog -->
        <section id="catalog" class="max-w-screen-2xl mx-auto px-4 py-16">
            <!-- Filter Bar -->
            <div class="flex flex-wrap gap-4 mb-8 items-center bg-[#121212] p-4 rounded-lg border border-white/5 sticky top-20 z-30 shadow-xl">
                 <button id="btn-cat-all" onclick="setFilter('category', 'all')" class="px-4 py-2 rounded text-sm ${state.filters.category === 'all' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'}">All</button>
                 <button id="btn-cat-cars" onclick="setFilter('category', 'cars')" class="px-4 py-2 rounded text-sm ${state.filters.category === 'cars' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'}">Cars</button>
                 <button id="btn-cat-bikes" onclick="setFilter('category', 'bikes')" class="px-4 py-2 rounded text-sm ${state.filters.category === 'bikes' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'}">Bikes</button>
                 
                 <div class="flex items-center gap-2 bg-black border border-white/10 rounded px-3 py-2">
                     <span class="text-xs text-gray-500">Max:</span>
                     <select onchange="setFilter('priceRange', Number(this.value))" class="bg-transparent text-white text-sm outline-none cursor-pointer">
                         <option value="100000000" ${state.filters.priceRange >= 100000000 ? 'selected' : ''}>Any Price</option>
                         <option value="500000" ${state.filters.priceRange === 500000 ? 'selected' : ''}>₹5 Lakh</option>
                         <option value="2000000" ${state.filters.priceRange === 2000000 ? 'selected' : ''}>₹20 Lakh</option>
                         <option value="5000000" ${state.filters.priceRange === 5000000 ? 'selected' : ''}>₹50 Lakh</option>
                         <option value="10000000" ${state.filters.priceRange === 10000000 ? 'selected' : ''}>₹1 Crore</option>
                         <option value="50000000" ${state.filters.priceRange === 50000000 ? 'selected' : ''}>₹5 Crore</option>
                     </select>
                 </div>

                 <div class="flex-1 min-w-[200px]">
                     <input type="text" oninput="setFilter('search', this.value)" placeholder="Search model..." class="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold outline-none">
                 </div>
            </div>
            
            <!-- Grid -->
            <div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <!-- Injected -->
            </div>
        </section>
    `;
    renderProductGrid();
}

function renderProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = state.products.filter(p => {
        if (state.filters.category !== 'all' && p.category !== state.filters.category) return false;
        if (p.price > state.filters.priceRange) return false;
        if (state.filters.search) {
            const term = state.filters.search.toLowerCase();
            return p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term);
        }
        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500">No vehicles found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        // Find Logic
        const showroom = state.showrooms.find(s => s.id === p.showroomId);
        const loc = showroom ? showroom.location : 'Location Unavailable';

        return `
        <div class="group bg-[#121212] border border-white/5 rounded-lg overflow-hidden hover:border-gold/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col">
            <div class="relative h-56 overflow-hidden cursor-pointer" onclick="openProductModal('${p.id}')">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-gold border border-gold/20 uppercase tracking-widest font-bold">
                    ${p.brand}
                </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
                <h3 class="text-white font-serif font-bold text-lg mb-1 truncate">${p.name}</h3>
                <div class="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <i class="fa-solid fa-location-dot text-gold/70"></i> ${loc}
                </div>
                
                <div class="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span class="text-gold font-medium">${formatCurrency(p.price)}</span>
                    <button onclick="addToCart('${p.id}')" class="bg-white/5 hover:bg-gold hover:text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

function setFilter(key, val) {
    state.filters[key] = val;

    if (key === 'category') {
        ['all', 'cars', 'bikes'].forEach(c => {
            const btn = document.getElementById(`btn-cat-${c}`);
            if (btn) {
                if (c === val) {
                    btn.className = "px-4 py-2 rounded text-sm bg-gold text-black font-bold";
                } else {
                    btn.className = "px-4 py-2 rounded text-sm text-gray-400 hover:text-white";
                }
            }
        });
    }

    renderProductGrid();
}

// --- Admin Dashboard & Showroom Management ---

function renderAdminDashboard() {
    if (!state.user || state.user.type !== 'seller') { return renderHome(); }

    // Find my showrooms
    const myShowrooms = state.showrooms.filter(s => s.adminId === state.user.id);
    const totalSales = myShowrooms.reduce((acc, s) => acc + s.salesCount, 0);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="max-w-screen-xl mx-auto px-4 py-10 animate-fade-in">
             <div class="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                 <div>
                     <h1 class="text-3xl font-serif text-white">Partner Portal</h1>
                     <p class="text-gray-500 text-sm">Welcome back, ${state.user.businessName}</p>
                 </div>
                 <div class="flex gap-3">
                     <button onclick="openAddShowroomModal()" class="px-4 py-2 bg-gold text-black font-bold text-sm rounded hover:bg-white">+ Add Showroom</button>
                 </div>
             </div>

             <!-- Stats -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div class="bg-[#121212] p-6 rounded border border-white/5">
                     <span class="text-gray-500 text-xs uppercase tracking-widest">Total Sales</span>
                     <span class="block text-4xl text-white font-serif mt-2">${totalSales} <span class="text-sm text-emerald-500">Units</span></span>
                 </div>
                 <div class="bg-[#121212] p-6 rounded border border-white/5">
                     <span class="text-gray-500 text-xs uppercase tracking-widest">Active Showrooms</span>
                     <span class="block text-4xl text-white font-serif mt-2">${myShowrooms.length}</span>
                 </div>
                 <div class="bg-[#121212] p-6 rounded border border-white/5">
                     <span class="text-gray-500 text-xs uppercase tracking-widest">Admin ID</span>
                     <span class="block text-lg text-gold font-mono mt-2">${state.user.id}</span>
                 </div>
             </div>

             <!-- Showrooms List -->
             <div class="grid gap-6 md:grid-cols-2">
                 <div>
                     <h2 class="text-white font-serif text-xl mb-4">Your Showrooms</h2>
                     <div class="space-y-4">
                         ${myShowrooms.map(sr => {
        const showroomProducts = state.products.filter(p => p.showroomId === sr.id);
        const inventory = showroomProducts.length;
        const brands = [...new Set(showroomProducts.map(p => p.brand))].join(', ');

        return `
                                <div class="bg-[#121212] border border-white/5 p-4 rounded flex justify-between items-center hover:border-gold/30 transition-colors cursor-pointer relative group" onclick="renderShowroomDetail('${sr.id}')">
                                    <div class="flex items-center gap-3">
                                        <div class="bg-gray-800 w-10 h-10 flex items-center justify-center rounded text-gold">
                                            <i class="fa-solid fa-store"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-white font-bold text-sm">${sr.name}</h3>
                                            <p class="text-xs text-gray-500">${inventory} Listed</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <span class="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded mr-3 uppercase tracking-wider max-w-[200px] truncate block" title="${brands}">
                                            ${brands || 'No Stock'}
                                        </span>
                                        <button onclick="event.stopPropagation(); removeShowroom('${sr.id}')" class="text-gray-600 hover:text-red-500 transition-colors p-2">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `}).join('')}
                     </div>
                 </div>

                 <!-- Test Ride Requests -->
                 <div>
                     <h2 class="text-white font-serif text-xl mb-4">Test Ride Requests</h2>
                     <div class="bg-[#121212] border border-white/5 rounded overflow-hidden max-h-[400px] overflow-y-auto">
                         ${(() => {
            const srIds = myShowrooms.map(s => s.id);
            const myRequests = state.testRides.filter(tr => {
                const p = state.products.find(prod => prod.id === tr.productId);
                return p && srIds.includes(p.showroomId);
            });

            if (myRequests.length === 0) return '<p class="p-4 text-gray-500 text-sm">No test ride requests yet.</p>';

            return myRequests.map(tr => {
                const p = state.products.find(prod => prod.id === tr.productId);
                const user = window.orders ? (window.orders.find(o => o.userId === tr.userId) || {}).user : null; // Try to extract user info if possible, or just show ID
                // Since we don't strictly link users globally, we'll just show Date/Time/Product
                const statusColor = tr.status === 'Completed' ? 'text-emerald-400' : (tr.status === 'Cancelled' ? 'text-red-400' : 'text-gold');

                return `
                                     <div class="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                         <div class="flex justify-between items-start mb-2">
                                             <div>
                                                 <span class="text-white font-bold text-sm block">${p ? p.name : 'Unknown Vehicle'}</span>
                                                  <span class="text-xs text-gray-400">Date: ${tr.date} | Time: ${tr.time}</span>
                                             </div>
                                             <span class="text-xs font-bold ${statusColor} border border-white/10 px-2 py-1 rounded">${tr.status}</span>
                                         </div>
                                         ${tr.status === 'Scheduled' ? `
                                             <div class="flex gap-2 mt-3">
                                                 <button onclick="updateTestRideStatus('${tr.id}', 'Completed')" class="flex-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 py-1 text-xs rounded hover:bg-emerald-900/50">Complete</button>
                                                 <button onclick="updateTestRideStatus('${tr.id}', 'Cancelled')" class="flex-1 bg-red-900/30 text-red-400 border border-red-500/30 py-1 text-xs rounded hover:bg-red-900/50">Decline</button>
                                             </div>
                                         ` : ''}
                                     </div>
                                 `;
            }).join('');
        })()}
                     </div>
                 </div>
             </div>
        </div>
    `;
}

function updateTestRideStatus(trId, status) {
    const tr = state.testRides.find(t => t.id === trId);
    if (tr) {
        tr.status = status;
        renderAdminDashboard();
    }
}

function renderShowroomDetail(showroomId) {
    const s = state.showrooms.find(x => x.id === showroomId);
    if (!s) return;

    // Inventory
    const inventory = state.products.filter(p => p.showroomId === showroomId);

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="max-w-screen-xl mx-auto px-4 py-10 animate-fade-in">
             <div class="mb-6">
                 <button onclick="renderAdminDashboard()" class="text-gray-500 hover:text-white text-sm mb-4"><i class="fa-solid fa-arrow-left"></i> Back to Dashboard</button>
                 <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-serif text-white">${s.name}</h1>
                        <p class="text-gold text-sm mt-1">${s.location}</p>
                    </div>
                    <button onclick="openAddVehicleModal('${s.id}')" class="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gold transition-colors">+ List Vehicle</button>
                 </div>
             </div>

             <div class="bg-[#121212] border border-white/5 rounded-lg overflow-hidden">
                 <div class="p-4 border-b border-white/5 bg-white/5 flex justify-between">
                     <h3 class="text-white font-bold">Current Inventory</h3>
                     <span class="text-gray-400 text-sm">${inventory.length} Items</span>
                 </div>
                 <div class="divide-y divide-white/5">
                     ${inventory.map(p => `
                          <div class="p-4 flex gap-4 items-center hover:bg-white/5 transition-colors">
                              <img src="${p.image}" class="w-16 h-16 object-cover rounded border border-white/10">
                              <div class="flex-1">
                                  <h4 class="text-white font-bold">${p.name}</h4>
                                  <p class="text-xs text-gray-500">${p.category} • ${p.fuel}</p>
                              </div>
                              <div class="text-right flex items-center gap-4">
                                  <div>
                                      <span class="text-gold font-medium block">${formatCurrency(p.price)}</span>
                                      ${p.features && p.features.autopilot ? '<span class="text-[10px] bg-blue-900 text-blue-200 px-1 rounded">Autopilot</span>' : ''}
                                  </div>
                                  <button onclick="removeVehicle('${p.id}', '${s.id}')" class="text-gray-500 hover:text-red-500 transition-colors">
                                     <i class="fa-solid fa-trash"></i>
                                  </button>
                              </div>
                          </div>
                      `).join('')}
                     ${inventory.length === 0 ? '<div class="p-8 text-center text-gray-500">No vehicles listed yet.</div>' : ''}
                 </div>
             </div>
        </div>
    `;
}

// --- Cart & Checkout Logic ---
function addToCart(pid) {
    if (!state.user) {
        alert("Please login to add items to your garage.");
        toggleAuthModal('buyer');
        // Close product modal if open, to avoid clutter
        closeProductModal();
        return;
    }

    const p = state.products.find(x => x.id === pid);
    if (!p) return alert("Product not found");

    if (!state.cart.find(x => x.id === pid)) {
        state.cart.push(p);
        updateCartUI();
        toggleCart(); // Show cart immediately
    } else {
        alert("This vehicle is already in your garage.");
        toggleCart(); // Show cart anyway
    }
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (count) {
        count.innerText = state.cart.length;
        count.style.opacity = state.cart.length ? 1 : 0;
    }

    if (state.cart.length === 0) {
        if (list) list.innerHTML = '';
        const emptyMsg = document.getElementById('empty-cart-msg');
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        if (totalEl) totalEl.innerText = formatCurrency(0);

        const checkoutBtn = document.querySelector('#cart-panel button.bg-gold');
        // Note: Selector might need adjustment if class bg-[#0f0f0f] was changed
        // Let's use a safer selector if possible or keep what worked
        const panelBtn = document.querySelector('#cart-panel button[onclick="openCheckoutModal()"]');
        if (panelBtn) {
            panelBtn.disabled = true;
            panelBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    } else {
        const emptyMsg = document.getElementById('empty-cart-msg');
        if (emptyMsg) emptyMsg.classList.add('hidden');

        const panelBtn = document.querySelector('#cart-panel button[onclick="openCheckoutModal()"]');
        if (panelBtn) {
            panelBtn.disabled = false;
            panelBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        if (list) {
            list.innerHTML = state.cart.map(i => `
                <li class="flex gap-4 items-center bg-white/5 p-2 rounded border border-white/5">
                    <img src="${i.image}" class="w-16 h-16 object-cover rounded border border-white/10">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-white font-bold text-sm truncate">${i.name}</h4>
                        <p class="text-gray-500 text-xs truncate">${i.brand}</p>
                        <div class="text-gold text-sm mt-1">${formatCurrency(i.price)}</div>
                    </div>
                    <button onclick="removeFromCart('${i.id}')" class="text-gray-500 hover:text-red-400 w-8 h-8 flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </li>
            `).join('');
        }

        const sum = state.cart.reduce((a, b) => a + b.price, 0);
        if (totalEl) totalEl.innerText = formatCurrency(sum);
    }
}

function removeFromCart(id) {
    state.cart = state.cart.filter(x => x.id !== id);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const panel = document.getElementById('cart-panel');
    const back = document.getElementById('cart-backdrop');

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            panel.classList.remove('translate-x-full');
            back.classList.remove('opacity-0');
        }, 10);
    } else {
        panel.classList.add('translate-x-full');
        back.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 500);
    }
}

function openCheckoutModal() {
    if (state.cart.length === 0) return alert("Cart empty");
    if (!state.user) {
        toggleCart();
        toggleAuthModal('buyer');
        return;
    }

    toggleCart(); // Close cart
    updateCheckoutUI();
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function toggleEMI(isEmi) {
    state.checkoutMode = isEmi ? 'emi' : 'full';
    document.getElementById('emi-options').classList.toggle('hidden', !isEmi);
    updateCheckoutUI();
}

function updateCheckoutUI() {
    const sum = state.cart.reduce((a, b) => a + b.price, 0);
    document.getElementById('checkout-subtotal').innerText = formatCurrency(sum);
    const totalEl = document.getElementById('checkout-total');

    if (state.checkoutMode === 'emi') {
        const select = document.getElementById('emi-plan');
        if (select.children.length === 0) {
            select.innerHTML = `
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="60">60 Months</option>
            `;
            select.onchange = updateCheckoutUI;
        }

        const months = parseInt(select.value);
        const interest = sum * 0.10 * (months / 12); // Simple Interest for demo
        const totalWithInt = sum + interest;
        const monthly = totalWithInt / months;

        totalEl.innerHTML = `
            ${formatCurrency(monthly)}<span class="text-sm text-gray-400">/mo</span>
            <div class="text-[10px] text-gray-500 mt-1">Total Pay: ${formatCurrency(totalWithInt)} (${months} mo)</div>
        `;
    } else if (state.checkoutMode === 'downpayment') {
        const downPercent = 0.20; // 20% down
        const downAmt = sum * downPercent;
        totalEl.innerHTML = `
            ${formatCurrency(downAmt)}
            <div class="text-[10px] text-gray-500 mt-1">20% Booking Amount</div>
        `;
    } else {
        totalEl.innerText = formatCurrency(sum);
    }
}


function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function processPayment(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const old = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    setTimeout(() => {
        const orderId = 'ORD-' + Date.now();
        const sum = state.cart.reduce((a, b) => a + b.price, 0);
        let payMethodStr = 'Full Payment';

        if (state.checkoutMode === 'emi') {
            payMethodStr = `EMI (${document.getElementById('emi-plan').value} Mo)`;
        } else if (state.checkoutMode === 'downpayment') {
            payMethodStr = 'Down Payment (20%)';
        }

        // Update Sales & Stock
        state.cart.forEach(item => {
            const product = state.products.find(p => p.id === item.id);
            if (product) {
                if (product.stock > 0) product.stock--;
            }

            const sr = state.showrooms.find(s => s.id === item.showroomId);
            if (sr) sr.salesCount++;
        });

        // Create Order
        const order = {
            id: orderId,
            date: new Date().toLocaleDateString(),
            items: [...state.cart],
            total: sum,
            userId: state.user.id,
            paymentMethod: payMethodStr
        };
        state.orders.push(order);
        state.cart = [];

        saveData(); // Persist

        updateCartUI();
        closeCheckoutModal();
        btn.innerText = old;
        btn.disabled = false;

        renderOrders(); // Go to history
        showToast(`Order Placed Successfully! ID: ${orderId}`);
    }, 2000);
}

function toggleEMI(isEmi) {
    // We ignore the boolean argument now and check the actual value
    const mode = document.querySelector('input[name="pay-method"]:checked').value;
    state.checkoutMode = mode;
    document.getElementById('emi-options').classList.toggle('hidden', mode !== 'emi');
    updateCheckoutUI();
}

// Fixed toggle handler called by HTML
function togglePayment(mode) {
    state.checkoutMode = mode;
    document.getElementById('emi-options').classList.toggle('hidden', mode !== 'emi');
    updateCheckoutUI();
}

// --- Test Ride Logic ---
function openTestRideModal(pid) {
    if (!state.user) {
        toggleAuthModal('buyer');
        return;
    }

    const p = state.products.find(x => x.id === pid);
    const sr = state.showrooms.find(s => s.id === p.showroomId);

    document.getElementById('test-ride-modal').classList.remove('hidden');
    document.getElementById('tr-vehicle-name').innerText = p.name;
    document.getElementById('tr-location').innerText = sr ? sr.location : 'Main Showroom';

    document.getElementById('tr-product-id').value = pid;
    document.getElementById('tr-showroom-id').value = sr ? sr.id : '';
}

function handleTestRide(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    state.testRides.push({
        id: 'TR-' + Date.now(),
        userId: state.user.id,
        productId: fd.get('productId'),
        date: fd.get('date'),
        time: fd.get('time'),
        status: 'Scheduled'
    });

    document.getElementById('test-ride-modal').classList.add('hidden');
    showToast("Test Ride Booked Successfully!");
}

// --- Modals & Helpers ---
function openProductModal(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;

    const sr = state.showrooms.find(s => s.id === p.showroomId);
    const modal = document.getElementById('product-modal');

    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-img').setAttribute('onclick', `openLightbox('${p.image}')`);
    document.getElementById('modal-img').style.cursor = 'zoom-in';

    let featHtml = '';
    if (p.features) {
        if (p.features.autopilot) featHtml += `<span class="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs border border-blue-500/30">Autopilot / ADAS</span> `;
    }

    document.getElementById('modal-content').innerHTML = `
        <span class="text-gold text-xs uppercase tracking-widest font-bold">${p.brand}</span>
        <h2 class="text-3xl font-serif text-white mt-1 mb-2">${p.name}</h2>
        <div class="flex flex-wrap gap-2 mb-6">${featHtml}</div>
        
        <div class="flex justify-between items-end mb-6">
            <div class="text-4xl text-white font-light">${formatCurrency(p.price)}</div>
            <div class="text-xs ${p.stock > 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded border border-current">
                ${p.stock > 0 ? `${p.stock} Units In Stock` : 'Out of Stock'}
            </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div class="bg-white/5 p-3 rounded border border-white/5">
                <span class="text-gray-500 block text-xs uppercase">Engine</span>
                <span class="text-white">${p.specs.engine || '-'}</span>
            </div>
             <div class="bg-white/5 p-3 rounded border border-white/5">
                <span class="text-gray-500 block text-xs uppercase">Power</span>
                <span class="text-white">${p.specs.power || '-'}</span>
            </div>
             <div class="bg-white/5 p-3 rounded border border-white/5">
                <span class="text-gray-500 block text-xs uppercase">Transmission</span>
                <span class="text-white">${p.transmission}</span>
            </div>
             <div class="bg-white/5 p-3 rounded border border-white/5">
                <span class="text-gray-500 block text-xs uppercase">Braking</span>
                <span class="text-white">${p.specs.braking || '-'}</span>
            </div>
             <div class="bg-white/5 p-3 rounded border border-white/5 col-span-2 md:col-span-1">
                <span class="text-gray-500 block text-xs uppercase">Location</span>
                <span class="text-gold">${sr ? sr.location : 'N/A'}</span>
            </div>
        </div>
        
        <div class="bg-[#0a0a0a] border border-white/10 p-4 rounded mb-8">
            <p class="text-xs text-gray-500 uppercase tracking-widest mb-2">Dealer Information</p>
            <p class="text-white font-bold">${sr ? sr.name : 'Unknown Dealer'}</p>
            <p class="text-sm text-gray-400">${sr ? sr.location : ''}</p>
        </div>

        <p class="text-gray-400 text-sm leading-relaxed mb-8">${p.description}</p>
        
        <div class="flex gap-4">
             <button onclick="openTestRideModal('${p.id}'); closeProductModal()" class="flex-1 bg-white/10 text-white py-4 font-bold rounded hover:bg-white hover:text-black transition-colors border border-white/10">
                Book Test Ride
            </button>
             <button onclick="addToCart('${p.id}'); closeProductModal()" 
                class="flex-1 bg-gold text-black py-4 font-bold rounded hover:bg-white transition-colors ${p.stock <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}"
                ${p.stock <= 0 ? 'disabled' : ''}>
                ${p.stock <= 0 ? 'Out of Stock' : 'Add to Garage'}
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// --- Auth Handling ---
function toggleAuthModal(initialTab = null) {
    const m = document.getElementById('auth-modal');
    if (m.classList.contains('hidden')) {
        m.classList.remove('hidden');
        resetAuthSelection(); // Always start at selection
    } else {
        m.classList.add('hidden');
    }
}

function resetAuthSelection() {
    document.getElementById('auth-selection').classList.remove('hidden');
    document.getElementById('auth-forms').classList.add('hidden');
}

function switchAuthTab(type) {
    state.authMode = type;

    // Hide Selection, Show Forms Container
    document.getElementById('auth-selection').classList.add('hidden');
    document.getElementById('auth-forms').classList.remove('hidden');

    // Toggle Specific Form
    document.getElementById('form-buyer').classList.toggle('hidden', type !== 'buyer');
    document.getElementById('form-seller').classList.toggle('hidden', type !== 'seller');

    // Update Title
    const title = type === 'buyer' ? 'User Login' : 'Admin Portal';
    document.getElementById('auth-title').innerText = title;

    // Reset to Login Mode by default
    state.isRegistering = false;
    toggleRegisterMode(type, true);
}

function toggleRegisterMode(type, forceLogin = false) {
    if (!forceLogin) state.isRegistering = !state.isRegistering;

    const fields = document.getElementById(`${type}-register-fields`);
    const btn = document.getElementById(`${type === 'buyer' ? 'form-buyer' : 'form-seller'}`).querySelector('button[type="submit"]');
    const toggle = document.getElementById(`${type}-toggle-text`);
    const formTitle = document.getElementById(`${type === 'buyer' ? 'form-buyer' : 'form-seller'}`).querySelector('p'); // Title inside form

    if (state.isRegistering) {
        fields.classList.remove('hidden');
        btn.innerText = "Register & Continue";
        toggle.innerText = type === 'buyer' ? "Have an account? Login" : "Already a Partner? Login";
        if (formTitle) formTitle.innerText = type === 'buyer' ? "Create Account" : "Partner Application";
    } else {
        fields.classList.add('hidden');
        btn.innerText = type === 'buyer' ? "Continue" : "Access Portal";
        toggle.innerText = type === 'buyer' ? "New? Create Account" : "Apply for Partnership";
        if (formTitle) formTitle.innerText = type === 'buyer' ? "User Login" : "Partner Login";
    }
}

function handleAuth(e, type) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email');
    const password = fd.get('password');

    // --- SELLER AUTH ---
    if (type === 'seller') {
        // Check window.admins first
        const existing = state.admins.find(a => a.email === email);

        if (state.isRegistering) {
            alert("New Admin registration is disabled in this demo. Please use an existing account.");
            return;
        } else {
            // Login Existing
            if (!existing) return alert("Admin account not found.");

            // Check Password against file
            if (existing.password && password !== existing.password) {
                return alert("Invalid Password. (Try 'admin123')");
            } else if (!existing.password && password !== 'admin123') {
                return alert("Invalid Password. (Try 'admin123')");
            }

            state.user = existing;
        }
    }
    // --- BUYER AUTH ---
    else {
        // Load simplistic 'User Database' from localstorage
        let usersDB = JSON.parse(localStorage.getItem('cb_users_db') || '[]');
        const existingUser = usersDB.find(u => u.email === email);

        if (state.isRegistering) {
            if (existingUser) return alert("User already exists! Please Login.");

            const newUser = {
                id: 'u_' + Date.now(),
                email: email,
                password: password, // In a real app, this would be hashed!
                name: fd.get('name') || email.split('@')[0],
                type: 'buyer',
                address: fd.get('address') || ''
            };

            usersDB.push(newUser);
            localStorage.setItem('cb_users_db', JSON.stringify(usersDB));
            state.user = newUser;
        } else {
            if (!existingUser) return alert("User not found. Please Register.");
            if (existingUser.password !== password) return alert("Incorrect Password.");
            state.user = existingUser;
        }
    }

    // Use SessionStorage so refresh works, but closing browser logs out
    sessionStorage.setItem('cb_user_sess', JSON.stringify(state.user));

    toggleAuthModal();
    updateUserMenu();
    if (state.user.type === 'seller') renderAdminDashboard();
    showToast("Welcome " + state.user.name + "!");
}

// --- User Menu & Profile ---
function updateUserMenu() {
    const c = document.getElementById('user-menu-container');
    const homeLink = document.getElementById('admin-home-link');
    const cartBtn = document.getElementById('nav-cart-btn');

    // Cart Logic: Show ONLY if logged in AND NOT a seller
    if (cartBtn) {
        const showCart = state.user && state.user.type !== 'seller';
        cartBtn.classList.toggle('hidden', !showCart);
    }

    if (state.user) {
        // Admin Homepage Link: Show ONLY for Sellers
        if (homeLink) homeLink.classList.toggle('hidden', state.user.type !== 'seller');

        // Initial Icon
        const initials = state.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        c.innerHTML = `
            <div class="relative">
                <button onclick="toggleUserDropdown()" class="w-10 h-10 rounded-full bg-gold text-black font-bold flex items-center justify-center hover:bg-white transition-colors border border-white/20">
                    ${initials}
                </button>
                <div id="user-dropdown" class="hidden absolute right-0 mt-3 w-48 bg-[#121212] border border-white/10 rounded shadow-xl overflow-hidden z-50 animate-fade-in">
                    <div class="p-4 border-b border-white/10">
                        <p class="text-white font-bold truncate">${state.user.name}</p>
                        <p class="text-xs text-gray-500 truncate">${state.user.email}</p>
                    </div>
                    <ul class="text-sm text-gray-400">
                        ${state.user.type === 'seller'
                ? `<li><button onclick="renderAdminDashboard(); toggleUserDropdown()" class="block w-full text-left px-4 py-3 hover:bg-white/5 hover:text-gold"><i class="fa-solid fa-store mr-2"></i> My Showroom</button></li>`
                : `<li><button onclick="renderOrders(); toggleUserDropdown()" class="block w-full text-left px-4 py-3 hover:bg-white/5 hover:text-gold"><i class="fa-solid fa-list mr-2"></i> My Order</button></li>`
            }
                        <li><button onclick="openEditProfile(); toggleUserDropdown()" class="block w-full text-left px-4 py-3 hover:bg-white/5 hover:text-gold"><i class="fa-solid fa-user-pen mr-2"></i> Edit Profile</button></li>
                        <li><button onclick="logout()" class="block w-full text-left px-4 py-3 hover:bg-white/5 hover:text-red-400 border-t border-white/5"><i class="fa-solid fa-sign-out-alt mr-2"></i> Sign Out</button></li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        if (homeLink) homeLink.classList.add('hidden');
        c.innerHTML = `
             <button onclick="toggleAuthModal('login')" class="text-dark bg-gold hover:bg-white font-medium rounded px-5 py-2 text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                Login
            </button>
        `;
    }
}

function toggleUserDropdown() {
    const d = document.getElementById('user-dropdown');
    if (d) d.classList.toggle('hidden');
}

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
    const c = document.getElementById('user-menu-container');
    if (c && !c.contains(e.target)) {
        const d = document.getElementById('user-dropdown');
        if (d && !d.classList.contains('hidden')) d.classList.add('hidden');
    }
});

function logout() {
    state.user = null;
    localStorage.removeItem('cb_user_v2');
    updateUserMenu();
    renderHome();
}

// --- Order History View ---
function renderOrders() {
    const main = document.getElementById('main-content');
    const myOrders = state.orders.filter(o => o.userId === state.user.id);

    main.innerHTML = `
        <div class="max-w-screen-xl mx-auto px-4 py-10 animate-fade-in">
             <h1 class="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">My Order History</h1>
             
             <div class="space-y-6">
                ${myOrders.length === 0 ? '<p class="text-gray-500">No orders placed yet.</p>' : myOrders.map(o => `
                    <div class="bg-[#121212] border border-white/5 rounded-lg p-6 hover:border-gold/30 transition-colors">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="text-gold font-bold text-sm">Order #${o.id}</span>
                                <span class="block text-xs text-gray-500 mt-1">${o.date}</span>
                            </div>
                            <span class="px-3 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs border border-emerald-500/20">Confirmed</span>
                        </div>
                        <div class="divide-y divide-white/5 mb-4">
                            ${o.items.map(i => `
                                <div class="py-3 flex gap-4 items-center">
                                    <img src="${i.image}" class="w-12 h-12 object-cover rounded">
                                    <div class="flex-1">
                                        <div class="text-white text-sm font-bold">${i.name}</div>
                                        <div class="text-gray-500 text-xs">${i.brand}</div>
                                    </div>
                                    <div class="text-white text-sm">${formatCurrency(i.price)}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex justify-between items-center pt-4 border-t border-white/10">
                            <div class="text-xs text-gray-400">
                                <span class="block">Payment: <span class="text-white">${o.paymentMethod || 'Full Payment'}</span></span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs text-gray-500 uppercase">Total Amount</span>
                                <span class="block text-xl text-gold font-serif">${formatCurrency(o.total)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
             </div>
        </div>
    `;
}

// --- Generic Test Ride ---
function openGenericTestRide() {
    if (!state.user) {
        toggleAuthModal('buyer');
        return;
    }
    // Quick Hack: Populate Modal with Selects
    const modal = document.getElementById('test-ride-modal');
    modal.classList.remove('hidden');

    // We expect the modal elements to be there; we just change content
    const productsOpt = state.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    // Replace displays with Selects dynamically if not already replaced
    const vEl = document.getElementById('tr-vehicle-name');
    if (vEl) {
        vEl.parentElement.innerHTML = `
         <span class="block text-xs text-gray-500 uppercase mb-1">Select Vehicle</span>
         <select id="tr-select-vehicle" class="w-full bg-[#121212] text-white border border-white/20 p-2 rounded" onchange="updateTRLocation(this.value)">
            ${productsOpt}
         </select>
        `;
    }

    // Initialize location based on first
    if (state.products.length > 0) updateTRLocation(state.products[0].id);
}

function updateTRLocation(pid) {
    const p = state.products.find(x => x.id === pid);
    const sr = state.showrooms.find(s => s.id === p.showroomId);

    document.getElementById('tr-product-id').value = pid;
    document.getElementById('tr-showroom-id').value = sr ? sr.id : '';

    const locEl = document.getElementById('tr-location');
    if (locEl) locEl.innerText = sr ? sr.location : 'Main Showroom';
}

// --- Add Vehicle Logic ---
function openAddVehicleModal(showroomId) {
    document.getElementById('add-vehicle-modal').classList.remove('hidden');
    document.getElementById('add-vh-showroom-id').value = showroomId;
    // Reset file preview
    document.getElementById('vh-img-file').value = '';
    document.getElementById('vh-img-url').value = '';
    document.getElementById('img-preview').classList.add('hidden');
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // We store the Base64 in a data attribute on the preview so the handler can read it
            const preview = document.getElementById('img-preview');
            preview.innerText = `File Selected: ${input.files[0].name}`;
            preview.classList.remove('hidden');
            preview.dataset.base64 = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function handleNewVehicle(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const showroomId = fd.get('showroomId');

    // Determine Image Source (File Base64 or URL)
    let imageSrc = fd.get('image'); // Default to URL
    const fileBase64 = document.getElementById('img-preview').dataset.base64;

    if (document.getElementById('vh-img-file').files.length > 0 && fileBase64) {
        imageSrc = fileBase64;
    }

    const newP = {
        id: 'new_' + Date.now(),
        name: fd.get('name'),
        stock: Number(fd.get('stock')) || 1,
        brand: fd.get('brand'),
        category: fd.get('category'),
        price: Number(fd.get('price')),
        image: imageSrc,
        description: fd.get('desc'),
        fuel: fd.get('fuel'),
        transmission: fd.get('transmission') || 'Automatic',
        showroomId: showroomId,
        specs: {
            engine: fd.get('engine') || 'N/A',
            power: fd.get('power') || 'N/A',
            braking: fd.get('braking') || 'N/A'
        },
        features: {
            autopilot: !!fd.get('autopilot')
        }
    };

    state.products.push(newP);
    saveData(); // Persist
    document.getElementById('add-vehicle-modal').classList.add('hidden');
    renderShowroomDetail(showroomId);
    showToast("Vehicle Listed Successfully!");
}

function openAddShowroomModal() {
    document.getElementById('add-showroom-modal').classList.remove('hidden');
}

function handleAddShowroom(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    state.showrooms.push({
        id: 'sr_' + Date.now(),
        adminId: state.user.id,
        name: fd.get('name'),
        location: fd.get('location'),
        salesCount: 0,
        licenseId: 'NEW'
    });

    saveData(); // Persist
    renderAdminDashboard();
    document.getElementById('add-showroom-modal').classList.add('hidden');
    showToast("Showroom Opened Successfully!");
}

function removeShowroom(id) {
    if (!confirm("Are you sure? This will delete the showroom and all its vehicles.")) return;

    state.showrooms = state.showrooms.filter(s => s.id !== id);
    // Also remove vehicles in that showroom
    state.products = state.products.filter(p => p.showroomId !== id);
    saveData(); // Persist

    renderAdminDashboard();
}

function removeVehicle(pid, sid) {
    if (!confirm("Remove this vehicle listing?")) return;
    state.products = state.products.filter(p => p.id !== pid);
    saveData(); // Persist
    renderShowroomDetail(sid);
}

// --- Profile Management ---
function openEditProfile() {
    const user = state.user;
    if (!user) return;

    const modal = document.getElementById('edit-profile-modal');
    modal.classList.remove('hidden');

    // Populate Fields
    document.getElementById('ep-name').value = user.name;
    document.getElementById('ep-mobile').value = user.mobile || '';
    document.getElementById('ep-address').value = user.address || '';

    // Handle Seller Specifics
    const businessGroup = document.getElementById('ep-business-group');
    const addressLabel = document.getElementById('ep-address-label');

    if (user.type === 'seller') {
        businessGroup.classList.remove('hidden');
        document.getElementById('ep-business').value = user.businessName || '';
        addressLabel.innerText = 'Head Office Address';
    } else {
        businessGroup.classList.add('hidden');
        addressLabel.innerText = 'Delivery Address';
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const user = state.user;

    user.name = fd.get('name');
    user.mobile = fd.get('mobile');
    user.address = fd.get('address');

    if (user.type === 'seller') {
        user.businessName = fd.get('business');
    }

    // Persist
    // Logic: If user is from file (window.admins), we can't save changes to file.
    // But we are in "demo mode".
    // We will save to localStorage/sessionStorage as 'cb_user_v2' overrides.
    // AND update state.

    // Note: Since we disabled auto-login from localStorage in loadSession, 
    // these changes will persist only for this session (via sessionStorage) + browser restart will wipe them unless we re-enable usage of localstorage override.
    // But user asked for "no persistence" on login? 
    // Actually, user said "ask for password every time".
    // So session-based updates are fine.

    sessionStorage.setItem('cb_user_sess', JSON.stringify(user));
    state.user = user; // Update memory

    updateUserMenu();
    if (user.type === 'seller') renderAdminDashboard();

    document.getElementById('edit-profile-modal').classList.add('hidden');
    showToast("Profile Updated Successfully!");
}

// --- Session Persistence ---
function loadSession() {
    try {
        // Force User Login (SessionStorage for active session only)
        const user = sessionStorage.getItem('cb_user_sess');
        if (user) state.user = JSON.parse(user);

        // --- STRATEGY: File Data (window.*) is the SOURCE OF TRUTH for existing items ---
        // We only use LocalStorage to find *NEWLY ADDED* items that aren't in the file.

        // 1. Admins
        state.admins = window.admins ? [...window.admins] : [];
        // We don't really support creating new admins via UI yet, so this is simple.

        // 2. Showrooms
        state.showrooms = window.showrooms ? [...window.showrooms] : [];
        const savedShowrooms = localStorage.getItem('cb_showrooms');
        if (savedShowrooms) {
            const parsed = JSON.parse(savedShowrooms);
            // Append ONLY items from storage that don't exist in the file
            parsed.forEach(p => {
                if (!state.showrooms.find(f => f.id === p.id)) {
                    state.showrooms.push(p);
                }
            });
        }

        // 3. Products
        state.products = window.products ? [...window.products] : [];
        // Ensure defaults have stock if missing in file
        state.products.forEach(p => { if (p.stock === undefined) p.stock = 5; });

        const savedProducts = localStorage.getItem('cb_products');
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            // Append ONLY items from storage (newly listed vehicles) that don't exist in file
            parsed.forEach(p => {
                const fileMatch = state.products.find(f => f.id === p.id);
                if (!fileMatch) {
                    state.products.push(p);
                } else {
                    // Update stock from storage for file items (so sales persist)
                    if (p.stock !== undefined) fileMatch.stock = p.stock;
                }
            });
        }

        // 4. Orders & Test Rides (Purely Dynamic)
        const savedOrders = localStorage.getItem('cb_orders');
        if (savedOrders) state.orders = JSON.parse(savedOrders);

        const savedTestRides = localStorage.getItem('cb_test_rides');
        if (savedTestRides) state.testRides = JSON.parse(savedTestRides);

        localStorage.setItem('cb_products', JSON.stringify(state.products));
        localStorage.setItem('cb_showrooms', JSON.stringify(state.showrooms));
        updateUserMenu();

    } catch (e) {
        console.error("Load Session Failed:", e);
        // Fallback
        state.products = window.products || [];
        state.showrooms = window.showrooms || [];
        state.admins = window.admins || [];
    }
}

function saveData() {
    localStorage.setItem('cb_showrooms', JSON.stringify(state.showrooms));
    localStorage.setItem('cb_products', JSON.stringify(state.products));
    localStorage.setItem('cb_orders', JSON.stringify(state.orders));
    localStorage.setItem('cb_test_rides', JSON.stringify(state.testRides));
}

function resetDatabase() {
    if (confirm("This will clear all your listed showrooms, vehicles, and orders and reset the site to use products.js data. Proceed?")) {
        localStorage.removeItem('cb_showrooms');
        localStorage.removeItem('cb_products');
        localStorage.removeItem('cb_orders');
        localStorage.removeItem('cb_test_rides');
        location.reload();
    }
}

function openLightbox(src) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    img.src = src;
    modal.classList.remove('hidden');
    setTimeout(() => img.classList.remove('scale-95'), 10);
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    img.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        img.src = '';
    }, 200);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const icons = {
        success: '<i class="fa-solid fa-circle-check text-green-400 text-xl"></i>',
        error: '<i class="fa-solid fa-circle-exclamation text-red-400 text-xl"></i>',
        info: '<i class="fa-solid fa-circle-info text-blue-400 text-xl"></i>'
    };

    toast.className = `flex items-center gap-3 bg-[#1a1a1a] border border-white/10 px-6 py-4 rounded shadow-2xl transform translate-x-full transition-all duration-500 pointer-events-auto min-w-[300px] border-l-4 ${type === 'success' ? 'border-l-green-500' : type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'}`;

    toast.innerHTML = `
        ${icons[type] || icons.info}
        <div>
            <p class="text-white font-bold text-sm leading-tight">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</p>
            <p class="text-gray-400 text-xs mt-0.5">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-x-full'), 10);

    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
