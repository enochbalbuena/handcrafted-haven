import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";

export default function Header() {
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
          <li>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li className={styles.dropdown}>
            <Link href="/shop" className={styles.navLink}>
              Shop
            </Link>
            <ul className={styles.dropdownMenu}>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop/pottery">Pottery & Ceramics</Link></li>
              <li><Link href="/shop/jewelry">Jewelry & Accessories</Link></li>
              <li><Link href="/shop/textiles">Textiles & Fiber</Link></li>
              <li><Link href="/shop/wood">Wood & Furniture</Link></li>
              <li><Link href="/shop/featured">Featured Items</Link></li>
            </ul>
          </li>
          <li>
            <Link href="/artisans" className={styles.navLink}>
              Artisans
            </Link>
          </li>
          <li>
            <Link href="/sell" className={styles.navLink}>
              Start Selling
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </li>
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
          <button className={styles.searchButton}>
            🔍
          </button>
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
        <Link href="/login" className={styles.loginLink}>
          <button className={styles.loginButton}>Login</button>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button className={styles.mobileMenuToggle}>
        ☰
      </button>
    </header>
  );
}