// Caprio Online Store — Initial Master Seed Data
// Comprehensive Brand Identity: All Types of Clothing (Men & Kids) + Full Accessories (Belts, Watches, Perfumes, Wallets)

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Collections', icon: 'Sparkles' },
  { id: 'shirts', name: 'Shirts & Polos', icon: 'Layers' },
  { id: 'tshirts', name: 'T-Shirts & Vests', icon: 'Shirt' },
  { id: 'trousers', name: 'Trousers & Loungewear', icon: 'Box' },
  { id: 'kids', name: 'Kids Collection', icon: 'Smile' },
  { id: 'accessories', name: 'Belts, Watches & Perfumes', icon: 'Watch' }
];

export const INITIAL_PRODUCTS = [
  // --- SHIRTS & POLOS (Men's Formal, Casual, Linen, Silk-blend) ---
  {
    id: 'cap-s01',
    name: 'Amalfi Pure European Linen Casual Resort Shirt',
    category: 'shirts',
    price: 1499,
    originalPrice: 2199,
    stock: 24,
    rating: 4.95,
    reviewsCount: 78,
    badge: 'Pure Linen',
    featured: true,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop',
    description: 'Woven from 100% French flax linen for breezy breathability and effortless elegance. Styled with a relaxed Cuban collar and natural carved coconut buttons.',
    specs: {
      fabric: '100% Normandy Flax Linen',
      collar: 'Cuban Resort Collar',
      fit: 'Relaxed Tailored',
      care: 'Gentle wash, line dry'
    }
  },
  {
    id: 'cap-s02',
    name: 'Caprio Oxford Classic Royal Button-Down Formal Shirt',
    category: 'shirts',
    price: 1299,
    originalPrice: 1799,
    stock: 30,
    rating: 4.88,
    reviewsCount: 94,
    badge: 'Office & Evening',
    featured: true,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop',
    description: 'Timeless 2-ply pinpoint Oxford weave in crisp white. Wrinkle-resistant finish with reinforced mother-of-pearl buttons and curved hem.',
    specs: {
      fabric: '2-Ply Pinpoint Oxford Cotton',
      collar: 'Button-Down Classic Collar',
      fit: 'Regular Fit',
      finish: 'Easy-Iron Silicone Soft Finish'
    }
  },
  {
    id: 'cap-s03',
    name: 'Caprio Silk-Cotton Blend Evening Dress Shirt',
    category: 'shirts',
    price: 1599,
    originalPrice: 2299,
    stock: 16,
    rating: 4.9,
    reviewsCount: 42,
    badge: 'Silk Blend',
    featured: true,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=900&auto=format&fit=crop',
    description: 'Lustrous silk and long-staple cotton blend dress shirt engineered with a subtle sheen for weddings, celebrations, and festive evenings.',
    specs: {
      fabric: '30% Mulberry Silk, 70% Combed Cotton',
      cuff: 'French Double Cuffs',
      fit: 'Slim Contemporary Fit',
      origin: 'Bespoke Weave'
    }
  },
  {
    id: 'cap-t02',
    name: 'Caprio Classic Pique Polo with Gold Lion Crest',
    category: 'shirts',
    price: 899,
    originalPrice: 1399,
    stock: 35,
    rating: 4.85,
    reviewsCount: 112,
    badge: 'Signature',
    featured: true,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop',
    description: 'Double-mercerized breathable pique cotton polo shirt accented with delicate metallic gold Caprio lion embroidery and anti-curl collar.',
    specs: {
      fabric: '100% Double-Mercerized Pique Cotton',
      collar: 'Ribbed Anti-Curl Collar',
      buttons: 'Mother-of-Pearl',
      fit: 'Smart Casual Fit'
    }
  },

  // --- T-SHIRTS & VESTS (Baniyans, Heavyweight Tees, Gym Vests) ---
  {
    id: 'cap-b01',
    name: 'Caprio Classic Combed Cotton Ribbed Vest (Pack of 3)',
    category: 'tshirts',
    price: 449,
    originalPrice: 599,
    stock: 65,
    rating: 4.92,
    reviewsCount: 210,
    badge: 'Bestseller',
    featured: true,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
    description: 'Ultra-breathable bio-washed sleeveless ribbed vest. Specially engineered moisture-wicking weave with reinforced contoured seams for zero chafe daily comfort.',
    specs: {
      fabric: '100% Bio-Washed Combed Cotton',
      fit: 'Comfort Contoured Fit',
      pack: 'Pack of 3 White Baniyans',
      care: 'Machine wash warm'
    }
  },
  {
    id: 'cap-t01',
    name: 'Caprio Heavyweight 240 GSM Oversized Streetwear T-Shirt',
    category: 'tshirts',
    price: 799,
    originalPrice: 1199,
    stock: 45,
    rating: 4.9,
    reviewsCount: 138,
    badge: 'Hot Seller',
    featured: true,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop',
    description: 'Dense 240 GSM heavyweight combed cotton tee with relaxed drop-shoulders and thick 1.25-inch durable ribbed collar that retains shape forever.',
    specs: {
      fabric: '100% Ring-Spun Cotton (240 GSM)',
      fit: 'Relaxed Drop Shoulder',
      color: 'Vintage Ecru / Off-White',
      finish: 'Pre-shrunk'
    }
  },
  {
    id: 'cap-b02',
    name: 'Caprio Royal Gym & Athletic Ribbed Square-Neck Vest',
    category: 'tshirts',
    price: 349,
    originalPrice: 499,
    stock: 38,
    rating: 4.8,
    reviewsCount: 95,
    badge: 'Gym Wear',
    featured: false,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop',
    description: 'Deep armhole athletic cut designed for training and daily layering. Stretch-ribbed blend provides maximum flexibility and shape retention.',
    specs: {
      fabric: '95% Cotton, 5% Spandex Stretch Rib',
      neckline: 'Modern Square Cut',
      colors: 'Obsidian Black / Charcoal Grey'
    }
  },
  {
    id: 'cap-t03',
    name: 'Caprio Essential Everyday Crewneck Tee (Pack of 2)',
    category: 'tshirts',
    price: 649,
    originalPrice: 899,
    stock: 50,
    rating: 4.75,
    reviewsCount: 88,
    badge: 'Value Pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop',
    description: 'Silky smooth 180 GSM bio-washed daily crewneck t-shirts in classic navy and black. Color-fast reactive dyes engineered to stay rich wash after wash.',
    specs: {
      fabric: '100% Combed Cotton (180 GSM)',
      fit: 'Regular Fit',
      pack: 'Pack of 2 (Obsidian Black + Navy)'
    }
  },

  // --- TROUSERS & LOUNGEWEAR (Chinos, Joggers, Boxers) ---
  {
    id: 'cap-tr01',
    name: 'Caprio All-Day Stretch Slim-Fit Chino Trousers',
    category: 'trousers',
    price: 1199,
    originalPrice: 1699,
    stock: 26,
    rating: 4.9,
    reviewsCount: 65,
    badge: 'All-Day Stretch',
    featured: true,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop',
    description: 'Premium stretch-cotton twill chinos with expandable comfort waistband and tailored flat-front silhouette. Perfect for office-to-evening transitions.',
    specs: {
      fabric: '97% Combed Cotton, 3% Elastane Twill',
      closure: 'YKK Zipper & Horn Button',
      pockets: 'Slant Front Pockets + Buttoned Welt Back Pockets',
      fit: 'Slim Straight'
    }
  },
  {
    id: 'cap-l01',
    name: 'Caprio Ultra-Soft Modal Boxers (Pack of 3)',
    category: 'trousers',
    price: 549,
    originalPrice: 799,
    stock: 42,
    rating: 4.9,
    reviewsCount: 130,
    badge: 'Cloud Soft',
    featured: false,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop',
    description: 'Micro-modal and cotton blend loungewear boxers with non-roll plush microfiber waistband and functional fly button.',
    specs: {
      fabric: '60% Micro-Modal, 40% Combed Cotton',
      waistband: 'Soft Brushed Microfiber',
      pack: 'Pack of 3 (Navy, Heather Grey, Onyx)'
    }
  },
  {
    id: 'cap-l02',
    name: 'Caprio French Terry Everyday Lounge Joggers',
    category: 'trousers',
    price: 999,
    originalPrice: 1499,
    stock: 22,
    rating: 4.85,
    reviewsCount: 57,
    badge: 'Comfort Fit',
    featured: false,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop',
    description: 'Heavyweight 320 GSM loopback French terry joggers with deep zippered phone pockets and custom gold-tipped cotton drawstrings.',
    specs: {
      fabric: '100% French Terry Cotton (320 GSM)',
      cuff: 'Snug Ribbed Ankle Cuffs',
      pockets: '2 Zipper Pockets + 1 Rear Pocket'
    }
  },

  // --- KIDS COLLECTION (Boys & Girls Apparel & Sets) ---
  {
    id: 'cap-k01',
    name: 'Caprio Junior Classic Linen Casual Mandarin Shirt',
    category: 'kids',
    price: 599,
    originalPrice: 899,
    stock: 28,
    rating: 4.9,
    reviewsCount: 44,
    badge: 'Kids Luxe',
    featured: true,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=900&auto=format&fit=crop',
    description: 'Charming pure linen-cotton blend mandarin collar shirt for young boys. Hypoallergenic, featherlight, and finished with roll-up sleeve tabs.',
    specs: {
      fabric: '55% Linen, 45% Organic Cotton',
      collar: 'Mandarin Band Collar',
      ageGroup: '3 to 14 Years',
      wash: 'Machine Wash Safe'
    }
  },
  {
    id: 'cap-k02',
    name: 'Caprio Kids Premium Cotton Graphic Hoodie & Jogger Set',
    category: 'kids',
    price: 899,
    originalPrice: 1399,
    stock: 20,
    rating: 4.95,
    reviewsCount: 62,
    badge: 'Kids Set',
    featured: true,
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=900&auto=format&fit=crop',
    description: 'Cozy two-piece fleece set featuring soft hooded pullover and matching elasticated joggers. Crafted from skin-friendly combed fleece with gentle cuffs.',
    specs: {
      fabric: '100% Brushed Combed Fleece Cotton',
      set: '2-Piece (Hoodie + Jogger)',
      ageGroup: '4 to 12 Years',
      safety: 'Azo-Free Non-Toxic Dyes'
    }
  },
  {
    id: 'cap-k03',
    name: 'Caprio Kids Everyday Super-Soft Breathable Tees (Pack of 3)',
    category: 'kids',
    price: 499,
    originalPrice: 749,
    stock: 35,
    rating: 4.88,
    reviewsCount: 51,
    badge: 'Kids Pack',
    featured: false,
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=900&auto=format&fit=crop',
    description: 'Vibrant pack of 3 lightweight summer tees in cheerful tones. Tagless back neck ensures zero itchiness during playtime and daily wear.',
    specs: {
      fabric: '100% Bio-Washed Combed Cotton',
      pack: 'Pack of 3 Pastel T-Shirts',
      collar: 'Tagless Smooth Rib Collar'
    }
  },

  // --- FULL ACCESSORIES (Belts, Watches, Perfumes, Wallets) ---
  {
    id: 'cap-a04',
    name: 'Caprio Reversible Italian Full-Grain Leather Belt',
    category: 'accessories',
    price: 799,
    originalPrice: 1299,
    stock: 40,
    rating: 4.95,
    reviewsCount: 124,
    badge: 'Top Grain',
    featured: true,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop',
    description: 'Handcrafted reversible Italian full-grain leather belt (Black & Tan Brown) featuring a 360° rotating solid brushed brass pin buckle. Complements formal suits and casual denim.',
    specs: {
      material: '100% Full-Grain Italian Calf Leather',
      buckle: 'Reversible Brushed Solid Brass',
      width: '35mm Classic Width',
      size: 'Adjustable Trim-to-Fit (28 to 44 waist)'
    }
  },
  {
    id: 'cap-a01',
    name: 'Caprio Royal Gold Chronograph Timepiece',
    category: 'accessories',
    price: 2499,
    originalPrice: 3999,
    stock: 15,
    rating: 4.95,
    reviewsCount: 88,
    badge: 'Signature Watch',
    featured: true,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop',
    description: 'Precision Japanese quartz movement housed in a surgical 316L stainless steel case with Imperial gold PVD coating, scratch-resistant crystal, and genuine leather strap.',
    specs: {
      movement: 'Multi-function Quartz Chronograph',
      waterResistance: '50m / 5 ATM Water Resistance',
      strap: 'Genuine Italian Calfskin Leather',
      glass: 'Hardened Scratch-Proof Mineral Glass'
    }
  },
  {
    id: 'cap-a05',
    name: 'Caprio Obsidian Minimalist Matte Black Watch',
    category: 'accessories',
    price: 1899,
    originalPrice: 2699,
    stock: 18,
    rating: 4.88,
    reviewsCount: 65,
    badge: 'Minimal Luxe',
    featured: true,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop',
    description: 'Ultra-slim 7mm matte black steel case with sunray obsidian dial and magnetic stainless steel Milanese mesh strap. Clean, contemporary aesthetic.',
    specs: {
      case: 'Ultra-Slim 40mm Matte Black Stainless Steel',
      strap: 'Magnetic Milanese Mesh Steel',
      dial: 'Sunray Minimalist Dial with Date'
    }
  },
  {
    id: 'cap-a03',
    name: 'Caprio Oud & Amber Royal Eau De Parfum (100ml)',
    category: 'accessories',
    price: 1499,
    originalPrice: 1999,
    stock: 22,
    rating: 5.0,
    reviewsCount: 96,
    badge: 'Luxury Parfum',
    featured: true,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=900&auto=format&fit=crop',
    description: 'Extrait de parfum featuring spicy cardamom, saffron, and velvety damascus rose layered over aged Cambodian agarwood and warm golden amber. Exceptional 12+ hour sillage.',
    specs: {
      concentration: 'Eau de Parfum (25% Oil Concentration)',
      volume: '100ml / 3.4 fl. oz.',
      notes: 'Cardamom, Rose, Agarwood, Amber, Leather',
      lasting: '12+ Hours Long-Lasting'
    }
  },
  {
    id: 'cap-a06',
    name: 'Caprio Aqua Marine Fresh Eau De Parfum (100ml)',
    category: 'accessories',
    price: 1199,
    originalPrice: 1599,
    stock: 25,
    rating: 4.85,
    reviewsCount: 72,
    badge: 'Fresh Fragrance',
    featured: true,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=900&auto=format&fit=crop',
    description: 'Exhilarating fresh aquatic fragrance infused with Calabrian bergamot, salty ocean mist, crushed mint leaves, and cedarwood. Ideal for tropical days and sports.',
    specs: {
      concentration: 'Eau de Parfum',
      volume: '100ml / 3.4 fl. oz.',
      notes: 'Bergamot, Marine Accord, Mint, White Musk'
    }
  },
  {
    id: 'cap-a02',
    name: 'Caprio Top-Grain Leather RFID Bifold Wallet',
    category: 'accessories',
    price: 699,
    originalPrice: 999,
    stock: 35,
    rating: 4.88,
    reviewsCount: 145,
    badge: 'Everyday Carry',
    featured: false,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=900&auto=format&fit=crop',
    description: 'Supple oil-tanned top-grain leather with built-in RFID blocking fabric, 8 card slots, dual currency compartments, and embossed gold Caprio crest.',
    specs: {
      material: '100% Top-Grain Cowhide Leather',
      protection: 'RFID Theft Shielding Technology',
      slots: '8 Cards, 2 Currency Bills, Coin Pocket'
    }
  }
];

export const INITIAL_COUPONS = [
  {
    id: 'c-1',
    code: 'CAPRIO10',
    type: 'percentage',
    value: 10,
    minSpend: 499,
    expiresAt: '2027-12-31',
    description: '10% off on orders above ₹499',
    active: true,
    uses: 68
  },
  {
    id: 'c-2',
    code: 'CAPRIO100',
    type: 'fixed',
    value: 100,
    minSpend: 999,
    expiresAt: '2027-12-31',
    description: 'Flat ₹100 instant discount on orders above ₹999',
    active: true,
    uses: 42
  },
  {
    id: 'c-3',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minSpend: 699,
    expiresAt: '2027-12-31',
    description: '15% First Order Welcome privilege on ₹699+',
    active: true,
    uses: 31
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'CP-89241',
    customerName: 'Rahul Menon',
    customerEmail: 'rahul.menon@example.com',
    customerPhone: '+91 98470 54321',
    address: 'Flat 4B, Skyline Ivory, Panampilly Nagar, Kochi, Kerala 682036',
    date: '2026-09-28 16:45',
    status: 'Delivered',
    paymentMethod: 'Razorpay UPI (Google Pay)',
    items: [
      { id: 'cap-b01', name: 'Caprio Classic 100% Combed Cotton Ribbed Vest (Pack of 3)', price: 449, quantity: 2, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop' },
      { id: 'cap-t01', name: 'Caprio Heavyweight 240 GSM Oversized Street T-Shirt', price: 799, quantity: 1, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop' }
    ],
    subtotal: 1697,
    discount: 169.7,
    couponCode: 'CAPRIO10',
    shipping: 0,
    total: 1527.3
  },
  {
    id: 'CP-89242',
    customerName: 'Marcus Sterling',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+91 98470 12345',
    address: 'Door 18, Royal Palms Avenue, Bangalore, Karnataka 560001',
    date: '2026-09-29 11:20',
    status: 'Processing',
    paymentMethod: 'Razorpay NetBanking (HDFC Bank)',
    items: [
      { id: 'cap-b03', name: 'Caprio Supima Luxury Seamless Inner Vest (Twin Pack)', price: 599, quantity: 1, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop' }
    ],
    subtotal: 599,
    discount: 59.9,
    couponCode: 'CAPRIO10',
    shipping: 0,
    total: 539.1
  }
];

export const DEFAULT_USERS = [
  {
    id: 'usr-admin',
    name: 'Caprio Administrator',
    email: 'admin@gmail.com',
    password: 'admin@123',
    phone: '+91 98765 43210',
    role: 'admin',
    joined: '2026-01-01'
  },
  {
    id: 'usr-client',
    name: 'Marcus Sterling',
    email: 'customer@gmail.com',
    password: 'user@123',
    phone: '+91 98470 12345',
    role: 'customer',
    joined: '2026-07-15'
  }
];
