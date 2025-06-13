'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../seller.module.css';

export default function DeleteListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('listing')
        .select('title')
        .eq('id', id)
        .single();

      if (!error && data?.title) {
        setTitle(data.title);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    const { error } = await supabase
      .from('listing')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete listing');
      console.error(error);
    } else {
      router.push('/seller-hub');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Delete Listing</h1>
      <p>Are you sure you want to delete <strong>{title || 'this listing'}</strong>?</p>
      <div className={styles.actions}>
        <button className={styles.buttonDanger} onClick={handleDelete}>Yes, Delete</button>
        <button className={styles.button} onClick={() => router.push('/seller-hub')}>Cancel</button>
      </div>
    </div>
  );
}
