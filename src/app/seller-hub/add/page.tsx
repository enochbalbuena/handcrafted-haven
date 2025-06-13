'use client';

import { useState } from 'react';
import { supabase } from '@/lib/database';
import { useRouter } from 'next/navigation';
import styles from '../seller.module.css';

export default function AddListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in');

    const user = JSON.parse(atob(token.split('.')[1]));
    const seller_id = user.id;

    let imageUrl = '';
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `listing-${seller_id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase
        .storage
        .from('listing-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        return alert('Image upload failed');
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('listing-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData?.publicUrl || '';
    }

    const { error } = await supabase.from('listing').insert({
      seller_id,
      title,
      description,
      price: parseFloat(price),
      image: imageUrl,
    });

    if (error) {
      alert('Error adding listing');
      console.error(error);
    } else {
      router.push('/seller-hub');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Listing</h1>
      <form className={styles.form} onSubmit={handleAdd}>
        <label className={styles.label}>Title</label>
        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />

        <label className={styles.label}>Description</label>
        <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} required />

        <label className={styles.label}>Price</label>
        <input className={styles.input} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />

        <label className={styles.label}>Image</label>
        <input className={styles.input} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />

        <button className={styles.button} type="submit">Add Listing</button>
        <div className={styles.actions}>
        <button className={styles.button} type="submit">Add Listing</button>
        <button
            className={styles.buttonDanger}
            type="button"
            onClick={() => window.location.href = '/seller-hub'}
        >
            Cancel
        </button>
        </div>
      </form>
    </div>
  );
}
