/* =====================================================
   ASBILY SIGNIN PAGE
   Complete JavaScript with Firebase Integration
===================================================== */

import { auth } from "../auth/firebase.js";
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  signOut 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
  =================================================== */

  const header = document.getElementById("header");
  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("navigation");
  const signinForm = document.getElementById("signinForm");
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
     FORM VALIDATION & FIREBASE AUTHENTICATION
  =================================================== */

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;

      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const remember = document.getElementById("remember");

      // Clear previous error messages
      document.querySelectorAll(".error-msg").forEach(el => {
        el.textContent = "";
        el.style.display = "none";
      });

      if (!email.value.trim() || !validateEmail(email.value)) {
        showError("emailError", "Please enter a valid email address");
        isValid = false;
      }

      if (!password.value) {
        showError("passwordError", "Password is required");
        isValid = false;
      }

      if (!isValid) return;

      // Disable button & show loading state
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Signing In...";

      try {
        // Set persistence based on remember checkbox
        const persistence = remember.checked ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistence);

        // Firebase Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
        const user = userCredential.user;

        // Check Email Verification Status
        if (!user.emailVerified) {
          // If email is not verified, redirect to verify-email page
          window.location.href = "/verify-email/";
          return;
        }

        // Successfully verified & signed in -> Redirect to Dashboard
        window.location.href = "https://myaccount.asbily.com/";

      } catch (error) {
        console.error("Sign In Error:", error.code, error.message);
        let errorMsg = "Failed to sign in. Please check your credentials.";

        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          errorMsg = "Invalid email or password.";
        } else if (error.code === "auth/too-many-requests") {
          errorMsg = "Access to this account has been temporarily disabled due to many failed login attempts. Try again later.";
        } else if (error.code === "auth/invalid-email") {
          errorMsg = "Invalid email format.";
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
