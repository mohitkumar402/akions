export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
  lastLoginIp?: string;
  lastLoginAt?: string;
}

export interface Product {
  id: string;
  _id?: string; // MongoDB _id from backend
  title: string;
  description: string;
  image: string;
  category: string;
  price?: number;
  rating?: number;
}

export interface Internship {
  id: string;
  _id?: string; // MongoDB _id from backend
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  duration: string;
  stipend: string;
  description: string;
  image: string;
  skills?: string[];
  requirements?: string[];
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  userId: string;
  appliedAt: string;
  ip?: string;
}

export interface BlogPost {
  id: string;
  _id?: string; // MongoDB _id from backend
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  image: string;
  category: string;
  likes: number;
  shares: number;
  comments: Comment[];
  tags?: string[]; // Optional tags for blog posts
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Value {
  id: string;
  title: string;
  description: string;
  icon: string;
}
