import { useEffect } from 'react';
import { Platform } from 'react-native';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  siteName?: string;
}

/**
 * SEO Component - Sets meta tags for better search engine optimization
 * Only works on web platform, no-op on native
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  siteName = 'Ekions',
}) => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Set document title
    if (title) {
      document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
    }

    // Helper to create/update meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      if (!content) return;
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard Meta Tags
    if (description) {
      setMetaTag('description', description);
    }
    if (keywords) {
      setMetaTag('keywords', keywords);
    }
    if (author) {
      setMetaTag('author', author);
    }

    // Open Graph Tags (Facebook, LinkedIn, etc.)
    if (title) {
      setMetaTag('og:title', title, true);
    }
    if (description) {
      setMetaTag('og:description', description, true);
    }
    if (image) {
      setMetaTag('og:image', image, true);
    }
    if (url) {
      setMetaTag('og:url', url, true);
    }
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', siteName, true);

    // Twitter Card Tags
    setMetaTag('twitter:card', image ? 'summary_large_image' : 'summary');
    if (title) {
      setMetaTag('twitter:title', title);
    }
    if (description) {
      setMetaTag('twitter:description', description);
    }
    if (image) {
      setMetaTag('twitter:image', image);
    }

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, true);
      }
      if (author) {
        setMetaTag('article:author', author, true);
      }
    }

    // Product specific tags
    if (type === 'product') {
      setMetaTag('og:type', 'product', true);
    }

    // Canonical URL
    if (url) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = url;
    }

    // Cleanup function - reset title when component unmounts
    return () => {
      // Optionally reset to default title
      // document.title = siteName;
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, siteName]);

  // This component doesn't render anything
  return null;
};

/**
 * Hook to set SEO meta tags programmatically
 */
export const useSEO = (props: SEOProps) => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const { title, description, keywords, siteName = 'Ekions' } = props;

    if (title) {
      document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
    }

    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    if (description) setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
  }, [props]);
};

export default SEO;
