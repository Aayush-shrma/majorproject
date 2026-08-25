// ── 1. THEME SWITCHER (DARK / LIGHT MODE) ──
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  if (themeToggleBtn && themeIcon) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('wanderlust_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun text-warning';
    } else {
      themeIcon.className = 'fa-solid fa-moon text-secondary';
    }
  }
});

// ── 2. FLOATING TOAST NOTIFICATION HELPER ──
function showToast(message, icon = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'modern-toast';
  toast.innerHTML = `${icon ? `<i class="${icon}"></i>` : ''}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ── 3. WISHLIST AJAX TOGGLE ──
async function toggleWishlist(event, listingId, btnElement) {
  event.preventDefault();
  event.stopPropagation();

  try {
    const res = await fetch(`/listings/${listingId}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status === 401) {
      window.location.href = '/login';
      return;
    }

    const data = await res.json();
    if (data.success) {
      const heartIcon = btnElement.querySelector('i');
      if (data.saved) {
        btnElement.classList.add('is-saved');
        if (heartIcon) heartIcon.className = 'fa-solid fa-heart';
        showToast('❤️ Saved to your Wishlist');
      } else {
        btnElement.classList.remove('is-saved');
        if (heartIcon) heartIcon.className = 'fa-regular fa-heart';
        showToast('🤍 Removed from Wishlist');
      }

      // Update badge counter in navbar if exists
      const badge = document.getElementById('navWishlistBadge');
      if (badge) {
        if (data.count > 0) {
          badge.textContent = data.count;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    }
  } catch (err) {
    showToast('⚠️ Unable to update wishlist. Please try again.');
  }
}

// ── 4. LIVE BOOKING PRICE CALCULATOR ──
function initBookingCalculator(pricePerNight) {
  const checkInInput = document.getElementById('calcCheckIn');
  const checkOutInput = document.getElementById('calcCheckOut');
  const guestsInput = document.getElementById('calcGuests');
  
  const nightsLabel = document.getElementById('calcNightsLabel');
  const basePriceLabel = document.getElementById('calcBasePrice');
  const cleaningFeeLabel = document.getElementById('calcCleaningFee');
  const serviceFeeLabel = document.getElementById('calcServiceFee');
  const gstLabel = document.getElementById('calcGst');
  const totalPriceLabel = document.getElementById('calcTotalPrice');
  const reserveBtn = document.getElementById('reserveSubmitBtn');

  if (!checkInInput || !checkOutInput) return;

  // Set min dates (today and tomorrow)
  const today = new Date().toISOString().split('T')[0];
  checkInInput.min = today;

  function recalculate() {
    const checkInVal = checkInInput.value;
    const checkOutVal = checkOutInput.value;

    if (!checkInVal || !checkOutVal) return;

    const startDate = new Date(checkInVal);
    const endDate = new Date(checkOutVal);

    if (endDate <= startDate) {
      if (reserveBtn) reserveBtn.disabled = true;
      return;
    }

    if (reserveBtn) reserveBtn.disabled = false;

    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const basePrice = pricePerNight * nights;
    const cleaningFee = 500;
    const serviceFee = Math.round(basePrice * 0.05);
    const gstAmount = Math.round((basePrice + cleaningFee + serviceFee) * 0.18);
    const grandTotal = basePrice + cleaningFee + serviceFee + gstAmount;

    if (nightsLabel) nightsLabel.textContent = `₹${pricePerNight.toLocaleString('en-IN')} x ${nights} night${nights > 1 ? 's' : ''}`;
    if (basePriceLabel) basePriceLabel.textContent = `₹${basePrice.toLocaleString('en-IN')}`;
    if (cleaningFeeLabel) cleaningFeeLabel.textContent = `₹${cleaningFee.toLocaleString('en-IN')}`;
    if (serviceFeeLabel) serviceFeeLabel.textContent = `₹${serviceFee.toLocaleString('en-IN')}`;
    if (gstLabel) gstLabel.textContent = `₹${gstAmount.toLocaleString('en-IN')}`;
    if (totalPriceLabel) totalPriceLabel.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  checkInInput.addEventListener('change', () => {
    if (checkInInput.value) {
      const minOut = new Date(checkInInput.value);
      minOut.setDate(minOut.getDate() + 1);
      checkOutInput.min = minOut.toISOString().split('T')[0];
      if (!checkOutInput.value || new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
        checkOutInput.value = minOut.toISOString().split('T')[0];
      }
    }
    recalculate();
  });

  checkOutInput.addEventListener('change', recalculate);
  
  // Initial calculate
  recalculate();
}

// ── 5. CLIENT FORM VALIDATION ──
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();
