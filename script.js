/* =====================================================
   ASBILY ACCOUNT PAGE
   Complete JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
  =================================================== */

  const header =
    document.getElementById("header");

  const menuButton =
    document.getElementById("menuButton");

  const navigation =
    document.getElementById("navigation");

  const backToTop =
    document.getElementById("backToTop");

  const currentYear =
    document.getElementById("currentYear");


  /* ===================================================
     CURRENT YEAR
  =================================================== */

  if (currentYear) {
    currentYear.textContent =
      new Date().getFullYear();
  }


  /* ===================================================
     MOBILE MENU
  =================================================== */

  function closeMenu() {

    if (!menuButton || !navigation) {
      return;
    }

    menuButton.classList.remove("open");

    navigation.classList.remove("open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "menu-open"
    );
  }


  function openMenu() {

    if (!menuButton || !navigation) {
      return;
    }

    menuButton.classList.add("open");

    navigation.classList.add("open");

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.classList.add(
      "menu-open"
    );
  }


  if (menuButton && navigation) {

    menuButton.addEventListener(
      "click",
      () => {

        const isOpen =
          navigation.classList.contains("open");

        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }

      }
    );


    /* Close when navigation link is clicked */

    navigation
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {
            closeMenu();
          }
        );

      });


    /* Close when clicking outside */

    document.addEventListener(
      "click",
      (event) => {

        const target = event.target;

        if (
          navigation.classList.contains("open") &&
          !navigation.contains(target) &&
          !menuButton.contains(target)
        ) {

          closeMenu();

        }

      }
    );


    /* Close with Escape */

    document.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Escape") {
          closeMenu();
        }

      }
    );

  }


  /* ===================================================
     SCROLL TO TOP FOR LOGO AND HOME
  =================================================== */

  function scrollToTop(event) {
    if (event) {
      event.preventDefault();
    }

    closeMenu();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", window.location.pathname);
    }
  }

  // Handle all logos (header and footer)
  document.querySelectorAll(".logo").forEach((logoEl) => {
    logoEl.addEventListener("click", scrollToTop);
  });

  // Handle Home link and top links
  document.querySelectorAll('a[href="#top"], a[href="#home"], #navHome').forEach((homeEl) => {
    homeEl.addEventListener("click", scrollToTop);
  });


  /* ===================================================
     HEADER SCROLL EFFECT & ACTIVE NAVIGATION (OPTIMIZED)
  =================================================== */

  function handleHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  const navigationLinks = document.querySelectorAll('.navigation a[href^="#"]');
  const sections = [];

  navigationLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const section = document.querySelector(id);
    if (section) {
      sections.push({ section, link });
    }
  });

  function updateActiveNavigation() {
    if (!sections.length) return;

    if (window.scrollY < 120) {
      navigationLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector('.navigation a[href="#top"], .navigation a[href="#home"], #navHome');
      if (homeLink) homeLink.classList.add("active");
      return;
    }

    const position = window.scrollY + 150;
    let current = null;

    sections.forEach((item) => {
      if (item.section.offsetTop <= position) {
        current = item;
      }
    });

    navigationLinks.forEach((link) => link.classList.remove("active"));
    if (current) {
      current.link.classList.add("active");
    }
  }

  // Unified rAF-throttled scroll listener for maximum performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleHeader();
        updateActiveNavigation();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  handleHeader();
  updateActiveNavigation();


  /* ===================================================
     BACK TO TOP
  =================================================== */

  if (backToTop) {

    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* ===================================================
     REVEAL ANIMATION
  =================================================== */

  const revealElements =
    document.querySelectorAll(
      ".section, .story-card, .info-card, " +
      ".service-card, .values-grid article, " +
      ".audience-grid > div, .process-item, " +
      ".product-card, .ecosystem-grid > *, " +
      ".roadmap-item, .founder-card, " +
      ".company-information > div, .timeline-item"
    );


  revealElements.forEach((element) => {

    element.classList.add("reveal");

  });


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

              observerInstance.unobserve(
                entry.target
              );

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


  /* ===================================================
     EXTERNAL LINKS
  =================================================== */

  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach((link) => {

      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );

    });


  /* ===================================================
     RESIZE HANDLER
  =================================================== */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 860
      ) {

        closeMenu();

      }

    }
  );

});
