/* =====================================================
   ASBILY VERIFY EMAIL PAGE
   Complete JavaScript with Firebase Authentication Integration
===================================================== */

import { auth } from "../auth/firebase.js";
import { 
  onAuthStateChanged, 
  sendEmailVerification, 
  signOut 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
  =================================================== */

  const header = document.getElementById("header");
  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("navigation");
  const checkVerifiedBtn = document.getElementById("checkVerifiedBtn");
  const resendBtn = document.getElementById("resendBtn");
  const userEmailText = document.getElementById("userEmailText");

  let currentUser = null;


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
     FIREBASE AUTH STATE & VERIFICATION CHECK
  =================================================== */

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      if (userEmailText) {
        userEmailText.textContent = user.email;
      }

      // If already verified, redirect directly to email-verified or dashboard
      if (user.emailVerified) {
        window.location.href = "/email-verified/";
      }
    } else {
      // If no user is logged in, redirect to signin page
      window.location.href = "/signin/";
    }
  });


  /* ===================================================
     CHECK VERIFICATION & RESEND LOGIC
  =================================================== */

  if (checkVerifiedBtn) {
    checkVerifiedBtn.addEventListener("click", async () => {
      if (!currentUser) return;

      checkVerifiedBtn.disabled = true;
      checkVerifiedBtn.textContent = "Checking Status...";

      try {
        // Refresh user token to get latest emailVerified status from Firebase servers
        await currentUser.reload();
        
        if (currentUser.emailVerified) {
          showCustomModal(
            "Email Verified!", 
            "Your email has been successfully verified.",
            () => {
              window.location.href = "/email-verified/";
            }
          );
        } else {
          showCustomModal(
            "Not Verified Yet", 
            "Please check your inbox and click the verification link sent to your email."
          );
          checkVerifiedBtn.disabled = false;
          checkVerifiedBtn.textContent = "I Have Verified — Continue";
        }
      } catch (error) {
        console.error("Verification check error:", error);
        showCustomModal("Error", "Could not check verification status. Please try again.");
        checkVerifiedBtn.disabled = false;
        checkVerifiedBtn.textContent = "I Have Verified — Continue";
      }
    });
  }

  if (resendBtn) {
    resendBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!currentUser) return;

      try {
        await sendEmailVerification(currentUser);
        showCustomModal(
          "Link Resent", 
          "A new verification link has been sent to your email address."
        );
      } catch (error) {
        console.error("Resend error:", error.code, error.message);
        let errorMsg = "Failed to resend verification email. Please try again later.";
        if (error.code === "auth/too-many-requests") {
          errorMsg = "Too many requests. Please wait before trying again.";
        }
        showCustomModal("Error", errorMsg);
      }
    });
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
