import React from "react";
import styles from "@/app/products/products.module.css";


interface ProductFromList {
  id?: string;
  title?: string;
  images?: string[];
  price: number;
  quantity?: number;
}

interface CartItem {
  id?: string;
  name?: string;
  image?: string;
  price: number;
  quantity?: number;
}

interface AddToCartButtonProps {
  product: ProductFromList;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  function handleClick() {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // Update quantity if product already in cart
      const updatedProduct = {
        ...cart[existingIndex],
        quantity: (cart[existingIndex].quantity || 1) + 1,
      };
      cart[existingIndex] = updatedProduct;
    } else {
      // Add new product to cart, mapping title to name and images[0] to image
      cart.push({
        id: product.id,
        name: product.title || "Unknown Product",
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : "",
        quantity: 1,
      });
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
