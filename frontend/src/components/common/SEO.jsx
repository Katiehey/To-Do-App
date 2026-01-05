import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'TaskMaster Pro',
  description = 'A powerful task management app with projects, calendar, recurring tasks, and more. Stay organized and boost your productivity.',
  keywords = 'task manager, todo list, productivity, project management, task organizer, calendar, recurring tasks',
  author = 'TaskMaster Pro',
  image = '/og-image.png',
  url = window.location.href,
  type = 'website'
}) => {
  const siteName = 'TaskMaster Pro';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

// Page-specific SEO presets
export const HomePageSEO = () => (
  <SEO
    title="Home"
    description="Welcome to TaskMaster Pro - Your all-in-one task management solution. Organize tasks, manage projects, and boost productivity."
  />
);

export const TasksPageSEO = () => (
  <SEO
    title="My Tasks"
    description="View and manage all your tasks. Create, organize, and complete tasks efficiently with TaskMaster Pro."
  />
);

export const ProjectsPageSEO = () => (
  <SEO
    title="Projects"
    description="Organize your tasks into projects. Track progress and manage multiple projects with ease."
  />
);

export const CalendarPageSEO = () => (
  <SEO
    title="Calendar"
    description="View your tasks in calendar format. Plan your schedule and never miss a deadline."
  />
);

export const SettingsPageSEO = () => (
  <SEO
    title="Settings"
    description="Customize your TaskMaster Pro experience. Manage notifications, preferences, and account settings."
  />
);

export default SEO;
