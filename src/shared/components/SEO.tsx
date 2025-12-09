import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  type?: string;
  name?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "StrumMaster - ваш персональный тренер по игре на гитаре", 
  keywords = "гитара, обучение, ритм, аккорды, тренажер",
  type = "website",
  name = "StrumMaster"
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | StrumMaster</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      
      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};