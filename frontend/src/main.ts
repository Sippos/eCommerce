import "./style.css"
import { getProducts } from "./api/products"
import type { Product } from "./types/Product"

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
  const productList = document.querySelector<HTMLElement>("product-list")

  if (!productList) {
    throw new Error("Product list element was not found")
  }

  productList.innerHTML = products
    .map((product) => createProductCard(product))
    .join("")
}

async function initializeApp(): Promise<void> {
  try {
    const products = await getProducts()

    renderProducts(products)
  } catch (error) {
    console.error("Could not initialize the store:", error)
  }
}

initializeApp()