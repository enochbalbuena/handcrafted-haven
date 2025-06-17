'use client';

import { useState } from 'react';
import { supabase } from '@/lib/database';
import styles from './signup.module.css';
import Header from '../ui/header';
import Button from '../ui/button';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const accountType = formData.get('accountType') as string;

    // Sign up using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      alert('Signup failed: No user ID returned.');
      setLoading(false);
      return;
    }

    // Avoid inserting duplicate user row
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: userId,
          name,
          email,
          seller_id: accountType === 'Seller' ? userId : null,
        },
      ]);

      if (insertError) {
        if (insertError.code === '23505') {
          alert('User already registered. Please log in instead.');
        } else {
          alert(`An error occurred: ${insertError.message}`);
        }
        setLoading(false);
        return;
      }
    }

    // Insert into sellers table only if it's a seller & doesn't exist
    if (accountType === 'Seller') {
      const { data: existingSeller } = await supabase
        .from('sellers')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingSeller) {
        const { error: sellerInsertError } = await supabase.from('sellers').insert([
          {
            id: userId, // foreign key to users.id
            name,
            bio: '',
            location: '',
            profile_image_url: '',
          },
        ]);

        if (sellerInsertError) {
          if (sellerInsertError.code === '23505') {
            alert('Seller profile already exists.');
          } else {
            alert(`Seller profile insert failed: ${sellerInsertError.message}`);
          }
          setLoading(false);
          return;
        }
      }
    }

    setLoading(false);
    window.location.href = '/login';
  }

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.topdiv}>
            <h1 className={styles.h1}>Sign Up</h1>
          </div>
          <div className={styles.div1}>
            <div className={styles.div2}>
              <label className={styles.label} htmlFor="name">Name:</label>
              <input className={styles.input} type="text" name="name" required />
            </div>
            <div className={styles.divemail}>
              <label className={styles.label} htmlFor="email">Email:</label>
              <input className={styles.input} type="email" name="email" required />
            </div>
            <div className={styles.div4}>
              <label className={styles.label} htmlFor="password">Password:</label>
              <input className={styles.input} type="password" name="password" required />
            </div>
            <div className={styles.div6}>
              <label className={styles.label1}>Account Type:</label>
              <label className={styles.label2}>
                <input type="radio" name="accountType" value="User" required />
                User
              </label>
              <label className={styles.label3}>
                <input type="radio" name="accountType" value="Seller" required />
                Seller
              </label>
            </div>
          </div>
          <div className={styles.div5}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
