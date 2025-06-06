import { supabase } from "./database";

export interface Review {
    item_id: string;      
    reviewer_name: string;
    review_text: string;
}

export async function createReview(review: Review): Promise<string | null> {
    const { data, error } = await supabase
        .from("reviews")
        .insert([
            {
                item_id: review.item_id,
                reviewer_name: review.reviewer_name,
                review_text: review.review_text,
            }
        ]);

    if (error) {
        return `Database error: ${error.message}`;
    }
    return null;
}