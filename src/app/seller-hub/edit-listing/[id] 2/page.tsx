'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../seller.module.css';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrice(data.price?.toString() || '');
      setExistingImage(data.image || '');
    };

    fetchListing();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = existingImage;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `listing-${id}-${Date.now()}.${ext}`;
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

    const { error } = await supabase
      .from('listing')
      .update({ title, description, price: parseFloat(price), image: imageUrl })
      .eq('id', id);

    if (error) {
      alert('Error updating listing');
      console.error(error);
    } else {
      router.push('/seller-hub');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Listing</h1>
      <form className={styles.form} onSubmit={handleUpdate}>
        <label className={styles.label}>Title</label>
        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />

        <label className={styles.label}>Description</label>
        <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} required />

        <label className={styles.label}>Price</label>
        <input className={styles.input} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />

        <label className={styles.label}>Change Image</label>
        <input className={styles.input} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />

        <button className={styles.button} type="submit">Save Changes</button>
        <div className={styles.actions}>
        <button className={styles.button} type="submit">Save Changes</button>
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
