/* WCRC Full Prototype — Shared App Logic */
(function () {
  'use strict';

  // ---------- Storage helpers ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('wcrc_' + key);
        return v ? JSON.parse(v) : fallback;
      } catch { return fallback; }
    },
    set(key, val) {
      localStorage.setItem('wcrc_' + key, JSON.stringify(val));
    },
    remove(key) {
      localStorage.removeItem('wcrc_' + key);
    }
  };

  // ---------- Products catalogue ----------
  const PRODUCTS = [
    { id: 'tee', name: 'Club Running Tee', price: 320, emoji: '👕', sizes: ['S', 'M', 'L', 'XL'], stock: 24 },
    { id: 'singlet', name: 'Singlet – Race Edition', price: 280, emoji: '🎽', sizes: ['XS', 'S', 'M', 'L'], stock: 18 },
    { id: 'cap', name: 'WCRC Cap', price: 180, emoji: '🧢', sizes: ['One size'], stock: 40 },
    { id: 'hoodie', name: 'Club Hoodie', price: 520, emoji: '🧥', sizes: ['S', 'M', 'L', 'XL'], stock: 12 },
    { id: 'shorts', name: 'Training Shorts', price: 250, emoji: '🩳', sizes: ['S', 'M', 'L', 'XL'], stock: 20 },
    { id: 'socks', name: 'Club Socks (pair)', price: 95, emoji: '🧦', sizes: ['M', 'L'], stock: 50 },
    { id: 'bottle', name: 'WCRC Water Bottle', price: 150, emoji: '🧴', sizes: ['One size'], stock: 30 },
    { id: 'buff', name: 'Neck Buff', price: 120, emoji: '🧣', sizes: ['One size'], stock: 25 }
  ];

  // ---------- Events data ----------
  const EVENTS = [
    {
      id: 'nmc-sep',
      title: 'NMC / WCRC Social Run',
      date: '2026-09-12',
      displayDate: '12 Sep 2026',
      time: '07:00',
      location: 'Namibia Padel',
      type: 'Social',
      feeMember: 50,
      feeGuest: 80,
      description: 'Funded by Namibia Medical Care and organised by Windhoek City Runners Club. A friendly social run open to all levels. Distance options will be confirmed closer to the date. Water stations and post-run snacks provided.',
      distances: ['5 km', '10 km']
    },
    {
      id: '5x5',
      title: '5 × 5 Challenge',
      date: '2026-01-14',
      displayDate: '14 Jan 2026',
      time: '06:30',
      location: 'Windhoek (various)',
      type: 'Challenge',
      feeMember: 0,
      feeGuest: 30,
      description: 'Five consecutive days of 5 km runs. Build consistency, track your progress and connect with fellow members. Self-timed with optional Strava verification.',
      distances: ['5 km daily']
    },
    {
      id: 'city-strides',
      title: 'City Strides Half Marathon Prep',
      date: '2026-10-18',
      displayDate: '18 Oct 2026',
      time: '06:00',
      location: 'Avis Dam start',
      type: 'Race',
      feeMember: 150,
      feeGuest: 220,
      description: 'Club championship distance run. Chip timing, medals and category prizes. Members receive discounted entry.',
      distances: ['10 km', '21.1 km']
    },
    {
      id: 'nmc-jun',
      title: 'NMC / WCRC Social Run',
      date: '2026-06-27',
      displayDate: '27 Jun 2026',
      time: '07:00',
      location: 'Windhoek',
      type: 'Social',
      feeMember: 50,
      feeGuest: 80,
      description: 'Another NMC-sponsored social run. All levels welcome. Perfect for building base mileage and meeting new club mates.',
      distances: ['5 km', '8 km']
    },
    {
      id: '7x7-spring',
      title: 'WCRC Spring 7×7 Challenge',
      date: '2026-09-01',
      displayDate: '01 Sep 2026',
      time: '06:00',
      location: 'Self-timed / Windhoek routes',
      type: 'Challenge',
      feeMember: 0,
      feeGuest: 40,
      description: 'Seven consecutive days of 7 km. Push consistency through spring. Optional Strava club challenge verification.',
      distances: ['7 km daily']
    },
    {
      id: 'power-run',
      title: 'NamPower PowerRun Tribute',
      date: '2026-07-25',
      displayDate: '25 Jul 2026',
      time: '06:30',
      location: 'Hage Geingob Rugby Stadium',
      type: 'Race',
      feeMember: 120,
      feeGuest: 180,
      description: 'Community race celebrating NamPower milestones. Multiple distances, medals and a festive finish-line atmosphere.',
      distances: ['5 km', '10 km', '15 km']
    },
    {
      id: 'ya-toivo',
      title: 'Ya Toivo Social Run',
      date: '2026-11-08',
      displayDate: '08 Nov 2026',
      time: '07:00',
      location: 'Windhoek',
      type: 'Social',
      feeMember: 40,
      feeGuest: 70,
      description: 'Community social run in the spirit of previous Ya Toivo collaborations. Inclusive pacing groups and post-run refreshments.',
      distances: ['5 km', '10 km']
    },
    {
      id: 'year-end',
      title: 'WCRC Year-End Fun Run',
      date: '2026-12-12',
      displayDate: '12 Dec 2026',
      time: '07:30',
      location: 'City centre loop',
      type: 'Social',
      feeMember: 0,
      feeGuest: 50,
      description: 'Celebrate the season with a relaxed fun run, member awards and club picnic. Family-friendly.',
      distances: ['3 km', '5 km']
    }
  ];

  // ---------- Cart ----------
  function getCart() {
    return store.get('cart', []);
  }
  function saveCart(cart) {
    store.set('cart', cart);
    updateCartUI();
  }
  function addToCart(productId, size, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(i => i.id === productId && i.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, name: product.name, price: product.price, emoji: product.emoji, size, qty });
    }
    saveCart(cart);
    openCart();
  }
  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }
  function cartTotal() {
    return getCart().reduce((s, i) => s + i.price * i.qty, 0);
  }
  function cartCount() {
    return getCart().reduce((s, i) => s + i.qty, 0);
  }

  function updateCartUI() {
    const countEls = document.querySelectorAll('.cart-count');
    const n = cartCount();
    countEls.forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'grid' : 'none';
    });
    const itemsEl = document.getElementById('cart-items');
    const footerEl = document.getElementById('cart-footer');
    if (!itemsEl) return;
    const cart = getCart();
    if (cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br><a href="shop.html" style="color:var(--green-600);font-weight:600;">Browse the shop →</a></div>';
      if (footerEl) footerEl.classList.add('hidden');
    } else {
      itemsEl.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji}</div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="meta">Size: ${item.size} · Qty: ${item.qty}</div>
            <button class="cart-remove" data-idx="${idx}">Remove</button>
          </div>
          <div class="cart-item-price">N$ ${item.price * item.qty}</div>
        </div>
      `).join('');
      itemsEl.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(+btn.dataset.idx));
      });
      if (footerEl) {
        footerEl.classList.remove('hidden');
        const totalEl = document.getElementById('cart-total-amount');
        if (totalEl) totalEl.textContent = 'N$ ' + cartTotal();
      }
    }
  }

  function openCart() {
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
  }
  function closeCart() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
  }

  // ---------- Auth (simulated) ----------
  function getUser() {
    return store.get('user', null);
  }
  function setUser(user) {
    store.set('user', user);
    updateAuthUI();
  }
  function logout() {
    store.remove('user');
    updateAuthUI();
    window.location.href = 'index.html';
  }
  function updateAuthUI() {
    const user = getUser();
    document.querySelectorAll('[data-auth="guest"]').forEach(el => {
      el.style.display = user ? 'none' : '';
    });
    document.querySelectorAll('[data-auth="member"]').forEach(el => {
      el.style.display = user ? '' : 'none';
    });
    document.querySelectorAll('[data-user-name]').forEach(el => {
      if (user) el.textContent = user.firstName || user.email;
    });
  }

  // ---------- Membership applications (simulated admin workflow) ----------
  const SEED_APPLICATIONS = [
    { id: 'seed-1', firstName: 'John', lastName: 'Shikongo', email: 'john.shikongo@example.com', phone: '+264 81 111 2222', type: 'adult', status: 'pending', appliedAt: '22 Aug 2026' },
    { id: 'seed-2', firstName: 'Lina', lastName: 'Amukugo', email: 'lina.amukugo@example.com', phone: '+264 81 222 3333', type: 'junior', status: 'pending', appliedAt: '21 Aug 2026', indemnity: true },
    { id: 'seed-3', firstName: 'Anna', lastName: 'Nangolo', email: 'anna@example.com', phone: '+264 81 123 4567', type: 'adult', status: 'active', appliedAt: '10 Mar 2024', memberNumber: 'WCRC-2026-0042' },
    { id: 'seed-4', firstName: 'Petrus', lastName: 'Hamukwaya', email: 'petrus@example.com', phone: '+264 81 333 4444', type: 'adult', status: 'lapsed', appliedAt: '05 Jan 2025', memberNumber: 'WCRC-2025-0117' }
  ];
  function getApplications() {
    let apps = store.get('applications', null);
    if (!apps) {
      apps = SEED_APPLICATIONS.slice();
      store.set('applications', apps);
    }
    return apps;
  }
  function addApplication(app) {
    const apps = getApplications();
    apps.unshift(app);
    store.set('applications', apps);
    return app;
  }
  function updateApplicationStatus(id, status) {
    const apps = getApplications();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return null;
    apps[idx].status = status;
    if (status === 'active' && !apps[idx].memberNumber) {
      apps[idx].memberNumber = 'WCRC-2026-' + String(1000 + Math.floor(Math.random() * 9000));
    }
    store.set('applications', apps);
    // Keep the currently logged-in demo user's own status in sync (single-browser UAT demo)
    const user = getUser();
    if (user && user.email && user.email.toLowerCase() === apps[idx].email.toLowerCase()) {
      user.status = status;
      if (apps[idx].memberNumber) user.memberNumber = apps[idx].memberNumber;
      setUser(user);
    }
    return apps[idx];
  }

  // ---------- Newsletter (simulated) ----------
  function subscribe(email) {
    const list = store.get('subscribers', []);
    if (!list.includes(email)) {
      list.push(email);
      store.set('subscribers', list);
    }
    return true;
  }

  // ---------- Mobile menu ----------
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // ---------- Countdown ----------
  function initCountdown(targetIso) {
    const target = new Date(targetIso).getTime();
    const els = { d: document.getElementById('cd-d'), h: document.getElementById('cd-h'), m: document.getElementById('cd-m'), s: document.getElementById('cd-s') };
    if (!els.d) return;
    function tick() {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000); diff %= 86400000;
      const h = Math.floor(diff / 3600000); diff %= 3600000;
      const m = Math.floor(diff / 60000); diff %= 60000;
      const s = Math.floor(diff / 1000);
      els.d.textContent = String(d).padStart(2, '0');
      els.h.textContent = String(h).padStart(2, '0');
      els.m.textContent = String(m).padStart(2, '0');
      els.s.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Form helpers ----------
  function validateForm(form) {
    let ok = true;
    form.querySelectorAll('[required]').forEach(input => {
      const group = input.closest('.form-group');
      const empty = !input.value.trim();
      if (group) group.classList.toggle('error', empty);
      if (empty) ok = false;
    });
    return ok;
  }

  // ---------- Public API ----------
  window.WCRC = {
    PRODUCTS,
    EVENTS,
    getCart,
    addToCart,
    removeFromCart,
    cartTotal,
    cartCount,
    openCart,
    closeCart,
    getUser,
    setUser,
    logout,
    updateCartUI,
    updateAuthUI,
    validateForm,
    store,
    initCountdown,
    getApplications,
    addApplication,
    updateApplicationStatus,
    subscribe
  };

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateCartUI();
    updateAuthUI();

    // Cart open/close
    document.querySelectorAll('[data-open-cart]').forEach(el => el.addEventListener('click', openCart));
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      if (cartCount() === 0) return;
      alert('Prototype: Payment would be processed via DPO Pay here.\n\nOrder total: N$ ' + cartTotal() + '\n\nIn the live system this would redirect to the secure payment gateway and create an order record.');
      saveCart([]);
      closeCart();
    });

    // Logout
    document.querySelectorAll('[data-logout]').forEach(el => el.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    }));

    // Add-to-cart buttons on shop
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.addCart;
        const sizeSelect = btn.closest('.product-card')?.querySelector('select');
        const size = sizeSelect ? sizeSelect.value : 'One size';
        addToCart(id, size);
      });
    });

    // Footer newsletter subscribe forms
    document.querySelectorAll('[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !input.value.trim()) return;
        subscribe(input.value.trim());
        input.value = '';
        const ok = form.querySelector('.footer-newsletter-ok');
        if (ok) ok.classList.remove('hidden');
      });
    });
  });
})();
