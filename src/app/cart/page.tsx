"use client";

import React, { useEffect, useState } from "react";
import Header from "../ui/header";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  quantity?: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const storedCart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const deleteOneItem = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = (item.quantity || 1) - 1;
            // If quantity after decrement is 0 or less, remove item (return null)
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as Product[]; // Remove nulls

      // Update localStorage with new cart state
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // Dispatch a custom event to notify other parts of the app
      window.dispatchEvent(new Event("cartUpdated"));

      return updatedCart;
    });
  };

  // Calculate total price = sum of price * quantity
  const totalPrice = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  return (
    <div>
      <Header />
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <h1>Your Cart</h1>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: "1rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    marginBottom: "0.5rem",
                  }}
                />
              )}
              <h3>{item.name}</h3>
              {item.quantity && <p>Quantity: {item.quantity}</p>}
              <p>Price: ${item.price.toFixed(2)}</p>
              <button onClick={() => deleteOneItem(item.id)}>Delete one</button>
            </div>
          ))}
          {/* Total price displayed below all items */}
          <h2 style={{ borderTop: "2px solid #333", paddingTop: "1rem" }}>
            Total: ${totalPrice.toFixed(2)}
          </h2>
        </>
      )}
    </div>
  );
}
