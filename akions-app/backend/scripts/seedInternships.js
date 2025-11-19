require('dotenv').config();
const mongoose = require('mongoose');
const Internship = require('../models/Internship');

const sampleInternships = [
  {
    title: "Full Stack Developer Intern",
    company: "Akions",
    location: "Remote",
    type: "Remote",
    duration: "6 months",
    stipend: "₹25,000/month",
    description: "Join our dynamic team and work on cutting-edge web applications. You'll gain hands-on experience with React, Node.js, and modern development practices.",
    requirements: ["React", "Node.js", "MongoDB", "JavaScript"],
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "Express"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    isActive: true,
  },
  {
    title: "AI/ML Research Intern",
    company: "Akions",
    location: "Hybrid",
    type: "Hybrid",
    duration: "3 months",
    stipend: "₹30,000/month",
    description: "Work on exciting AI projects including natural language processing, computer vision, and machine learning model development.",
    requirements: ["Python", "TensorFlow", "PyTorch", "Data Science"],
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
    isActive: true,
  },
  {
    title: "UI/UX Design Intern",
    company: "Akions",
    location: "Remote",
    type: "Remote",
    duration: "4 months",
    stipend: "₹20,000/month",
    description: "Create beautiful and intuitive user interfaces. Work with our design team to bring ideas to life using Figma, Adobe XD, and modern design principles.",
    requirements: ["Figma", "Adobe XD", "Design Thinking", "Prototyping"],
    skills: ["Figma", "Adobe XD", "UI/UX Design", "Prototyping", "User Research"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    isActive: true,
  },
  {
    title: "DevOps Engineering Intern",
    company: "Akions",
    location: "Remote",
    type: "Remote",
    duration: "6 months",
    stipend: "₹28,000/month",
    description: "Learn cloud infrastructure, CI/CD pipelines, containerization, and automation. Work with AWS, Docker, Kubernetes, and modern DevOps tools.",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    isActive: true,
  },
  {
    title: "Mobile App Development Intern",
    company: "Akions",
    location: "Remote",
    type: "Remote",
    duration: "5 months",
    stipend: "₹26,000/month",
    description: "Build mobile applications for iOS and Android using React Native. Work on real projects that reach thousands of users.",
    requirements: ["React Native", "JavaScript", "Mobile Development"],
    skills: ["React Native", "JavaScript", "iOS", "Android", "Mobile UI/UX"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    isActive: true,
  },
];

async function seedInternships() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing internships (optional - remove if you want to keep existing)
    // await Internship.deleteMany({});

    // Insert sample internships
    const created = await Internship.insertMany(sampleInternships);
    console.log(`✅ Created ${created.length} internships!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding internships:', error);
    process.exit(1);
  }
}

seedInternships();

