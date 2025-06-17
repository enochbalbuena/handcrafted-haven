import React from "react";
import styles from "@/app/products/products.module.css";

interface Product {
  id: number;
  name: string;
  description?: string;
  image: string;
  price: number;
  rating?: number;
  reviews?: number;
  quantity?: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  function handleClick() {
  const cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex !== -1) {
    // If found, update the quantity
    const updatedProduct = {
      ...cart[existingIndex],
      quantity: (cart[existingIndex].quantity || 1) + 1,
    };
    cart[existingIndex] = updatedProduct;
  } else {
    // If not found, add the product with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

  return (
    <button className={styles.addToCartButton} onClick={handleClick}>
      Add to Cart
    </button>
  );
}
