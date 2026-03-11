const mongoose = require('mongoose');

// Banner/Carousel Slide Schema
const BannerSlideSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, required: true },
  buttonText: { type: String, default: 'Learn More' },
  buttonRoute: { type: String, default: 'Home' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

// Service Item Schema
const ServiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '📱' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

// Testimonial Schema
const TestimonialSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  content: { type: String, required: true },
  avatar: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

// Section Config Schema
const SectionConfigSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  buttonRoute: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
}, { _id: false });

// Footer Link Schema
const FooterLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  route: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { _id: false });

// Main Site Settings Schema
const SiteSettingsSchema = new mongoose.Schema({
  // Theme Settings
  theme: {
    mode: { type: String, enum: ['light', 'dark'], default: 'light' },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#7c3aed' },
    accentColor: { type: String, default: '#059669' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1f2937' },
    cardBackground: { type: String, default: '#f9fafb' },
  },
  
  // Banner/Carousel Settings
  banners: [BannerSlideSchema],
  bannerAutoPlay: { type: Boolean, default: true },
  bannerInterval: { type: Number, default: 4000 },
  
  // Section Configurations
  sections: {
    heroTitle: { type: String, default: 'Welcome to Ekions' },
    heroSubtitle: { type: String, default: 'Empowering Innovation' },
    
    // Core Verticals Section
    verticalsSection: {
      type: SectionConfigSchema,
      default: {
        title: 'Ekions: Three Core Verticals',
        subtitle: 'Ekions offers a comprehensive platform with three key areas to meet your business needs.',
        isVisible: true,
      }
    },
    
    // Featured Internships Section
    internshipsSection: {
      type: SectionConfigSchema,
      default: {
        title: 'Featured Internships',
        subtitle: 'Connect with talented interns and foster new talent',
        description: 'Discover exciting internship opportunities across various domains including software development, marketing, design, and data analysis.',
        image: '',
        buttonText: 'View All',
        buttonRoute: 'Internships',
        isVisible: true,
      }
    },
    
    // What We Are Proficient In Section
    proficiencySection: {
      type: SectionConfigSchema,
      default: {
        title: 'What We Are Proficient In',
        subtitle: 'Expert solutions across multiple technology domains',
        description: 'We excel in mobile app development, web development, cloud infrastructure, backend systems, and comprehensive training programs.',
        image: '',
        buttonText: 'Explore Products',
        buttonRoute: 'Marketplace',
        isVisible: true,
      }
    },
    
    // Blog Section
    blogSection: {
      type: SectionConfigSchema,
      default: {
        title: 'Latest Blog Posts',
        subtitle: 'Insights, updates, and stories from the Ekions community',
        description: 'Discover our latest articles covering technology trends, development insights, and industry best practices.',
        image: '',
        buttonText: 'Explore Blogs',
        buttonRoute: 'ExploreBlog',
        isVisible: true,
      }
    },
    
    // About Vision Section
    aboutSection: {
      type: SectionConfigSchema,
      default: {
        title: 'About Our Vision',
        subtitle: 'Fostering a culture of collaboration and creativity',
        description: 'Ekions is dedicated to connecting businesses with top talent and innovative solutions.',
        image: '',
        buttonText: 'Learn More',
        buttonRoute: 'About',
        isVisible: true,
      }
    },
    
    // Work With Us Section
    workWithUsSection: {
      type: SectionConfigSchema,
      default: {
        title: 'Work With Us',
        subtitle: 'Explore exciting career opportunities',
        description: 'Explore exciting career opportunities and join our innovative team.',
        image: '',
        buttonText: 'Get Started',
        buttonRoute: 'Contact',
        isVisible: true,
      }
    },
    
    // Services Section
    servicesSection: {
      type: SectionConfigSchema,
      default: {
        title: 'Our Services',
        subtitle: '',
        description: '',
        isVisible: true,
      }
    },
  },
  
  // Services List
  services: [ServiceItemSchema],
  
  // Testimonials
  testimonials: [TestimonialSchema],
  testimonialsVisible: { type: Boolean, default: true },
  
  // Footer Settings
  footer: {
    companyName: { type: String, default: 'Ekions' },
    companyDescription: { type: String, default: 'Empowering businesses and individuals through innovative technology solutions, internships, and custom projects.' },
    links: [FooterLinkSchema],
    contactEmail: { type: String, default: 'contact@ekions.com' },
    contactPhone: { type: String, default: '+916203802704' },
    copyrightText: { type: String, default: '© 2024 Ekions. All rights reserved.' },
    showSocialLinks: { type: Boolean, default: true },
    isCompact: { type: Boolean, default: true },
  },
  
  // Global SEO Settings
  seo: {
    siteName: { type: String, default: 'Ekions' },
    siteTitle: { type: String, default: 'Ekions - Innovative Tech Solutions' },
    siteDescription: { type: String, default: 'Discover innovative tech solutions, products, internships, and services at Ekions. Your trusted partner for digital transformation.' },
    siteKeywords: { type: String, default: 'Ekions, tech solutions, digital products, internships, software services, AI, machine learning, web development' },
    ogImage: { type: String, default: '' },
    twitterHandle: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
    robotsTxt: { type: String, default: 'User-agent: *\nAllow: /' },
  },
  
}, { timestamps: true });

// Ensure only one settings document exists
SiteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      banners: [
        { id: '1', title: 'Welcome to Ekions', subtitle: 'Your Technology Partner', image: '/assets/homepage header 1.png', buttonText: 'Get Started', buttonRoute: 'Home', isActive: true, order: 0 },
        { id: '2', title: 'About Us', subtitle: 'Learn Our Story', image: '/assets/about us.png', buttonText: 'Learn More', buttonRoute: 'About', isActive: true, order: 1 },
        { id: '3', title: 'Work With Us', subtitle: 'Join Our Team', image: '/assets/work with us.png', buttonText: 'Contact Us', buttonRoute: 'Contact', isActive: true, order: 2 },
      ],
      services: [
        { id: '1', title: 'Mobile App Development', description: 'Flutter, Android, iOS, React Native', icon: '📱', image: '', isActive: true, order: 0 },
        { id: '2', title: 'Web Development', description: 'React, Vue.js, Angular, Full-Stack', icon: '🌐', image: '', isActive: true, order: 1 },
        { id: '3', title: 'Hosting & Infrastructure', description: 'AWS, Azure, GCP, DevOps', icon: '☁️', image: '', isActive: true, order: 2 },
        { id: '4', title: 'Teaching & Training', description: 'Courses, Bootcamps, Masterclasses', icon: '🎓', image: '', isActive: true, order: 3 },
      ],
      testimonials: [
        { id: '1', name: 'John Doe', role: 'CEO', company: 'TechCorp', content: 'Ekions transformed our business with their innovative solutions. Highly recommended!', avatar: '', rating: 5, isActive: true, order: 0 },
        { id: '2', name: 'Jane Smith', role: 'CTO', company: 'StartupX', content: 'The team at Ekions delivered beyond our expectations. Their expertise is unmatched.', avatar: '', rating: 5, isActive: true, order: 1 },
        { id: '3', name: 'Mike Johnson', role: 'Product Manager', company: 'InnovateCo', content: 'Working with Ekions was a game-changer for our product development cycle.', avatar: '', rating: 5, isActive: true, order: 2 },
      ],
      footer: {
        links: [
          { label: 'About', route: 'About', isActive: true },
          { label: 'Services', route: 'Services', isActive: true },
          { label: 'Marketplace', route: 'Marketplace', isActive: true },
          { label: 'Internships', route: 'Internships', isActive: true },
          { label: 'Blog', route: 'Blog', isActive: true },
          { label: 'Custom Projects', route: 'CustomProjects', isActive: true },
        ],
      },
    });
  }
  return settings;
};

module.exports = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
