const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = mainNav.querySelectorAll('a');

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

// Scroll reveal animation with IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((el) => observer.observe(el));

// Booking form submit
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());

  formStatus.textContent = 'กำลังส่งคำขอ...';
  formStatus.style.color = '#0e5f9d';

  try {
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.errors?.join(' • ') || result.message;
      throw new Error(errorMessage || 'ไม่สามารถส่งข้อมูลได้');
    }

    formStatus.textContent = result.message;
    formStatus.style.color = '#1d7c41';
    bookingForm.reset();
  } catch (error) {
    formStatus.textContent = `เกิดข้อผิดพลาด: ${error.message}`;
    formStatus.style.color = '#c53929';
  }
});
