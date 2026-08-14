import { tours as localTours } from '../data/tours';

const ratingMap = Object.fromEntries(
  localTours.map(t => [t.slug, { rating: t.rating, reviews: t.reviews }])
);

export function mergeRatings(apiTours) {
  return apiTours.map(t => ({
    ...t,
    rating:  ratingMap[t.slug]?.rating  ?? t.rating  ?? 4.5,
    reviews: ratingMap[t.slug]?.reviews ?? t.reviews ?? 24,
  }));
}
