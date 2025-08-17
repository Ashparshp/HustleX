// SEO configuration and constants
export const SITE_CONFIG = {
  name: "HustleX",
  description:
    "Transform your productivity with HustleX - the ultimate time management and skill tracking platform. Create weekly timetables, organize schedules, track working hours, develop skills, and achieve your goals efficiently.",
  url: "https://hustlex.app",
  ogImage: "https://hustlex.app/og-image.jpg",
  twitterImage: "https://hustlex.app/twitter-image.jpg",
  twitterHandle: "@hustlex_app",
  author: "HustleX Team",
  keywords:
    "productivity app, time management, weekly timetable creator, schedule planner, working hours tracker, goal achievement, personal development, task management, productivity tools, time tracker, weekly planner, daily scheduler",
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
    title: "Create Weekly Timetable & Daily Schedule Planner | HustleX - Smart Time Management",
    description:
      "Create weekly timetables, daily schedules, and track your activities with HustleX. Build productive routines, manage time blocks, track completion status, and optimize your weekly planning for maximum productivity.",
    keywords:
      "create weekly timetable, weekly schedule maker, daily timetable planner, weekly time table creator, schedule management, daily planner, activity tracker, time blocking, schedule organizer, weekly planner, timetable generator, weekly schedule template, daily routine planner, time management tool, productivity scheduler",
    canonical: `${SITE_CONFIG.url}/timetable`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Smart Timetable Planner",
      description: "Create and manage your daily timetable with HustleX.",
      url: `${SITE_CONFIG.url}/timetable`,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "Weekly Timetable Creator",
        applicationCategory: "ProductivityApplication",
        description: "Create, manage and track weekly timetables and daily schedules",
        featureList: [
          "Weekly timetable creation",
          "Daily schedule planning", 
          "Activity completion tracking",
          "Time block management",
          "Progress analytics",
          "Category organization"
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
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

  // Additional SEO configurations for better search targeting
  createTimetable: {
    title: "Create Weekly Timetable Online Free | HustleX - Weekly Schedule Maker",
    description:
      "Create your weekly timetable online for free with HustleX. Design custom weekly schedules, organize daily activities, track progress, and optimize your time management with our intuitive timetable creator.",
    keywords:
      "create weekly timetable online, free weekly timetable maker, weekly schedule creator, online timetable generator, weekly planner tool, create schedule online, weekly time table maker, daily schedule planner",
    canonical: `${SITE_CONFIG.url}/timetable/create`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Create a Weekly Timetable",
      description: "Step-by-step guide to creating an effective weekly timetable",
      step: [
        {
          "@type": "HowToStep",
          name: "Choose Your Template",
          text: "Select from weekly timetable templates or create from scratch"
        },
        {
          "@type": "HowToStep", 
          name: "Add Activities",
          text: "Input your daily activities, classes, or tasks with time slots"
        },
        {
          "@type": "HowToStep",
          name: "Organize by Categories",
          text: "Group activities by type using color-coded categories"
        },
        {
          "@type": "HowToStep",
          name: "Track Progress",
          text: "Monitor completion status and analyze your productivity"
        }
      ]
    }
  },

  weeklyPlanner: {
    title: "Weekly Planner & Schedule Template | HustleX - Organize Your Week",
    description:
      "Plan your perfect week with HustleX weekly planner. Use customizable templates, track daily activities, manage time blocks, and achieve better work-life balance with our comprehensive weekly scheduling tool.",
    keywords:
      "weekly planner, weekly schedule template, weekly organizer, week planner online, weekly calendar planner, weekly agenda maker, weekly planning tool, weekly schedule organizer",
    canonical: `${SITE_CONFIG.url}/weekly-planner`,
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
