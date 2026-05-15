import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.jpg', 
  url = window.location.href,
  type = 'website'
}: SEOProps) {
  const baseTitle = 'Nasir Hussain';
  const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | Data Scientist & Machine Learning Specialist`;
  const defaultDescription = 'Professional portfolio of Nasir Hussain, a Data Scientist specializing in Machine Learning, Advanced Analytics, and Data Engineering.';
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="b7TE6LHH7UlKbhk8biMWIAjHO4HUgWSvgskdMk5baZY" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
