'use client';
import { useState } from "react";
import { createReview } from "@/lib/review";

function ReviewForm({ itemId }: { itemId: string }) {
    const [reviewerName, setReviewerName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = await createReview({
            item_id: itemId,
            reviewer_name: reviewerName,
            review_text: reviewText,
        });
        setMessage(error ? error : "Review submitted!");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Your Name"
                value={reviewerName}
                onChange={e => setReviewerName(e.target.value)}
                required
            />
            <textarea
                placeholder="Your Review"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                required
            />
            <button type="submit">Submit Review</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default ReviewForm;