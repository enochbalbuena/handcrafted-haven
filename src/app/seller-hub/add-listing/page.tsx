'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/database';
import { useRouter } from 'next/navigation';
import Header from '../../ui/header';
import styles from '../seller.module.css';
import Image from 'next/image';

interface User {
  id: string;
}

interface Seller {
  id: string;
  name: string;
  bio: string;
  location: string;
  profile_image_url?: string;
}

export default function AddListingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchSellerData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push('/login');
        return;
      }

      setUser({ id: userData.user.id });

      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (!sellerData) {
        router.push('/');
        return;
      }

      setSeller(sellerData);
    };

    fetchSellerData();
  }, [router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...filesArray]);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previewUrls];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const uploadedImageUrls: string[] = [];

    for (const file of imageFiles) {
      const ext = file.name.split('.').pop();
      const fileName = `listing-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        return alert('Image upload failed');
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('listing-images')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        uploadedImageUrls.push(publicUrlData.publicUrl);
      }
    }

    const { error } = await supabase.from('listing').insert({
      seller_id: user.id,
      title,
      description,
      price: parseFloat(price),
      category,
      images: uploadedImageUrls,
    });

    if (error) {
      alert('Error adding listing');
      console.error(error);
    } else {
      router.push('/seller-hub');
    }
  };

  if (!user || !seller) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <main className={styles.container} style={{ marginTop: '3rem', marginBottom: '5rem' }}>
        <h1 className={styles.title}>Add New Listing</h1>
        <form className={styles.form} onSubmit={handleAdd}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />

          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} required />

          <label className={styles.label}>Price</label>
          <input className={styles.input} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />

          <label className={styles.label}>Category</label>
          <select className={styles.input} value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Pottery & Ceramics">Pottery & Ceramics</option>
            <option value="Jewelry & Accessories">Jewelry & Accessories</option>
            <option value="Textiles & Fiber">Textiles & Fiber</option>
            <option value="Wood & Furniture">Wood & Furniture</option>
          </select>

          <label className={styles.label}>Images</label>
          <input
            className={styles.input}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            {previewUrls.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <Image
                  src={url}
                  alt={`Preview ${index}`}
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.button} type="submit">Add Listing</button>
            <button
              className={styles.buttonDanger}
              type="button"
              onClick={() => router.push('/seller-hub')}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
