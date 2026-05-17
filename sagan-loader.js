(function () {
  const BASE_URL = "https://kidescreation.github.io/sagan-products/";

  function executeSaganScripts(root) {
    const scripts = root.querySelectorAll("script");

    scripts.forEach(function (oldScript) {
      const newScript = document.createElement("script");

      Array.from(oldScript.attributes).forEach(function (attr) {
        newScript.setAttribute(attr.name, attr.value);
      });

      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function getPageSlug() {
    let pathname = "";

    try { pathname = window.top.location.pathname; } catch (e) {}
    if (!pathname || pathname === "/") {
      try { pathname = window.parent.location.pathname; } catch (e) {}
    }
    if (!pathname || pathname === "/") {
      try { pathname = new URL(document.referrer).pathname; } catch (e) {}
    }
    if (!pathname || pathname === "/") {
      pathname = window.location.pathname;
    }

    return pathname.split("/").filter(Boolean).pop().toLowerCase();
  }

  async function loadSaganProduct() {
    const root = document.getElementById("sagan-product-root");
    if (!root) return;

    const pageSlug = getPageSlug();

    try {
      const indexResponse = await fetch(BASE_URL + "index.json?v=" + Date.now());
      const index = await indexResponse.json();

      const productSlug = Object.keys(index)
        .sort((a, b) => b.length - a.length)
        .find(slug => pageSlug.startsWith(slug));

      if (!productSlug) return;

      const productResponse = await fetch(BASE_URL + index[productSlug] + "?v=" + Date.now());
      const product = await productResponse.json();

      root.innerHTML = product.html || "";

      setTimeout(function () {
        executeSaganScripts(root);
        initSaganAddToCart(root);
      }, 100);

    } catch (error) {
      console.error("SAGAN : erreur chargement produit :", error);
    }
  }

  function findNativeAddToCartButton() {
    const SELECTOR = 'button[data-qa="productsection-btn-addtobag"]';

    try {
      const nativeButton = window.parent.document.querySelector(SELECTOR);
      if (nativeButton) return nativeButton;
    } catch (e) {}

    try {
      const nativeButton = document.querySelector(SELECTOR);
      if (nativeButton) return nativeButton;
    } catch (e) {}

    return null;
  }

  function initSaganAddToCart(root) {
    root.addEventListener("click", function (event) {
      const fakeButton = event.target.closest(".sagan-carte-button");
      if (!fakeButton) return;

      const nativeButton = findNativeAddToCartButton();

      if (nativeButton && !nativeButton.disabled) {
        nativeButton.click();

        setTimeout(function () {
          fakeButton.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 700);

        return;
      }

      if (nativeButton) {
        nativeButton.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        return;
      }

      console.warn("SAGAN : bouton natif Ajouter au panier introuvable.");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSaganProduct);
  } else {
    loadSaganProduct();
  }
})();