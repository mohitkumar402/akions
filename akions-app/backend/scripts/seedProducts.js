require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  // Software Products (from image)
  {
    title: "Project Management Tool",
    description: "Streamline your projects with this intuitive tool.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    category: "Productivity",
    price: 2999,
    rating: 4.8,
    isActive: true,
  },
  {
    title: "E-commerce Platform",
    description: "Launch your online store with this powerful platform.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    category: "E-commerce",
    price: 4999,
    rating: 4.6,
    isActive: true,
  },
  {
    title: "Customer Relationship Manager",
    description: "Manage customer interactions effectively.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    category: "Business",
    price: 3999,
    rating: 4.7,
    isActive: true,
  },
  {
    title: "Data Analytics Dashboard",
    description: "Visualize and analyze your data with ease.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    category: "Analytics",
    price: 4499,
    rating: 4.9,
    isActive: true,
  },
  {
    title: "Social Media Scheduler",
    description: "Schedule and manage your social media posts.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
    category: "Marketing",
    price: 1999,
    rating: 4.5,
    isActive: true,
  },
  // Teaching & Training Products
  {
    title: "Flutter App Development Course",
    description: "Complete Flutter development course with hands-on projects and real-world examples.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    category: "Teaching",
    price: 4999,
    rating: 4.9,
    isActive: true,
  },
  {
    title: "Android Development Masterclass",
    description: "Learn Android app development from basics to advanced topics with Kotlin and Java.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    category: "Teaching",
    price: 5999,
    rating: 4.8,
    isActive: true,
  },
  {
    title: "Web Application Development Bootcamp",
    description: "Full-stack web development course covering React, Node.js, and modern frameworks.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    category: "Teaching",
    price: 6999,
    rating: 4.9,
    isActive: true,
  },
  {
    title: "Backend Development with Node.js",
    description: "Master backend development, APIs, databases, and server architecture.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    category: "Teaching",
    price: 5499,
    rating: 4.7,
    isActive: true,
  },
  // Software Development Services
  {
    title: "Flutter Mobile App Development",
    description: "Professional Flutter app development for iOS and Android. Cross-platform solutions.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    category: "Software Development",
    price: 50000,
    rating: 4.9,
    isActive: true,
  },
  {
    title: "Android Native App Development",
    description: "Custom Android applications built with Kotlin/Java. Enterprise-grade solutions.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    category: "Software Development",
    price: 60000,
    rating: 4.8,
    isActive: true,
  },
  {
    title: "Web Application Development",
    description: "Modern web applications with React, Vue, or Angular. Responsive and scalable.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    category: "Software Development",
    price: 45000,
    rating: 4.9,
    isActive: true,
  },
  {
    title: "Enterprise Backend Development",
    description: "Scalable backend systems with microservices architecture. Cloud-ready solutions.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    category: "Software Development",
    price: 100000,
    rating: 5.0,
    isActive: true,
  },
  // Hosting & Infrastructure
  {
    title: "Cloud Hosting & Deployment",
    description: "Professional hosting setup on AWS, Azure, or GCP. CI/CD pipeline included.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    category: "Hosting",
    price: 15000,
    rating: 4.8,
    isActive: true,
  },
  {
    title: "Enterprise Server Management",
    description: "Dedicated server management, monitoring, and maintenance. 24/7 support.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    category: "Hosting",
    price: 25000,
    rating: 4.9,
    isActive: true,
  },
  {
    title: "DevOps & Infrastructure Setup",
    description: "Complete DevOps pipeline with Docker, Kubernetes, and automated deployments.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    category: "Hosting",
    price: 35000,
    rating: 4.9,
    isActive: true,
  },
  // Enterprise Solutions
  {
    title: "Enterprise Software Solutions",
    description: "Custom enterprise software tailored to your business needs. Scalable and secure.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    category: "Enterprise",
    price: 200000,
    rating: 5.0,
    isActive: true,
  },
  {
    title: "Enterprise Backend Architecture",
    description: "Design and implement enterprise-grade backend systems with best practices.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    category: "Enterprise",
    price: 150000,
    rating: 5.0,
    isActive: true,
  },
  {
    title: "Enterprise Mobile Solutions",
    description: "Enterprise mobile applications with security, scalability, and compliance.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    category: "Enterprise",
    price: 120000,
    rating: 4.9,
    isActive: true,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products (optional - remove if you want to keep existing)
    // await Product.deleteMany({});

    // Insert sample products
    const created = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${created.length} products!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

