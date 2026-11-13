/* =====================================================
   ASBILY RESET PASSWORD PAGE
   Complete JavaScript with Firebase Authentication Integration
===================================================== */

import { auth } from "../auth/firebase.js";
import { confirmPasswordReset } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
  =================================================== */

  const header = document.getElementById("header");
  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("navigation");
  const resetForm = document.getElementById("resetForm");
  const submitBtn = document.getElementById("submitBtn");

  // Extract oobCode from URL query parameters (sent by Firebase email link)
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode");


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
     FORM VALIDATION & FIREBASE PASSWORD CONFIRMATION
  =================================================== */

  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;

      const newPassword = document.getElementById("newPassword");
      const confirmPassword = document.getElementById("confirmPassword");

      // Clear previous error messages
      document.querySelectorAll(".error-msg").forEach(el => {
        el.textContent = "";
        el.style.display = "none";
      });

      if (!oobCode) {
        showError("generalError", "Invalid or missing password reset link code. Please request a new link.");
        return;
      }

      if (newPassword.value.length < 8) {
        showError("newPasswordError", "Password must be at least 8 characters");
        isValid = false;
      }

      if (newPassword.value !== confirmPassword.value) {
        showError("confirmPasswordError", "Passwords do not match");
        isValid = false;
      }

      if (!isValid) return;

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Updating Password...";

      try {
        // Confirm password reset with Firebase Action Code
        await confirmPasswordReset(auth, oobCode, newPassword.value);

        showCustomModal(
          "Success", 
          "Your password has been updated successfully!",
          () => {
            window.location.href = "/signin/";
          }
        );
        resetForm.reset();

      } catch (error) {
        console.error("Password Reset Confirmation Error:", error.code, error.message);
        let errorMsg = "Failed to update password. The link may have expired.";

        if (error.code === "auth/expired-action-code") {
          errorMsg = "The password reset link has expired. Please request a new one.";
        } else if (error.code === "auth/invalid-action-code") {
          errorMsg = "The password reset link is invalid or has already been used.";
        } else if (error.code === "auth/weak-password") {
          errorMsg = "Password is too weak. Choose a stronger password.";
        }

        showError("generalError", errorMsg);
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
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
