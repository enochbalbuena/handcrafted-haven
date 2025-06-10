'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createReview, ReviewInput } from '@/lib/review';
import { supabase } from '@/lib/database';
import Image from 'next/image';

const REVIEWS_PAGE_SIZE = 10;
interface Item {
  id: string;
  name: string;
  description: string;
  picture?: string;
  seller_id: string;
  price: number;
  created_at: string;
}

interface Review {
  id: string;
  item_id: string;
  reviewer_name: string;
  review_text: string;
  created_at: string;
}


const ItemPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(error.message);
      else setItem(data);
    };
    if (id) fetchItem();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      const from = 0;
      const to = REVIEWS_PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('item_id', id)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) {
        setReviewsError(error.message);
      } else {
        setReviews(data || []);
        setHasMoreReviews((data?.length || 0) === REVIEWS_PAGE_SIZE);
      }
      setReviewsLoading(false);
    };
    if (id) {
      fetchReviews();
    }
  }, [id, message]); // refetch on new review

  // Load more reviews
  const handleLoadMoreReviews = async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    const from = reviews.length;
    const to = from + REVIEWS_PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('item_id', id)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) {
      setReviewsError(error.message);
    } else {
      setReviews(prev => [...prev, ...(data || [])]);
      setHasMoreReviews((data?.length || 0) === REVIEWS_PAGE_SIZE);
    }
    setReviewsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const review: ReviewInput = {
      item_id: id,
      reviewer_name: reviewerName,
      review_text: reviewText,
    };
    const error = await createReview(review);
    if (error) {
      setMessage(`Error: ${error}`);
    } else {
      setMessage('Review submitted successfully!');
      setReviewerName('');
      setReviewText('');
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item?.name}</h1>
      <p>{item?.description}</p>
      {item?.picture && (
        <Image
          src={item.picture}
          alt={item.name}
          width={400}
          height={300}
          style={{ maxWidth: 400, height: 'auto' }}
        />
      )}
      <p>Seller ID: {item.seller_id}</p>
      <p>Price: ${item.price}</p>

      {/* Reviews Section */}
      <div>
        <h2>Reviews</h2>
        {reviewsLoading && reviews.length === 0 && <p>Loading reviews...</p>}
        {reviewsError && <p style={{ color: 'red' }}>{reviewsError}</p>}
        {reviews.length === 0 && !reviewsLoading && <p>No reviews yet.</p>}
        <ul>
          {reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: 16 }}>
              <strong>{review.reviewer_name}</strong> <em>({new Date(review.created_at).toLocaleString()})</em>
              <br />
              {review.review_text}
            </li>
          ))}
        </ul>
        {hasMoreReviews && (
          <button onClick={handleLoadMoreReviews} disabled={reviewsLoading}>
            {reviewsLoading ? 'Loading...' : 'Show 10 more'}
          </button>
        )}
      </div>

      {/* Review Form */}
      <div>
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" value={id} readOnly />
          <label>
            Name:
            <input
              value={reviewerName}
              onChange={e => setReviewerName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Review:
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit Review</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ItemPage;