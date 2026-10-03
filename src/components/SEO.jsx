import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Manager Component for Amovi Travel.
 * Dynamically synchronizes document title, standard metadata, Open Graph tags,
 * Twitter cards, canonical link, and JSON-LD structured schemas without external dependencies.
 */
export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  schema
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Dynamic document title
    let fullTitle = title;
    if (!fullTitle) {
      fullTitle = 'Amovi Travel — Explore Afghanistan with Confidence';
    } else if (!fullTitle.includes('|') && !fullTitle.includes('—')) {
      fullTitle = `${title} | Amovi Travel`;
    }
    document.title = fullTitle;

    // Helper to update or create a meta tag
    const updateMeta = (selector, attribute, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) el.setAttribute('property', propName);
        } else if (selector.includes('name=')) {
          const nameAttr = selector.match(/name="([^"]+)"/)?.[1];
          if (nameAttr) el.setAttribute('name', nameAttr);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    // 2. Standard Meta Tags
    const defaultDesc = 'Discover Afghanistan with Amovi Travel. Authentic, safe, and thoughtfully planned journeys across Kabul, Bamyan, Herat, and beyond.';
    const finalDesc = description || defaultDesc;
    updateMeta('meta[name="description"]', 'content', finalDesc);

    if (keywords) {
      updateMeta('meta[name="keywords"]', 'content', keywords);
    }

    // 3. Canonical Link & hreflang
    const currentUrl = `https://amovi.travel${location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // Multilingual hreflang alternates
    const updateHreflang = (langCode) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${langCode}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', langCode);
        document.head.appendChild(link);
      }
      link.setAttribute('href', currentUrl);
    };
    updateHreflang('en');
    updateHreflang('fa');
    updateHreflang('x-default');

    // 4. Open Graph Meta Tags
    const defaultImage = 'https://amovi.travel/images/provinces/kabul/kabul-hero.webp';
    const finalImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `https://amovi.travel${ogImage}`) : defaultImage;

    updateMeta('meta[property="og:title"]', 'content', fullTitle);
    updateMeta('meta[property="og:description"]', 'content', finalDesc);
    updateMeta('meta[property="og:url"]', 'content', currentUrl);
    updateMeta('meta[property="og:type"]', 'content', ogType);
    updateMeta('meta[property="og:image"]', 'content', finalImage);

    // 5. Twitter Card Meta Tags
    updateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'content', fullTitle);
    updateMeta('meta[name="twitter:description"]', 'content', finalDesc);
    updateMeta('meta[name="twitter:image"]', 'content', finalImage);

    // 6. Dynamic JSON-LD Structured Data Schema
    let dynamicSchemaScript = document.getElementById('dynamic-page-schema');
    if (schema) {
      if (!dynamicSchemaScript) {
        dynamicSchemaScript = document.createElement('script');
        dynamicSchemaScript.id = 'dynamic-page-schema';
        dynamicSchemaScript.type = 'application/ld+json';
        document.head.appendChild(dynamicSchemaScript);
      }
      dynamicSchemaScript.textContent = JSON.stringify(schema, null, 2);
    } else if (dynamicSchemaScript) {
      dynamicSchemaScript.remove();
    }

    return () => {
      // Cleanup dynamic schema on page change
      const el = document.getElementById('dynamic-page-schema');
      if (el) el.remove();
    };
  }, [title, description, keywords, ogImage, ogType, schema, location.pathname]);

  return null;
}
