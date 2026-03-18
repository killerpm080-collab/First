import { v4 as uuidv4 } from 'uuid';
import db from './database';

// AI Product Generation Templates
const productTemplates = {
  'ai-tools': {
    prefixes: ['AI-Powered', 'Smart', 'Intelligent', 'Automated', 'Neural', 'Machine Learning'],
    types: ['Content Generator', 'Data Analyzer', 'Workflow Automator', 'Chatbot', 'Image Processor', 'Text Summarizer', 'Code Assistant', 'Predictive Analytics Tool'],
    benefits: ['Save 10+ hours/week', 'Boost productivity by 300%', 'Eliminate manual work', 'Get instant results', 'Scale your business', 'Reduce costs by 80%'],
    features: ['API integration', 'No-code interface', 'Custom training', 'Real-time processing', 'Batch operations', 'Cloud-based', 'Secure encryption']
  },
  'ebooks': {
    prefixes: ['Ultimate', 'Complete', 'Master', 'Definitive', 'Essential', 'Proven'],
    types: ['Guide to', 'Handbook for', 'Secrets of', 'Blueprint for', 'Roadmap to', 'Mastery of'],
    topics: ['Digital Marketing', 'AI Implementation', 'Business Growth', 'Passive Income', 'Productivity Hacks', 'Startup Success', 'Freelancing', 'E-commerce'],
    benefits: ['Step-by-step strategies', 'Proven frameworks', 'Real case studies', 'Actionable templates', 'Expert insights', 'Lifetime value']
  },
  'courses': {
    prefixes: ['Complete', 'Advanced', 'Beginner to Pro', 'Masterclass', 'Intensive', 'Certification'],
    types: ['Bootcamp', 'Masterclass', 'Workshop', 'Academy', 'Training Program', 'Certification Course'],
    topics: ['AI & Machine Learning', 'Web Development', 'Digital Marketing', 'Graphic Design', 'Business Strategy', 'Personal Development', 'Content Creation'],
    benefits: ['HD video lessons', 'Downloadable resources', 'Certificate of completion', 'Lifetime access', 'Community support', 'Expert instructor']
  },
  'templates': {
    prefixes: ['Professional', 'Premium', 'Customizable', 'Ready-to-Use', 'High-Converting', 'Stunning'],
    types: ['Business Plan Template', 'Social Media Kit', 'Resume Template', 'Presentation Deck', 'Email Sequence', 'Landing Page', 'Invoice Template', 'Contract Template'],
    formats: ['Notion', 'Excel', 'Word', 'PowerPoint', 'Google Sheets', 'Figma', 'Canva', 'PDF'],
    benefits: ['Fully editable', 'Save hours of work', 'Professional design', 'Easy customization', 'Multiple formats', 'Instant download']
  },
  'graphics': {
    prefixes: ['Premium', 'Exclusive', 'High-Quality', 'Professional', 'Modern', 'Creative'],
    types: ['Icon Pack', 'Illustration Set', 'UI Kit', 'Logo Bundle', 'Social Media Graphics', 'Stock Photos', 'Vector Pack', 'Texture Collection'],
    styles: ['Minimalist', '3D', 'Flat Design', 'Hand-drawn', 'Geometric', 'Abstract', 'Realistic', 'Vintage'],
    benefits: ['300+ items included', 'Multiple formats (AI, PSD, PNG, SVG)', 'Commercial license', 'Regular updates', 'Organized layers', 'Easy to customize']
  },
  'audio': {
    prefixes: ['Professional', 'Royalty-Free', 'Studio-Quality', 'Premium', 'Cinematic', 'Immersive'],
    types: ['Music Pack', 'Sound Effects Library', 'Podcast Intro Pack', 'Meditation Audio', 'Background Music', 'Voice Over Kit', 'Audio Logo Pack'],
    genres: ['Corporate', 'Electronic', 'Cinematic', 'Ambient', 'Upbeat', 'Relaxing', 'Dramatic', 'Inspirational'],
    benefits: ['100% royalty-free', 'High-quality WAV files', 'Instant download', 'Multiple variations', 'Professional mixing', 'Commercial use license']
  },
  'software': {
    prefixes: ['Powerful', 'Lightning-Fast', 'All-in-One', 'Smart', 'Advanced', 'Essential'],
    types: ['Productivity Suite', 'File Converter', 'Backup Tool', 'Security Software', 'Automation Tool', 'Analytics Dashboard', 'Project Manager', 'Time Tracker'],
    platforms: ['Windows', 'Mac', 'Linux', 'Web App', 'Chrome Extension', 'Mobile App'],
    benefits: ['One-time purchase', 'Lifetime updates', 'No subscription', '24/7 support', 'Easy setup', 'Powerful features']
  }
};

// Generate a random product for a category
export function generateProduct(categoryId: string, index: number): any {
  const templates = productTemplates[categoryId as keyof typeof productTemplates];
  if (!templates) return null;

  const prefix = templates.prefixes[Math.floor(Math.random() * templates.prefixes.length)];
  const type = templates.types[Math.floor(Math.random() * templates.types.length)];
  
  let title, description, shortDescription, price, tags, fileType, fileSize;

  switch (categoryId) {
    case 'ai-tools':
      const benefit = templates.benefits[Math.floor(Math.random() * templates.benefits.length)];
      const feature = templates.features[Math.floor(Math.random() * templates.features.length)];
      title = `${prefix} ${type}`;
      shortDescription = `${benefit} with this powerful AI solution.`;
      description = `# ${title}\n\n## Transform Your Workflow\n\n${shortDescription}\n\n### Key Features:\n- ${feature}\n- ${templates.features[Math.floor(Math.random() * templates.features.length)]}\n- ${templates.features[Math.floor(Math.random() * templates.features.length)]}\n- ${templates.features[Math.floor(Math.random() * templates.features.length)]}\n\n### What's Included:\n- Complete source code\n- Documentation\n- API access\n- Video tutorials\n- 6 months support\n\nStart automating today!`;
      price = [29, 49, 79, 99, 149, 199][Math.floor(Math.random() * 6)];
      tags = ['AI', 'Automation', 'Productivity', 'SaaS'];
      fileType = 'ZIP';
      fileSize = `${(Math.random() * 100 + 10).toFixed(1)} MB`;
      break;

    case 'ebooks':
      const topic = templates.topics[Math.floor(Math.random() * templates.topics.length)];
      const bookType = templates.types[Math.floor(Math.random() * templates.types.length)];
      title = `${prefix} ${bookType} ${topic}`;
      shortDescription = `Discover the ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)].toLowerCase()} to master ${topic.toLowerCase()}.`;
      description = `# ${title}\n\n## Your Complete Resource\n\n${shortDescription}\n\n### Inside This Book:\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n\n### Perfect For:\n- Beginners looking to get started\n- Professionals wanting to level up\n- Entrepreneurs seeking growth\n- Anyone ready to succeed\n\nGet instant access and start reading today!`;
      price = [9.99, 14.99, 19.99, 24.99, 29.99][Math.floor(Math.random() * 5)];
      tags = ['eBook', topic, 'Guide', 'Education'];
      fileType = 'PDF';
      fileSize = `${(Math.random() * 20 + 2).toFixed(1)} MB`;
      break;

    case 'courses':
      const courseTopic = templates.topics[Math.floor(Math.random() * templates.topics.length)];
      const courseType = templates.types[Math.floor(Math.random() * templates.types.length)];
      title = `${prefix} ${courseType}: ${courseTopic}`;
      shortDescription = `Master ${courseTopic} with ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)].toLowerCase()}.`;
      description = `# ${title}\n\n## Learn From the Best\n\n${shortDescription}\n\n### Course Includes:\n- ${Math.floor(Math.random() * 30 + 10)+' video lessons'}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n\n### What You'll Learn:\n- Core concepts and fundamentals\n- Advanced techniques\n- Real-world applications\n- Industry best practices\n\nEnroll now and start your journey!`;
      price = [49, 79, 99, 149, 199, 299][Math.floor(Math.random() * 6)];
      tags = ['Course', 'Video', courseTopic, 'Education'];
      fileType = 'Online';
      fileSize = 'N/A';
      break;

    case 'templates':
      const format = templates.formats[Math.floor(Math.random() * templates.formats.length)];
      title = `${prefix} ${type}`;
      shortDescription = `${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]} in ${format} format.`;
      description = `# ${title}\n\n## Professional Quality\n\n${shortDescription}\n\n### What's Included:\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n\n### Features:\n- ${format} compatible\n- Fully customizable\n- Print-ready\n- Commercial license included\n\nDownload instantly and get started!`;
      price = [9.99, 14.99, 19.99, 24.99, 29.99, 39.99][Math.floor(Math.random() * 6)];
      tags = ['Template', format, 'Business', 'Design'];
      fileType = format;
      fileSize = `${(Math.random() * 50 + 5).toFixed(1)} MB`;
      break;

    case 'graphics':
      const style = templates.styles[Math.floor(Math.random() * templates.styles.length)];
      title = `${prefix} ${style} ${type}`;
      shortDescription = `${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]} for your creative projects.`;
      description = `# ${title}\n\n## Stunning Visuals\n\n${shortDescription}\n\n### Package Includes:\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n\n### File Formats:\n- AI (Adobe Illustrator)\n- PSD (Photoshop)\n- PNG (Transparent)\n- SVG (Vector)\n\n### Perfect For:\n- Web design\n- Social media\n- Marketing materials\n- Presentations\n\nElevate your designs today!`;
      price = [19.99, 29.99, 39.99, 49.99, 79.99][Math.floor(Math.random() * 5)];
      tags = ['Graphics', style, 'Design', 'Creative'];
      fileType = 'ZIP';
      fileSize = `${(Math.random() * 500 + 50).toFixed(1)} MB`;
      break;

    case 'audio':
      const genre = templates.genres[Math.floor(Math.random() * templates.genres.length)];
      title = `${prefix} ${genre} ${type}`;
      shortDescription = `${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]} for your projects.`;
      description = `# ${title}\n\n## Professional Audio\n\n${shortDescription}\n\n### Collection Features:\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n\n### What's Inside:\n- ${Math.floor(Math.random() * 50 + 10)} unique tracks\n- Multiple variations\n- Loop-ready versions\n- Full quality WAV files\n\n### Usage:\n- YouTube videos\n- Podcasts\n- Commercials\n- Games\n- Presentations\n\nDownload now and enhance your audio!`;
      price = [19.99, 29.99, 39.99, 49.99, 99.99][Math.floor(Math.random() * 5)];
      tags = ['Audio', 'Music', genre, 'Royalty-Free'];
      fileType = 'ZIP';
      fileSize = `${(Math.random() * 1000 + 100).toFixed(1)} MB`;
      break;

    case 'software':
      const platform = templates.platforms[Math.floor(Math.random() * templates.platforms.length)];
      title = `${prefix} ${type}`;
      shortDescription = `${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]} on ${platform}.`;
      description = `# ${title}\n\n## Boost Your Productivity\n\n${shortDescription}\n\n### Key Features:\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n- ${templates.benefits[Math.floor(Math.random() * templates.benefits.length)]}\n\n### System Requirements:\n- ${platform}\n- 4GB RAM minimum\n- 100MB disk space\n- Internet connection\n\n### Includes:\n- Lifetime license\n- Free updates\n- Technical support\n- User manual\n\nGet it now and work smarter!`;
      price = [29, 49, 79, 99, 149][Math.floor(Math.random() * 5)];
      tags = ['Software', platform, 'Productivity', 'Tool'];
      fileType = platform === 'Web App' ? 'Online' : 'EXE/DMG';
      fileSize = `${(Math.random() * 200 + 20).toFixed(1)} MB`;
      break;

    default:
      return null;
  }

  const slug = `${categoryId}-${Date.now()}-${index}`;
  
  return {
    id: uuidv4(),
    title,
    slug,
    description,
    short_description: shortDescription,
    price,
    compare_price: Math.round(price * 1.5 * 100) / 100,
    category_id: categoryId,
    tags: JSON.stringify(tags),
    thumbnail: `/products/${categoryId}-${(index % 10) + 1}.jpg`,
    gallery: JSON.stringify([]),
    file_url: `/downloads/${slug}.zip`,
    file_size: fileSize,
    file_type: fileType,
    status: 'active',
    featured: Math.random() > 0.8,
    trending: Math.random() > 0.85,
    new_arrival: true,
    ai_generated: true,
    ai_prompt: `Generated for ${categoryId} category`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Generate multiple products
export function generateProducts(count: number = 10): any[] {
  const categories = Object.keys(productTemplates);
  const products: any[] = [];

  for (let i = 0; i < count; i++) {
    const categoryId = categories[i % categories.length];
    const product = generateProduct(categoryId, i);
    if (product) {
      products.push(product);
    }
  }

  return products;
}

// Save generated products to database
export function saveGeneratedProducts(products: any[]): number {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO products (
      id, title, slug, description, short_description, price, compare_price,
      category_id, tags, thumbnail, gallery, file_url, file_size, file_type,
      status, featured, trending, new_arrival, ai_generated, ai_prompt, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let inserted = 0;
  const insertMany = db.transaction((items: any[]) => {
    for (const item of items) {
      try {
        insert.run(
          item.id, item.title, item.slug, item.description, item.short_description,
          item.price, item.compare_price, item.category_id, item.tags, item.thumbnail,
          item.gallery, item.file_url, item.file_size, item.file_type, item.status,
          item.featured, item.trending, item.new_arrival, item.ai_generated,
          item.ai_prompt, item.created_at, item.updated_at
        );
        inserted++;
      } catch (e) {
        console.error('Error inserting product:', e);
      }
    }
  });

  insertMany(products);
  return inserted;
}

// Generate marketing content
export function generateMarketingContent(type: string, product?: any): any {
  const templates: any = {
    email: {
      subjects: [
        '🚀 New AI-Generated Products Just Dropped!',
        '💎 Exclusive: 50% Off Premium Digital Products',
        '🎯 Your Weekly Curated Collection is Here',
        '⚡ Flash Sale: Top-Rated Products 70% Off',
        '🎁 Free Download: This Week\'s Featured Product'
      ],
      bodies: [
        `Hey there!\n\nWe've just added amazing new digital products to our marketplace. Check out the latest AI-generated tools, templates, and resources designed to boost your productivity.\n\nDon't miss out - these are flying off the virtual shelves!\n\nShop Now`,
        `Hello!\n\nReady to level up? Our AI has curated the perfect collection of products just for you. From cutting-edge AI tools to stunning design assets, we've got everything you need.\n\nLimited time offer: Use code SAVE20 for 20% off!`,
        `Hi!\n\nYour favorite digital marketplace just got better. We've added ${Math.floor(Math.random() * 20 + 10)} new products this week, all generated by our advanced AI to meet your exact needs.\n\nBrowse the new arrivals and find your next game-changer.`
      ]
    },
    social: {
      posts: [
        `🚀 Just launched: AI-powered digital products that will transform your workflow! Check out our latest collection. #DigitalProducts #AI #Productivity`,
        `💡 Did you know? Our AI generates new products every week based on what YOU need. Discover the future of digital marketplaces. #Innovation #DigitalGoods`,
        `🎯 Looking for [product type]? We've got ${Math.floor(Math.random() * 100 + 50)}+ options, all with instant download. Shop now! #DigitalDownloads #Templates`,
        `⚡ Flash sale alert! Get 50% off premium digital products for the next 24 hours only. Don't miss out! #Sale #DigitalDeals`,
        `🎨 New design assets dropped! From icons to illustrations, our AI-created graphics will make your projects shine. #Design #Graphics #Creative`
      ]
    },
    banner: {
      headlines: [
        'AI-Generated Excellence',
        'Your Digital Success Starts Here',
        'Premium Products, Instant Access',
        'Transform Your Workflow Today',
        'Unlock Unlimited Creativity'
      ],
      subheadlines: [
        '50+ new products added monthly by our AI',
        'Join 10,000+ satisfied customers worldwide',
        'Secure downloads • Instant access • Lifetime updates',
        'From AI tools to design assets - we have it all',
        'Subscribe and get unlimited access to everything'
      ]
    }
  };

  if (type === 'email') {
    return {
      subject: templates.email.subjects[Math.floor(Math.random() * templates.email.subjects.length)],
      body: templates.email.bodies[Math.floor(Math.random() * templates.email.bodies.length)]
    };
  } else if (type === 'social') {
    return {
      content: templates.social.posts[Math.floor(Math.random() * templates.social.posts.length)],
      hashtags: '#DigitalProducts #AI #Productivity #DigitalDownloads #Templates'
    };
  } else if (type === 'banner') {
    return {
      headline: templates.banner.headlines[Math.floor(Math.random() * templates.banner.headlines.length)],
      subheadline: templates.banner.subheadlines[Math.floor(Math.random() * templates.banner.subheadlines.length)],
      cta: 'Shop Now'
    };
  }

  return null;
}

// Schedule AI product generation
export function scheduleProductGeneration(): void {
  const categories = Object.keys(productTemplates);
  
  // Queue up products for generation
  categories.forEach((categoryId, index) => {
    const stmt = db.prepare(`
      INSERT INTO ai_product_queue (id, category_id, prompt, status, created_at)
      VALUES (?, ?, ?, 'pending', ?)
    `);
    
    stmt.run(
      uuidv4(),
      categoryId,
      `Generate new ${categoryId} product for monthly batch`,
      new Date().toISOString()
    );
  });

  console.log('Scheduled AI product generation for', categories.length, 'categories');
}

export default {
  generateProduct,
  generateProducts,
  saveGeneratedProducts,
  generateMarketingContent,
  scheduleProductGeneration
};
