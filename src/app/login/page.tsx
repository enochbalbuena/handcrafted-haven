'use client';

import { useState } from 'react';
import { supabase } from '@/lib/database';
import styles from './login.module.css';
import Header from '../ui/header';
import Button from '../ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData(e.currentTarget);
    const email = formdata.get('email') as string;
    const password = formdata.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/';
    }
  }

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.topdiv}>
            <h1 className={styles.h1}>Login</h1>
          </div>
          <div className={styles.div1}>
            <div className={styles.div3}>
              <label className={styles.label} htmlFor="email">Email: </label>
              <input className={styles.input} type="email" name="email" required placeholder="Enter Email" />
            </div>
            <div className={styles.div4}>
              <label className={styles.label} htmlFor="password">Password: </label>
              <input className={styles.input} type="password" name="password" required placeholder="Enter Password" />
            </div>
          </div>
          <div className={styles.div5}>
            <Button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
            <Link href="/signup"><Button type="button">Sign Up</Button></Link>
          </div>
        </form>
      </main>
    </div>
  );
}
