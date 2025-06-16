'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/database";
import styles from "../page.module.css";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(!!user);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <Link href="/">
          <Image
            className={styles.logo}
            src="/handcrafted.png"
            alt="Handcrafted Haven Logo"
            width={120}
            height={120}
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className={styles.mainNav}>
        <ul className={styles.navList}>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/products" className={styles.navLink}>Shop</Link></li>
          <li><Link href="/artisans" className={styles.navLink}>Artisans</Link></li>
          <li><Link href="/seller-hub" className={styles.navLink}>Start Selling</Link></li>
          <li><Link href="/about" className={styles.navLink}>About</Link></li>
        </ul>
      </nav>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input
            type="search"
            placeholder="Search handcrafted items..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>🔍</button>
        </div>
      </div>

      {/* User Actions */}
      <div className={styles.userActions}>
        <Link href="/cart" className={styles.iconLink}>
          <span className={styles.cartIcon}>🛒</span>
          <span className={styles.cartCount}>0</span>
        </Link>
        <Link href="/favorites" className={styles.iconLink}>
          <span className={styles.favoriteIcon}>❤️</span>
        </Link>
        {loggedIn ? (
          <button onClick={handleLogout} className={styles.loginButton}>Logout</button>
        ) : (
          <Link href="/login" className={styles.loginLink}>
            <button className={styles.loginButton}>Login</button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className={styles.mobileMenuToggle}>☰</button>
    </header>
  );
}
