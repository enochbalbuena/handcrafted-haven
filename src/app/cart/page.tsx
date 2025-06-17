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
    const storedCart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const deleteOneItem = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = (item.quantity || 1) - 1;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as Product[];

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      return updatedCart;
    });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", 
      }}
    >
      <Header />


      <main
        style={{
          flexGrow: 1,
          padding: "1rem",
        }}
      >
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
            <h2 style={{ borderTop: "2px solid #333", paddingTop: "1rem" }}>
              Total: ${totalPrice.toFixed(2)}
            </h2>
          </>
        )}
      </main>


      <footer
        style={{
          backgroundColor: "#f0f0f0",
          padding: "1rem",
          textAlign: "center",
          borderTop: "1px solid #ccc",
        }}
      >
      </footer>
    </div>
  );
}
