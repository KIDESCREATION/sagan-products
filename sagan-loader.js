(function () {
  const BASE_URL = "https://res.cloudinary.com/dohfj2r46/raw/upload/sagan-products/";

  function getPageSlug() {
    return window.location.pathname
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
    } catch (error) {
      console.error("SAGAN : erreur chargement produit :", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSaganProduct);
  } else {
    loadSaganProduct();
  }
})();