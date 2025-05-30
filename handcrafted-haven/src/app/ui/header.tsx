"use client";

import Header from "../ui/header";
import Link from "next/link";
import styles from "./login.module.css"; // your CSS module file

export default function LoginPage() {
  return (
    <div>
      <Header />
      <main className={styles.container}>
        <h2 className={styles.title}>Login to your account</h2>
        <form action="/api/login" method="POST" className={styles.form}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className={styles.input}
          />

          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className={styles.input}
          />

          <div className={styles.buttonGroup}>
            {/* Login is submit button */}
            <button type="submit" className={styles.button}>
              Log In
            </button>

            {/* Sign Up navigates to /signup using Link */}
            <Link href="/signup" className={styles.linkButton}>
              Sign Up
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
