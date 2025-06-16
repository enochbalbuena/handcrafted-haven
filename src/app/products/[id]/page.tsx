'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/database';
import Header from '@/app/ui/header';
import styles from '../products.module.css';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  seller_id: string;
}

interface Review {
  id: string;
  reviewer_name: string;
  review_text: string;
  rating: number;
  created_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [sellerName, setSellerName] = useState('Unknown Artisan');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: listing } = await supabase
        .from('listing')
        .select('*')
        .eq('id', id)
        .single();

      if (!listing) return;

      setProduct(listing);

      if (listing?.seller_id) {
        const { data: seller } = await supabase
          .from('sellers')
          .select('name')
          .eq('id', listing.seller_id)
          .single();
        if (seller?.name) setSellerName(seller.name);
      }

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('item_id', id)
        .order('created_at', { ascending: false });

      setReviews(reviewData || []);
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText || !reviewerName) return;

    const { error } = await supabase.from('reviews').insert({
      item_id: id,
      reviewer_name: reviewerName,
      review_text: reviewText,
      rating
    });

    if (!error) {
      setReviewText('');
      setReviewerName('');
      setRating(5);

      const { data: updatedReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('item_id', id)
        .order('created_at', { ascending: false });

      setReviews(updatedReviews || []);
    }
  };

  const renderStars = (value: number) => '★'.repeat(value) + '☆'.repeat(5 - value);

  const averageRating = reviews.length
    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0;

  if (!product) return <p>Loading...</p>;

  const images = Array.isArray(product.images) ? product.images : [];

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Header />
      <main className={styles.productsContainer} style={{ padding: '3rem 1rem' }}>
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: '#2c0703'
          }}
        >
          {/* Product Image Carousel */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '300px', height: '300px' }}>
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#eee', borderRadius: '10px' }} />
              )}
              {images.length > 1 && (
                <>
                  <button onClick={handlePrev} className={styles.carouselButton}>‹</button>
                  <button onClick={handleNext} className={styles.carouselButton}>›</button>
                </>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '250px' }}>
              <h1 className={styles.pageTitle}>{product.title}</h1>
              <p className={styles.artistName}>by {sellerName}</p>
              <p className={styles.rating}>{renderStars(averageRating)} ({reviews.length} reviews)</p>
              <p className={styles.productPrice}>${product.price?.toFixed(2)}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className={styles.addToCartButton}>Add to Cart</button>
                <button className={styles.favoriteButton}>❤️</button>
              </div>
            </div>
          </div>

          {/* Description */}
          <hr style={{ margin: '2rem 0' }} />
          <h2 style={{ fontSize: '1.5rem' }}>Description</h2>
          <p style={{ marginBottom: '2rem' }}>{product.description}</p>

          {/* Review Form */}
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Leave a Review</h2>
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Your name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className={styles.input}
              required
            />
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className={styles.textarea}
              required
            />
            <label style={{ color: '#2c0703' }}>
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className={styles.input}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{renderStars(r)}</option>
                ))}
              </select>
            </label>
            <button className={styles.addToCartButton} type="submit">Submit Review</button>
          </form>

          {/* Reviews */}
          <hr style={{ margin: '2rem 0' }} />
          <h2 style={{ fontSize: '1.5rem' }}>Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} style={{ marginBottom: '1.5rem' }}>
                <strong>{r.reviewer_name}</strong> · <span style={{ color: '#ffa500' }}>{renderStars(r.rating)}</span><br />
                <small>{new Date(r.created_at).toLocaleString()}</small>
                <p style={{ marginTop: '0.5rem' }}>{r.review_text}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
