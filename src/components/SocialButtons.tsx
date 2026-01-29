import React from 'react';
import SocialButton from './SocialButton';

interface SocialLink {
  url: string;
  label: string;
}

interface SocialButtonsProps {
  social: {
    github?: SocialLink;
    linkedin?: SocialLink;
    instagram?: SocialLink;
    [key: string]: SocialLink | undefined;
  };
}

export default function SocialButtons({ social }: SocialButtonsProps) {
  return (
    <div className="flex flex-col gap-[20px]">
      {Object.entries(social).map(([platform, socialLink]) => {
        if (!socialLink) return null;
        return (
          <SocialButton
            key={platform}
            platform={platform as 'github' | 'linkedin' | 'instagram'}
            url={socialLink.url}
            label={socialLink.label}
          />
        );
      })}
    </div>
  );
}
