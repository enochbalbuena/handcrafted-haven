'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import Header from '../ui/header';
import Link from 'next/link';
import styles from './seller.module.css';

export default function SellerHubPage() {
  const [user, setUser] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [carouselIndices, setCarouselIndices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchSellerData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = '/login';
        return;
      }

      setUser(userData.user);

      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (!sellerData) {
        window.location.href = '/';
        return;
      }

      setSeller(sellerData);

      const { data: sellerListings } = await supabase
        .from('listing')
        .select('*')
        .eq('seller_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (sellerListings) {
        setListings(sellerListings);
        const indices: { [key: string]: number } = {};
        sellerListings.forEach((l) => {
          indices[l.id] = 0;
        });
        setCarouselIndices(indices);
      }
    };

    fetchSellerData();
  }, []);

  const handlePrev = (id: string, images: string[]) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + images.length) % images.length,
    }));
  };

  const handleNext = (id: string, images: string[]) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % images.length,
    }));
  };

  if (!user || !seller) return <p>Loading seller profile...</p>;

  return (
    <div>
      <Header />

      <main className={styles.container}>
        <section style={{ marginTop: '2rem' }}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          {seller.profile_image_url ? (
            <img
              src={seller.profile_image_url}
              alt="Profile"
              width={150}
              height={150}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <p>No profile picture uploaded.</p>
          )}

          <p><strong>Bio:</strong> {seller.bio || 'No bio added yet.'}</p>
          <p><strong>Location:</strong> {seller.location || 'No location provided.'}</p>

          <div style={{ marginTop: '1rem' }}>
            <Link href="/seller-hub/edit-profile" className={styles.button}>
              Edit Profile
            </Link>
          </div>
        </section>

        <section style={{ marginTop: '3rem' }}>
          <h2 className={styles.sectionTitle}>Listings</h2>
          <Link href="/seller-hub/add-listing" className={styles.button}>
            Add New Listing
          </Link>

          {listings.length === 0 ? (
            <p style={{ marginBottom: '4rem' }}>No listings yet.</p>
          ) : (
            <div className={styles.grid} style={{ marginBottom: '4rem' }}>
              {listings.map((listing) => {
                const images = listing.images || [];
                const activeIndex = carouselIndices[listing.id] || 0;
                return (
                  <div key={listing.id} className={styles.card}>
                    <Link href={`/products/${listing.id}`}>
                      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
                        {images.length > 0 ? (
                          <>
                            <img
                              src={images[activeIndex]}
                              alt={listing.title}
                              style={{
                                width: '300px',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePrev(listing.id, images);
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '-15px',
                                    transform: 'translateY(-50%)',
                                    background: 'black',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    zIndex: 2
                                  }}
                                >
                                  ‹
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleNext(listing.id, images);
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '-15px',
                                    transform: 'translateY(-50%)',
                                    background: 'black',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    zIndex: 2
                                  }}
                                >
                                  ›
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <div
                            style={{
                              width: '300px',
                              height: '300px',
                              backgroundColor: '#eee',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px'
                            }}
                          >
                            <span>No Image</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <Link href={`/products/${listing.id}`}>
                      <h3 style={{ cursor: 'pointer' }}>{listing.title}</h3>
                    </Link>
                    <p>{listing.description}</p>
                    <p><strong>${listing.price?.toFixed(2)}</strong></p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <Link
                        href={`/seller-hub/edit-listing/${listing.id}`}
                        className={styles.button}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/seller-hub/delete-listing/${listing.id}`}
                        className={styles.buttonDanger}
                      >
                        Delete
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
