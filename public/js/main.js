console.log("JS loaded");

// ==============================
// MOBILE NAVBAR
// ==============================

const toggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ==============================
// FORM VALIDATION
// ==============================

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", (e) => {
    const email = document.querySelector("input[name='email']").value;

    if (!email.includes("@")) {
      e.preventDefault();
      alert("Invalid email");
    }
  });
}

// ==============================
// AUTO FILL SERVICE
// ==============================

const params = new URLSearchParams(window.location.search);
const service = params.get("service");

const input = document.querySelector("input[name='service']");

if (input && service) {
  input.value = service;
}

// ==============================
// DROPDOWN AUTO SUBMIT
// ==============================

const select = document.querySelector("select[name='category']");

if (select) {
  select.addEventListener("change", () => {
    select.form.submit();
  });
}