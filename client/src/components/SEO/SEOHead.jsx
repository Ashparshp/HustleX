import { useEffect } from "react";

const SEOHead = ({
  title = "HustleX - Master Your Productivity & Skills",
  description = "Transform your productivity with HustleX - the ultimate time management and skill tracking platform. Organize schedules, track working hours, develop skills, and achieve your goals efficiently.",
  keywords = "productivity app, time management, skill tracking, schedule planner, working hours tracker, goal achievement, personal development, task management, productivity tools, time tracker",
  canonical = "https://hustlex.app/",
  ogImage = "https://hustlex.app/og-image.jpg",
  twitterImage = "https://hustlex.app/twitter-image.jpg",
  noIndex = false,
  structuredData = null,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Update Open Graph tags
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:url", canonical);
    updateMetaProperty("og:image", ogImage);

    // Update Twitter tags
    updateMetaProperty("twitter:title", title);
    updateMetaProperty("twitter:description", description);
    updateMetaProperty("twitter:url", canonical);
    updateMetaProperty("twitter:image", twitterImage);

    // Update canonical URL
    updateCanonical(canonical);

    // Update robots meta tag
    updateMetaTag("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }

    return () => {
      // Cleanup function if needed
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogImage,
    twitterImage,
    noIndex,
    structuredData,
  ]);

  const updateMetaTag = (name, content) => {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (element) {
      element.setAttribute("content", content);
    } else {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      element.setAttribute("content", content);
      document.head.appendChild(element);
    }
  };

  const updateMetaProperty = (property, content) => {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (element) {
      element.setAttribute("content", content);
    } else {
      element = document.createElement("meta");
      element.setAttribute("property", property);
      element.setAttribute("content", content);
      document.head.appendChild(element);
    }
  };

  const updateCanonical = (url) => {
    let element = document.querySelector('link[rel="canonical"]');
    if (element) {
      element.setAttribute("href", url);
    } else {
      element = document.createElement("link");
      element.setAttribute("rel", "canonical");
      element.setAttribute("href", url);
      document.head.appendChild(element);
    }
  };

  const addStructuredData = (data) => {
    // Remove existing structured data
    const existing = document.querySelector(
      'script[type="application/ld+json"].dynamic-seo'
    );
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.className = "dynamic-seo";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
};

export default SEOHead;
