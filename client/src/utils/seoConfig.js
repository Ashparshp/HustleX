// SEO configuration and constants
export const SITE_CONFIG = {
  name: "HustleX",
  description:
    "Transform your productivity with HustleX - the ultimate time management and skill tracking platform. Organize schedules, track working hours, develop skills, and achieve your goals efficiently.",
  url: "https://hustlex.app",
  ogImage: "https://hustlex.app/og-image.jpg",
  twitterImage: "https://hustlex.app/twitter-image.jpg",
  twitterHandle: "@hustlex_app",
  author: "HustleX Team",
  keywords:
    "productivity app, time management, skill tracking, schedule planner, working hours tracker, goal achievement, personal development, task management, productivity tools, time tracker",
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: "HustleX - Master Your Productivity & Skills | Time Management App",
    description:
      "Transform your productivity with HustleX - the ultimate time management and skill tracking platform. Organize schedules, track working hours, develop skills, and achieve your goals efficiently.",
    keywords:
      "productivity app, time management, skill tracking, schedule planner, working hours tracker, goal achievement",
    canonical: `${SITE_CONFIG.url}/`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "HustleX",
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: SITE_CONFIG.author,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
      },
    },
  },

  workingHours: {
    title: "Working Hours Tracker | HustleX - Track Your Productive Time",
    description:
      "Efficiently track and manage your working hours with HustleX. Monitor productivity, set goals, analyze patterns, and optimize your time management for better results.",
    keywords:
      "working hours tracker, time tracking, productivity monitoring, work time management, hours logger, time analytics",
    canonical: `${SITE_CONFIG.url}/working-hours`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Working Hours Tracker",
      description:
        "Efficiently track and manage your working hours with HustleX.",
      url: `${SITE_CONFIG.url}/working-hours`,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "Working Hours Tracker",
        applicationCategory: "ProductivityApplication",
        description:
          "Track and analyze your working hours for better productivity",
      },
    },
  },

  skills: {
    title: "Skills Development Tracker | HustleX - Master New Skills",
    description:
      "Track your skill development journey with HustleX. Set learning goals, monitor progress, organize skills by categories, and achieve mastery in your chosen areas.",
    keywords:
      "skill tracking, skill development, learning progress, skill management, personal development, skill goals",
    canonical: `${SITE_CONFIG.url}/skills`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Skills Development Tracker",
      description: "Track your skill development journey with HustleX.",
      url: `${SITE_CONFIG.url}/skills`,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "Skills Tracker",
        applicationCategory: "EducationalApplication",
        description: "Track and manage your skill development progress",
      },
    },
  },

  timetable: {
    title: "Smart Timetable & Schedule Planner | HustleX - Organize Your Day",
    description:
      "Create and manage your daily timetable with HustleX. Plan activities, track completion, and maintain a structured schedule for maximum productivity.",
    keywords:
      "timetable planner, schedule management, daily planner, activity tracker, time blocking, schedule organizer",
    canonical: `${SITE_CONFIG.url}/timetable`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Smart Timetable Planner",
      description: "Create and manage your daily timetable with HustleX.",
      url: `${SITE_CONFIG.url}/timetable`,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "Timetable Planner",
        applicationCategory: "ProductivityApplication",
        description: "Plan and track your daily activities and schedule",
      },
    },
  },

  schedule: {
    title: "Schedule Management | HustleX - Plan Your Perfect Day",
    description:
      "Manage your schedules and appointments with HustleX. Create recurring events, set reminders, and maintain perfect organization of your time.",
    keywords:
      "schedule management, appointment planner, calendar app, event scheduling, time organization, schedule maker",
    canonical: `${SITE_CONFIG.url}/schedule`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Schedule Management",
      description: "Manage your schedules and appointments with HustleX.",
      url: `${SITE_CONFIG.url}/schedule`,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "Schedule Manager",
        applicationCategory: "ProductivityApplication",
        description: "Manage schedules, appointments and events",
      },
    },
  },

  login: {
    title: "Login to HustleX | Access Your Productivity Dashboard",
    description:
      "Login to your HustleX account to access your personal productivity dashboard. Track your progress, manage schedules, and achieve your goals.",
    keywords:
      "login, sign in, user account, dashboard access, productivity login",
    canonical: `${SITE_CONFIG.url}/login`,
    noIndex: false,
  },

  register: {
    title: "Sign Up for HustleX | Start Your Productivity Journey",
    description:
      "Create your free HustleX account and start mastering your productivity. Join thousands of users who have transformed their time management and skill development.",
    keywords:
      "sign up, register, create account, free account, productivity signup",
    canonical: `${SITE_CONFIG.url}/register`,
    noIndex: false,
  },

  profile: {
    title: "User Profile | HustleX - Manage Your Account",
    description:
      "Manage your HustleX profile settings, preferences, and account information. Customize your productivity experience to match your needs.",
    keywords:
      "user profile, account settings, profile management, user preferences",
    canonical: `${SITE_CONFIG.url}/profile`,
    noIndex: true, // Private page
  },
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

// Generate FAQ structured data
export const generateFAQData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export default {
  SITE_CONFIG,
  PAGE_SEO,
  generateBreadcrumbData,
  generateFAQData,
};
