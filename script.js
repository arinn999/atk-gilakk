// Data Produk Alat Tulis
const products = [
    { id: 1, name: "Pulpen Gel Hitam 0.5mm", price: 5000, icon: "🖊️" },
    { id: 2, name: "Buku Tulis Campus (58 Lembar)", price: 8500, icon: "📓" },
    { id: 3, name: "Pensil Kayu 2B (Isi 12)", price: 18000, icon: "✏️" },
    { id: 4, name: "Penghapus Karet Putih", price: 3000, icon: "🧼" },
    { id: 5, name: "Penggaris Besi 30cm", price: 7500, icon: "📏" },
    { id: 6, name: "Stabilo Highlighter Warna", price: 9000, icon: "🖍️" },
    { id: 7, name: "Gunting Kertas Stainless", price: 12000, icon: "✂️" },
    { id: 8, name: "Sticky Notes Warna-Warni", price: 6500, icon: "🗒️" }
];

// State Aplikasi
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = localStorage.getItem('user') || null;

// Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// Render Daftar Produk
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <div class="product-icon">${product.icon}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatRupiah(product.price)}</p>
            </div>
            <button class="btn-primary" onclick="addToCart(${product.id})">+ Tambah ke Keranjang</button>
        </div>
    `).join('');
}

// Tambah ke Keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

// Ubah Jumlah Item di Keranjang
function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

// Update Tampilan & Penyimpanan Keranjang
function updateCartUI() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = totalCount;

    const cartItemsContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#777;">Keranjang masih kosong.</p>';
        document.getElementById('cart-total').innerText = formatRupiah(0);
        return;
    }

    let totalPrice = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const subtotal = item.price * item.qty;
        totalPrice += subtotal;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${formatRupiah(item.price)} x ${item.qty}</small>
                </div>
                <div class="cart-controls">
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = formatRupiah(totalPrice);
}

// Sistem Login & Logout
function updateAuthUI() {
    const btnLogin = document.getElementById('btn-login');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (currentUser) {
        btnLogin.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.innerText = `Halo, ${currentUser}`;
    } else {
        btnLogin.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = username;
        localStorage.setItem('user', currentUser);
        updateAuthUI();
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('login-form').reset();
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('user');
    updateAuthUI();
});

// Fitur Beli (Checkout)
document.getElementById('btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong!');
        return;
    }

    if (!currentUser) {
        alert('Silakan login terlebih dahulu sebelum melakukan pembelian.');
        document.getElementById('cart-modal').classList.add('hidden');
        document.getElementById('login-modal').classList.remove('hidden');
        return;
    }

    const totalBayar = document.getElementById('cart-total').innerText;
    alert(`Terima kasih ${currentUser}!\nPesanan Anda sebesar ${totalBayar} berhasil diproses.`);
    
    cart = [];
    updateCartUI();
    document.getElementById('cart-modal').classList.add('hidden');
});

// Kontrol Modal
document.getElementById('btn-login').addEventListener('click', () => {
    document.getElementById('login-modal').classList.remove('hidden');
});
document.getElementById('close-login').addEventListener('click', () => {
    document.getElementById('login-modal').classList.add('hidden');
});

document.getElementById('btn-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.remove('hidden');
});
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.add('hidden');
});

// Inisialisasi Awal
renderProducts();
updateCartUI();
updateAuthUI();
