
import { getData, saveData } from "./storageService";

const REVIEWS_KEY = "smarttrip_reviews";

export const getReviews = async () => {
  const reviews = await getData(REVIEWS_KEY);
  return Array.isArray(reviews) ? reviews : [];
};

export const saveReview = async (review) => {
  const reviews = await getReviews();

  const updatedReviews = [
    review,
    ...reviews,
  ];

  await saveData(REVIEWS_KEY, updatedReviews);
  return updatedReviews;
};
