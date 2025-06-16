'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/app/ui/header';
import styles from '../../seller.module.css';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
      setCategory(data.category || '');
      setExistingImages(data.images || []);
    };

    fetchListing();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedUrls: string[] = [];

    for (const file of newImageFiles) {
      const ext = file.name.split('.').pop();
      const fileName = `listing-${id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error: uploadError } = await supabase
        .storage
        .from('listing-images')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName);
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }
    }

    const updatedImages = [...existingImages, ...uploadedUrls];

    const { error } = await supabase
      .from('listing')
      .update({
        title,
        description,
        price: parseFloat(price),
        category,
        images: updatedImages,
      })
      .eq('id', id);

    if (error) {
      alert('Error updating listing');
      console.error(error);
    } else {
      router.push('/seller-hub');
    }
  };

  const handleRemoveImage = async (url: string) => {
    const fileName = url.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage.from('listing-images').remove([fileName]);
    if (error) {
      console.error(error);
      alert('Failed to delete image');
      return;
    }

    const filteredImages = existingImages.filter(img => img !== url);
    setExistingImages(filteredImages);

    await supabase
      .from('listing')
      .update({ images: filteredImages })
      .eq('id', id);
  };

  return (
    <div>
      <Header />
      <main className={styles.container} style={{ marginTop: '3rem', marginBottom: '5rem' }}>
        <h1 className={styles.sectionTitle}>Edit Listing</h1>

        <form className={styles.form} onSubmit={handleUpdate}>
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

          <label className={styles.label}>Existing Images</label>
          {existingImages.length > 0 ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {existingImages.map((url, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`Image ${index}`}
                    className={styles.image}
                    style={{ maxWidth: '200px', borderRadius: '8px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontStyle: 'italic' }}>No images uploaded.</p>
          )}

          <label className={styles.label}>Upload More Images</label>
          <input
            className={styles.input}
            type="file"
            accept="image/*"
            multiple
            onChange={e => setNewImageFiles(e.target.files ? Array.from(e.target.files) : [])}
          />

          <div className={styles.actions}>
            <button className={styles.button} type="submit">Save Changes</button>
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
