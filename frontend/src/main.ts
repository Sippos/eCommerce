import "./style.css"
import { getProducts } from "./api/products"
import type { Product } from "./types/Product"

let allProducts: Product[] = []

function createProductCard(product: Product): string {
  return `
    <article class="product-card">
      <img
        src="${product.image}"
        alt="${product.title}"
      />

      <div class="product-card__content">
        <p class="product-card__category">${product.category}</p>
        <h2>${product.title}</h2>
        <p class="product-card__price">€${product.price.toFixed(2)}</p>
      </div>
    </article>
  `;
}

function renderProducts(products: Product[]): void {
  const productList = document.querySelector<HTMLElement>("#product-list")

  if (!productList) {
    throw new Error("Product list element was not found")
  }

  productList.innerHTML = products
    .map((product) => createProductCard(product))
    .join("")
}

function getCategories(products: Product[]): string[] {
  const categories = products.map((product) => product.category)

  return [...new Set(categories)].sort()
}

function renderCategoryOptions(products: Product[]): void {
  const categoryFilter =
    document.querySelector<HTMLSelectElement>("#category-filter");

  if (!categoryFilter) {
    throw new Error("Category filter was not found");
  }

  const categories = getCategories(products);

  const categoryOptions = categories
    .map(
      (category) =>
        `<option value="${category}">${category}</option>`,
    )
    .join("");

  categoryFilter.insertAdjacentHTML("beforeend", categoryOptions);
}

function setupCategoryFilter(): void {
  const categoryFilter =
    document.querySelector<HTMLSelectElement>("#category-filter");

  if (!categoryFilter) {
    throw new Error("Category filter was not found");
  }

  categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "all") {
      renderProducts(allProducts);
      return;
    }

    const filteredProducts = allProducts.filter(
      (product) => product.category === selectedCategory,
    );

    renderProducts(filteredProducts);
  });
}


async function initializeApp(): Promise<void> {
  try {
    const allProducts = await getProducts()

    renderCategoryOptions(allProducts)
    renderProducts(allProducts)
    setupCategoryFilter()
  } catch (error) {
    console.error("Could not initialize the store:", error)
  }
}

initializeApp()