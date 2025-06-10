'use client';
import React, { useState } from 'react';
import { createReview, ReviewInput } from '@/lib/review';

const ReviewPage: React.FC = () => {
  const [itemId, setItemId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const review: ReviewInput = {
      item_id: itemId,
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

  return (
    <div>
      <h1>Leave a Review</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Item ID:
          <input
            value={itemId}
            onChange={e => setItemId(e.target.value)}
            required
          />
        </label>
        <br />
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
  );
};

export default ReviewPage;