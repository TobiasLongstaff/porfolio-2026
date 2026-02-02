import React from 'react';
import { HiLocationMarker } from 'react-icons/hi';

interface LocationBadgeProps {
  country: string;
  city: string;
}

export default function LocationBadge({ country, city }: LocationBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 text-text-secondary border border-text-secondary rounded-full px-4 py-1 w-fit">
      <HiLocationMarker className="w-4 h-4" />
      <span>{country}, {city}</span>
    </span>
  );
}
