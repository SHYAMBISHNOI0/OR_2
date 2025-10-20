import type { StaticImageData } from 'next/image';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

import placeholderData from './placeholder-images.json';

export const placeholderImages: ImagePlaceholder[] = placeholderData.placeholderImages;
