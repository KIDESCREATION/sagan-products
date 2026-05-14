(function () {
  const BASE_URL = "https://kidescreation.github.io/sagan-products/";

  function getPageSlug() {
  let pathname = "";

  try {
    pathname = window.top.location.pathname;
  } catch (e) {}

  if (!pathname || pathname === "/") {
    try {
      pathname = window.parent.location.pathname;
    } catch (e) {}
  }

  if (!pathname || pathname === "/") {
    try {
      pathname = new URL(document.referrer).pathname;
    } catch (e) {}
  }

  if (!pathname || pathname === "/") {
    pathname = window.location.pathname;
  }

  return pathname
    .split("/")
    .filter(Boolean)
    .pop()
    .toLowerCase();
}

  async function loadSaganProduct() {
    const root = document.getElementById("sagan-product-root");
    if (!root) return;

    const pageSlug = getPageSlug();

    try {
      const indexResponse = await fetch(BASE_URL + "index.json");
      const index = await indexResponse.json();

      const productSlug = Object.keys(index)
        .sort((a, b) => b.length - a.length)
        .find(slug => pageSlug.startsWith(slug));

      if (!productSlug) return;

      const productResponse = await fetch(BASE_URL + index[productSlug]);
      const product = await productResponse.json();

      root.innerHTML = product.html || "";

      initSaganAddToCart(root);

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
      nativeButton.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      nativeButton.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      nativeButton.click();
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