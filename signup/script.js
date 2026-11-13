/* =====================================================
   ASBILY SIGNUP PAGE
   Complete JavaScript with Firebase Authentication Integration
===================================================== */

import { auth } from "../auth/firebase.js";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
  =================================================== */

  const header = document.getElementById("header");
  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("navigation");
  const signupForm = document.getElementById("signupForm");
  const submitBtn = document.getElementById("submitBtn");


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
     FORM VALIDATION & FIREBASE SIGNUP
  =================================================== */

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs
      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirmPassword");
      const terms = document.getElementById("terms");

      // Clear previous error messages
      document.querySelectorAll(".error-msg").forEach(el => {
        el.textContent = "";
        el.style.display = "none";
      });

      if (!firstName.value.trim()) {
        showError("firstNameError", "First name is required");
        isValid = false;
      }

      if (!lastName.value.trim()) {
        showError("lastNameError", "Last name is required");
        isValid = false;
      }

      if (!email.value.trim() || !validateEmail(email.value)) {
        showError("emailError", "Please enter a valid email address");
        isValid = false;
      }

      if (password.value.length < 8) {
        showError("passwordError", "Password must be at least 8 characters");
        isValid = false;
      }

      if (password.value !== confirmPassword.value) {
        showError("confirmPasswordError", "Passwords do not match");
        isValid = false;
      }

      if (!terms.checked) {
        showError("termsError", "You must accept the terms and privacy policy");
        isValid = false;
      }

      if (!isValid) return;

      // Disable submit button & show loading text
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating Account...";

      try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value);
        const user = userCredential.user;

        // Update user profile with full name
        const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`;
        await updateProfile(user, {
          displayName: fullName
        });

        // Send Email Verification
        await sendEmailVerification(user);

        // Redirect to Verify Email page
        window.location.href = "/verify-email/";

      } catch (error) {
        console.error("Sign Up Error:", error.code, error.message);
        let errorMsg = "Failed to create account. Please try again.";

        if (error.code === "auth/email-already-in-use") {
          errorMsg = "This email address is already registered.";
        } else if (error.code === "auth/invalid-email") {
          errorMsg = "Invalid email address format.";
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

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
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
