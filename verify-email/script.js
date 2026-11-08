/* =====================================================
   ASBILY VERIFY EMAIL PAGE
   Complete JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
  =================================================== */

  const header = document.getElementById("header");
  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("navigation");
  const verifyForm = document.getElementById("verifyForm");
  const resendBtn = document.getElementById("resendBtn");


  /* ===================================================
     MOBILE MENU
  =================================================== */

  function closeMenu() {
    if (!menuButton || !navigation) return;

    menuButton.classList.remove("open");
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuButton || !navigation) return;

    menuButton.classList.add("open");
    navigation.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        navigation.classList.contains("open") &&
        !navigation.contains(target) &&
        !menuButton.contains(target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

  }


  /* ===================================================
     HEADER SCROLL EFFECT
  =================================================== */

  function handleHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeader, { passive: true });
  handleHeader();


  /* ===================================================
     FORM VALIDATION & HANDLING
  =================================================== */

  if (verifyForm) {
    verifyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;
      const otpCode = document.getElementById("otpCode");

      // Clear previous error messages
      document.querySelectorAll(".error-msg").forEach(el => el.style.display = "none");

      if (otpCode.value.trim().length !== 6) {
        showError("otpError", "Please enter a valid 6-digit verification code");
        isValid = false;
      }

      if (isValid) {
        showCustomModal(
          "Success", 
          "Your email has been successfully verified!",
          () => {
            window.location.href = "/signin/";
          }
        );
        verifyForm.reset();
      }
    });
  }

  if (resendBtn) {
    resendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showCustomModal(
        "Code Resent", 
        "A new verification code has been sent to your email address."
      );
    });
  }

  function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  }

  // Custom Modal Function to keep website theme & colors exact
  function showCustomModal(title, message, callback) {
    const existingOverlay = document.getElementById("customModalOverlay");
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement("div");
    overlay.id = "customModalOverlay";
    overlay.className = "custom-modal-overlay";

    overlay.innerHTML = `
      <div class="custom-modal">
        <h3>${title}</h3>
        <p>${message}</p>
        <button type="button" class="custom-modal-btn" id="modalCloseBtn">OK</button>
      </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add("active");
    }, 10);

    const closeModal = () => {
      overlay.classList.remove("active");
      setTimeout(() => {
        overlay.remove();
        if (callback) callback();
      }, 300);
    };

    const closeBtn = document.getElementById("modalCloseBtn");
    closeBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }


  /* ===================================================
     REVEAL ANIMATION
  =================================================== */

  const revealElements = document.querySelectorAll(".section, .global-box");

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* External Links Safety */
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

});
