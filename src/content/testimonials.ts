export type Testimonial = {
  quote: string;
  name?: string;
  source?: string;
  rating?: number;
  verified: boolean;
};

export const testimonials: Testimonial[] = [];

export const resultsPhilosophy = {
  headline: "Progress is built session by session.",
  body: "Sluggers gives players a year-round place to hit, pitch, and work on development indoors.",
};
