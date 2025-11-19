const { ChatMessage, ChatSession } = require('../models/Chat');

// Knowledge base for accurate responses
const knowledgeBase = {
  greetings: [
    'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'
  ],
  services: {
    keywords: ['service', 'services', 'development', 'develop', 'build', 'create', 'app', 'website', 'software'],
    response: `Akions offers comprehensive services including:

📱 **Mobile App Development**
- Flutter apps (iOS & Android)
- Native Android development
- Native iOS development
- Cross-platform solutions

🌐 **Web Development**
- React, Vue, Angular applications
- Full-stack web solutions
- Progressive Web Apps (PWA)
- E-commerce platforms

⚙️ **Backend Development**
- RESTful APIs
- GraphQL APIs
- Microservices architecture
- Database design & optimization

☁️ **Cloud & Hosting**
- AWS, Azure, GCP deployment
- Server management
- DevOps & CI/CD
- Infrastructure setup

🏢 **Enterprise Solutions**
- Custom software development
- System integration
- Legacy system modernization
- Scalable architecture design

📚 **Training & Consulting**
- Technical training programs
- Code reviews
- Architecture consulting
- Team mentoring

Visit our Services page to learn more or contact us for a custom quote!`
  },
  products: {
    keywords: ['product', 'products', 'marketplace', 'buy', 'purchase', 'price', 'cost'],
    response: `Our Marketplace features a wide range of products:

🛒 **Software Products**
- Ready-to-use applications
- SaaS solutions
- Mobile apps
- Web applications

💼 **Enterprise Solutions**
- Custom business software
- CRM systems
- ERP solutions
- Analytics platforms

📦 **Development Tools**
- Code templates
- UI component libraries
- API integrations
- Starter kits

All products come with:
✅ Full documentation
✅ Support & maintenance
✅ Regular updates
✅ Source code access (where applicable)

Browse our Marketplace to see all available products with detailed descriptions and pricing!`
  },
  internships: {
    keywords: ['internship', 'intern', 'internships', 'apply', 'application', 'opportunity', 'job', 'position'],
    response: `We offer exciting internship opportunities in:

💻 **Software Development**
- Full-stack development
- Mobile app development
- Backend engineering
- Frontend development

🎨 **Design**
- UI/UX design
- Graphic design
- Product design
- Brand design

📊 **Marketing & Growth**
- Digital marketing
- Content creation
- Social media management
- SEO/SEM

📈 **Business & Operations**
- Product management
- Business analysis
- Project coordination
- Data analysis

**Benefits:**
- Remote work options
- Competitive stipends
- Real-world projects
- Mentorship from experts
- Certificate of completion

Check our Internships page to see current openings and apply!`
  },
  blog: {
    keywords: ['blog', 'article', 'post', 'read', 'news', 'update', 'information'],
    response: `Our blog features:

📝 **Technology Insights**
- Latest tech trends
- Development tutorials
- Best practices
- Industry news

💡 **Career Guidance**
- Interview tips
- Skill development
- Career paths
- Success stories

🚀 **Company Updates**
- New product launches
- Team highlights
- Event announcements
- Success milestones

📚 **Educational Content**
- Programming guides
- Design principles
- Business strategies
- Case studies

Visit our Blog page to read the latest articles and stay updated!`
  },
  contact: {
    keywords: ['contact', 'email', 'phone', 'reach', 'support', 'help', 'assistance', 'get in touch'],
    response: `You can reach us through:

📧 **Email**: contact@akions.com
📞 **Phone**: +1 (234) 567-890
📍 **Address**: 123 Tech Street, San Francisco, CA 94105

**Response Time:**
- General inquiries: Within 24 hours
- Support requests: Within 12 hours
- Urgent matters: Within 4 hours

You can also:
- Fill out the contact form on our Contact page
- Use this chat for immediate assistance
- Schedule a call through our website

We're here to help!`
  },
  about: {
    keywords: ['about', 'company', 'team', 'who', 'what', 'mission', 'vision', 'story'],
    response: `**About Akions:**

Founded in 2020, Akions is a leading platform connecting talented individuals with opportunities in the tech industry.

**Our Mission:**
To empower individuals and businesses by providing a seamless platform for collaboration and growth.

**What We Do:**
- Connect talent with opportunities
- Provide quality software products
- Offer comprehensive development services
- Foster innovation and learning

**Our Values:**
- Innovation & Excellence
- Collaboration & Teamwork
- Integrity & Transparency
- Growth & Development

**Achievements:**
- 500+ Active Internships
- 1000+ Products Delivered
- 50+ Team Members
- 98% Client Satisfaction

Visit our About page to learn more about our team and values!`
  },
  pricing: {
    keywords: ['price', 'pricing', 'cost', 'fee', 'charge', 'expensive', 'cheap', 'affordable'],
    response: `**Pricing Information:**

💰 **Products**
- Prices vary by product (listed on each product page)
- One-time purchase or subscription options
- Discounts available for bulk purchases

💼 **Services**
- Custom quotes based on project requirements
- Hourly rates: $50-$150/hour (varies by service)
- Fixed-price projects available
- Enterprise packages with special pricing

🎓 **Training**
- Individual sessions: $100-$200/hour
- Group training: Custom pricing
- Corporate training: Volume discounts

📧 **Contact us** at contact@akions.com for detailed pricing tailored to your needs!

We offer flexible payment options and can work within your budget.`
  },
  application: {
    keywords: ['apply', 'application', 'how to apply', 'process', 'requirements', 'qualification'],
    response: `**How to Apply:**

**For Internships:**
1. Browse available internships on our Internships page
2. Click "Apply Now" on your preferred position
3. Fill out the application form with:
   - Personal information
   - Resume/CV
   - Cover letter
   - Skills & experience
4. Submit and wait for our team to review
5. We'll contact you within 5-7 business days

**For Products:**
1. Browse our Marketplace
2. Select a product
3. Click "Buy Now"
4. Complete payment via Razorpay
5. Receive product access immediately

**For Custom Projects:**
1. Visit our Services page
2. Fill out the contact form
3. We'll schedule a consultation call
4. Receive a custom quote
5. Start your project!

Need help? Contact us at contact@akions.com`
  },
  technical: {
    keywords: ['technical', 'tech', 'technology', 'stack', 'framework', 'language', 'programming'],
    response: `**Our Technical Expertise:**

**Frontend Technologies:**
- React, Vue, Angular
- Next.js, Nuxt.js
- TypeScript, JavaScript
- HTML5, CSS3, SASS

**Backend Technologies:**
- Node.js, Express
- Python, Django, Flask
- Java, Spring Boot
- PHP, Laravel
- Go, Rust

**Mobile Development:**
- Flutter, React Native
- Swift (iOS)
- Kotlin, Java (Android)

**Databases:**
- MongoDB, PostgreSQL
- MySQL, Redis
- Firebase, Supabase

**Cloud & DevOps:**
- AWS, Azure, GCP
- Docker, Kubernetes
- CI/CD pipelines
- Serverless architecture

**Tools & Practices:**
- Git, GitHub, GitLab
- Agile/Scrum methodologies
- Test-driven development
- Code reviews

We stay updated with the latest technologies and best practices!`
  }
};

// Enhanced response generation with context awareness
const generateResponse = async (message, conversationHistory = [], sessionId) => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Remove common filler words for better matching
  const cleanMessage = lowerMessage.replace(/\b(please|can you|could you|tell me|i want|i need|about|the|a|an)\b/g, '').trim();
  
  // Check for greetings
  if (knowledgeBase.greetings.some(g => lowerMessage.includes(g))) {
    return `Hello! 👋 Welcome to Akions. I'm your AI assistant here to help you with:
    
• Our services and products
• Internship opportunities
• Technical questions
• General inquiries

What would you like to know?`;
  }
  
  // Check for services
  if (knowledgeBase.services.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.services.response;
  }
  
  // Check for products/marketplace
  if (knowledgeBase.products.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.products.response;
  }
  
  // Check for internships
  if (knowledgeBase.internships.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.internships.response;
  }
  
  // Check for blog
  if (knowledgeBase.blog.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.blog.response;
  }
  
  // Check for contact
  if (knowledgeBase.contact.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.contact.response;
  }
  
  // Check for about
  if (knowledgeBase.about.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.about.response;
  }
  
  // Check for pricing
  if (knowledgeBase.pricing.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.pricing.response;
  }
  
  // Check for application process
  if (knowledgeBase.application.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.application.response;
  }
  
  // Check for technical questions
  if (knowledgeBase.technical.keywords.some(k => cleanMessage.includes(k))) {
    return knowledgeBase.technical.response;
  }
  
  // Context-aware responses based on conversation history
  if (conversationHistory && conversationHistory.length > 0) {
    const lastMessages = conversationHistory.slice(-3).map(m => m.content.toLowerCase());
    const context = lastMessages.join(' ');
    
    // If user is asking follow-up questions about services
    if (context.includes('service') && (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('where'))) {
      return `Based on our previous conversation about services, you can:
      
1. **View all services** on our Services page
2. **Contact us** for a custom quote at contact@akions.com
3. **Browse products** in our Marketplace for ready-made solutions
4. **Schedule a consultation** through our contact form

Would you like more specific information about any particular service?`;
    }
    
    // If user is asking about internships
    if (context.includes('internship') && (lowerMessage.includes('when') || lowerMessage.includes('how long') || lowerMessage.includes('duration'))) {
      return `Internship durations vary by position:
      
• **Short-term**: 1-3 months
• **Medium-term**: 3-6 months
• **Long-term**: 6-12 months

Most internships are:
- Remote-friendly
- Flexible hours
- Project-based
- Mentorship-focused

Check individual internship listings for specific duration and requirements!`;
    }
  }
  
  // Specific question patterns
  if (lowerMessage.includes('what is') || lowerMessage.includes('what are')) {
    return `I'd be happy to explain! Could you be more specific about what you'd like to know? For example:
    
• "What services do you offer?"
• "What products are available?"
• "What internships are open?"
• "What technologies do you use?"

Or you can browse our website sections for detailed information!`;
  }
  
  if (lowerMessage.includes('how do i') || lowerMessage.includes('how can i')) {
    return `Here's how you can proceed:
    
1. **Browse our website** - Navigate through Services, Marketplace, Internships, or Blog sections
2. **Use the search bar** - Find specific content quickly
3. **Contact us directly** - Email contact@akions.com or use the contact form
4. **Apply for opportunities** - Visit the Internships page to apply

What specific action would you like help with?`;
  }
  
  if (lowerMessage.includes('where') || lowerMessage.includes('location')) {
    return `**Our Location:**
📍 123 Tech Street, San Francisco, CA 94105

**Contact:**
📧 Email: contact@akions.com
📞 Phone: +1 (234) 567-890

**Online Presence:**
🌐 Website: www.akions.com
💬 Chat: Available 24/7 (you're using it now!)

Most of our services are available remotely, so location isn't a barrier!`;
  }
  
  if (lowerMessage.includes('when') || lowerMessage.includes('time') || lowerMessage.includes('hours')) {
    return `**Our Availability:**
    
⏰ **Business Hours:**
- Monday - Friday: 9:00 AM - 6:00 PM PST
- Saturday: 10:00 AM - 4:00 PM PST
- Sunday: Closed

💬 **Chat Support:**
- Available 24/7 (automated responses)
- Human support during business hours

📧 **Email Response:**
- Within 24 hours for general inquiries
- Within 12 hours for support requests

We're here to help whenever you need us!`;
  }
  
  // Default intelligent response
  return `I understand you're asking about "${message}". 

At Akions, we specialize in:
• Software development services
• Product marketplace
• Internship opportunities
• Training and consulting

To give you the most accurate answer, could you be more specific? For example:
- "Tell me about your mobile app development services"
- "What internships are available?"
- "How do I apply for an internship?"
- "What products do you have?"

Or you can browse our website sections:
- **Services** - Development services
- **Marketplace** - Products
- **Internships** - Opportunities
- **Blog** - Articles and updates
- **About** - Company information

How can I help you further?`;
};

module.exports = {
  generateResponse,
  knowledgeBase,
};





