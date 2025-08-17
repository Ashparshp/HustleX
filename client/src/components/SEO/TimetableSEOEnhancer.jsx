import { useEffect } from "react";

const TimetableSEOEnhancer = () => {
  useEffect(() => {
    // Add specific meta tags for timetable-related searches
    const metaTags = [
      { name: "application-name", content: "HustleX Weekly Timetable Creator" },
      { name: "apple-mobile-web-app-title", content: "HustleX Timetable" },
      { name: "format-detection", content: "telephone=no" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "theme-color", content: "#4F46E5" },

      // Search-specific meta tags
      { name: "category", content: "productivity,education,time-management" },
      { name: "coverage", content: "worldwide" },
      { name: "distribution", content: "global" },
      { name: "rating", content: "general" },
      { name: "target", content: "all" },

      // Additional keyword variations for timetable searches
      {
        name: "keywords.additional",
        content:
          "weekly timetable maker, schedule creator online, daily planner app, time table generator, weekly schedule template, create timetable free, online weekly planner, weekly calendar maker, student timetable, work schedule planner",
      },

      // Rich snippets support
      { property: "product:category", content: "Software > Productivity" },
      { property: "product:availability", content: "in stock" },
      { property: "product:condition", content: "new" },
      { property: "product:price:amount", content: "0" },
      { property: "product:price:currency", content: "USD" },
    ];

    // Create and append meta tags
    const addedTags = [];
    metaTags.forEach(({ name, property, content }) => {
      let existingTag;

      if (name) {
        existingTag = document.querySelector(`meta[name="${name}"]`);
      } else if (property) {
        existingTag = document.querySelector(`meta[property="${property}"]`);
      }

      if (!existingTag) {
        const metaTag = document.createElement("meta");
        if (name) metaTag.name = name;
        if (property) metaTag.setAttribute("property", property);
        metaTag.content = content;
        document.head.appendChild(metaTag);
        addedTags.push(metaTag);
      }
    });

    // Add FAQ structured data for common timetable questions
    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I create a weekly timetable online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "With HustleX, you can create a weekly timetable by signing up for free, adding your activities with time slots, organizing them by categories, and tracking your completion status throughout the week.",
          },
        },
        {
          "@type": "Question",
          name: "Is the weekly timetable maker free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, HustleX offers a free weekly timetable creator with features including activity planning, progress tracking, and schedule management.",
          },
        },
        {
          "@type": "Question",
          name: "Can I track my progress on the timetable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely! HustleX allows you to mark activities as completed, view completion rates, and analyze your productivity patterns over time.",
          },
        },
        {
          "@type": "Question",
          name: "Does the timetable work on mobile devices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, HustleX is fully responsive and works seamlessly on mobile phones, tablets, and desktop computers.",
          },
        },
      ],
    };

    // Add FAQ structured data
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.textContent = JSON.stringify(faqStructuredData);
    document.head.appendChild(faqScript);
    addedTags.push(faqScript);

    // Add How-To structured data for creating timetables
    const howToStructuredData = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Create a Weekly Timetable",
      description:
        "Step-by-step guide to create an effective weekly timetable using HustleX",
      image: "https://hustlex.app/guide-images/create-timetable.jpg",
      totalTime: "PT5M",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0",
      },
      step: [
        {
          "@type": "HowToStep",
          name: "Sign Up for Free",
          text: "Create your free HustleX account to get started",
          image: "https://hustlex.app/guide-images/signup.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Create New Timetable",
          text: "Click 'New Timetable' and give your weekly schedule a name",
          image: "https://hustlex.app/guide-images/new-timetable.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Add Activities",
          text: "Input your daily activities with specific time slots for each day of the week",
          image: "https://hustlex.app/guide-images/add-activities.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Organize with Categories",
          text: "Group activities by type using color-coded categories for better organization",
          image: "https://hustlex.app/guide-images/categories.jpg",
        },
        {
          "@type": "HowToStep",
          name: "Track Your Progress",
          text: "Mark activities as completed and monitor your weekly productivity",
          image: "https://hustlex.app/guide-images/track-progress.jpg",
        },
      ],
    };

    const howToScript = document.createElement("script");
    howToScript.type = "application/ld+json";
    howToScript.textContent = JSON.stringify(howToStructuredData);
    document.head.appendChild(howToScript);
    addedTags.push(howToScript);

    // Cleanup function
    return () => {
      addedTags.forEach((tag) => {
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TimetableSEOEnhancer;
