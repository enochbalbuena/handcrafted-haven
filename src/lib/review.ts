import { supabase } from './database';

export interface ReviewInput {
  item_id: string;
  reviewer_name: string;
  review_text: string;
}

export async function createReview(review: ReviewInput): Promise<string | null> {
  const { error } = await supabase
    .from('reviews')
    .insert([
      {
        ...review,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    return error.message;
  }
  return null;
}