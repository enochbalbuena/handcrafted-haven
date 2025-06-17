'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/app/ui/header';
import styles from '../../seller.module.css';
import Image from 'next/image';

export default function DeleteListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('listing')
        .select('title, images')
        .eq('id', id)
        .single();

      if (!error && data) {
        setTitle(data.title || '');
        setImages(data.images || []);
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      <Header />
      <main className={styles.container} style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <h1 className={styles.title}>Delete Listing</h1>

        {images.length > 0 ? (
          <div style={{ position: 'relative', width: '300px', height: '300px', marginBottom: '1rem' }}>
            <Image
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              width={300}
              height={300}
              style={{
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: '32px',
                textAlign: 'center'
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: '32px',
                textAlign: 'center'
              }}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        ) : (
          <div
            className={styles.image}
            style={{
              width: '300px',
              height: '300px',
              backgroundColor: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          >
            <span>No Images</span>
          </div>
        )}

        <p>
          Are you sure you want to delete <strong>{title || 'this listing'}</strong>?
        </p>

        <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
          <button className={styles.buttonDanger} onClick={handleDelete}>
            Yes, Delete
          </button>
          <button className={styles.button} onClick={() => router.push('/seller-hub')}>
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}
