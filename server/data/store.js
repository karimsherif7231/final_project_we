// In-memory data store
const products = [
  {
    id: 1, name: "UltraBook Pro 15", category: "Laptops",
    price: 1299.99, oldPrice: 1599.99,
    image: "/images/product-laptop.png", badge: "Best Seller",
    rating: 4.8, reviews: 342,
    description: "Experience unparalleled performance with the UltraBook Pro 15. Featuring a stunning 15.6\" 4K OLED display, Intel Core i9 processor, 32GB RAM, and a 1TB NVMe SSD.",
    specs: ["15.6\" 4K OLED Display","Intel Core i9 13th Gen","32GB DDR5 RAM","1TB NVMe SSD","NVIDIA RTX 4060 8GB","Battery: Up to 18 hours","Weight: 1.6 kg"]
  },
  {
    id: 2, name: "Nova X20 Pro", category: "Smartphones",
    price: 849.99, oldPrice: 999.99,
    image: "/images/product-phone.png", badge: "New",
    rating: 4.7, reviews: 528,
    description: "The Nova X20 Pro redefines mobile photography and performance. A 200MP main camera system, Snapdragon 8 Gen 3, and a 6.8\" Dynamic AMOLED display.",
    specs: ["6.8\" Dynamic AMOLED 120Hz","Snapdragon 8 Gen 3","12GB RAM / 256GB Storage","200MP Triple Camera","5000mAh Battery","100W Fast Charging","IP68 Water Resistant"]
  },
  {
    id: 3, name: "SoundMax ANC Pro", category: "Audio",
    price: 299.99, oldPrice: 379.99,
    image: "/images/product-headphones.png", badge: "Sale",
    rating: 4.9, reviews: 1204,
    description: "Immerse yourself in pure audio bliss with SoundMax ANC Pro. Industry-leading Active Noise Cancellation, 40-hour battery life, and Hi-Res Audio certification.",
    specs: ["Active Noise Cancellation","40-Hour Battery Life","Hi-Res Audio Certified","30mm Planar Drivers","Bluetooth 5.3","Multi-device Pairing","USB-C & 3.5mm Jack"]
  },
  {
    id: 4, name: "ChronoFit Ultra", category: "Wearables",
    price: 399.99, oldPrice: null,
    image: "/images/product-watch.png", badge: "Featured",
    rating: 4.6, reviews: 287,
    description: "ChronoFit Ultra is your ultimate health and fitness companion. Advanced health monitoring including ECG, SpO2, sleep tracking, and GPS.",
    specs: ["1.9\" Always-On AMOLED","Titanium Case","GPS + GLONASS","ECG & Blood Oxygen","7-Day Battery Life","5ATM Water Resistant","Over 100 Workout Modes"]
  },
  {
    id: 5, name: "PadMax Pro 12", category: "Tablets",
    price: 749.99, oldPrice: 899.99,
    image: "/images/product-tablet.png", badge: "Hot",
    rating: 4.7, reviews: 195,
    description: "PadMax Pro 12 bridges the gap between laptop and tablet. Its 12.4\" Super AMOLED display, M2-class chip, and slim 5.7mm profile.",
    specs: ["12.4\" Super AMOLED 120Hz","Octa-Core M2-Class Chip","12GB RAM / 256GB Storage","Quad Speakers","Stylus Support","10,090mAh Battery","5G + Wi-Fi 6E"]
  },
  {
    id: 6, name: "MechKeys RGB Elite", category: "Accessories",
    price: 149.99, oldPrice: 189.99,
    image: "/images/product-headphones.png", badge: "Popular",
    rating: 4.5, reviews: 634,
    description: "The MechKeys RGB Elite is a precision mechanical keyboard built for gamers and professionals alike. Cherry MX switches, per-key RGB lighting.",
    specs: ["Cherry MX Red Switches","Per-Key RGB Backlight","Aluminum Top Plate","Anti-Ghosting / NKRO","USB-C Detachable Cable","Macro Programming","Compact TKL Layout"]
  },
  {
    id: 7, name: "StreamCam 4K Pro", category: "Accessories",
    price: 219.99, oldPrice: 269.99,
    image: "/images/product-laptop.png", badge: null,
    rating: 4.4, reviews: 156,
    description: "Take your streaming, video calls, and content creation to the next level with StreamCam 4K Pro. True 4K 60fps recording, dual AI-powered microphones.",
    specs: ["4K 60fps Recording","f/2.0 Wide Aperture","Dual AI Microphones","Auto-Focus & Auto-Light","HDR Support","USB-C Connection","Universal Clip Mount"]
  },
  {
    id: 8, name: "PowerBank 26K Ultra", category: "Accessories",
    price: 89.99, oldPrice: 119.99,
    image: "/images/product-watch.png", badge: "Must Have",
    rating: 4.6, reviews: 891,
    description: "Never run out of power again. PowerBank 26K Ultra packs 26,800mAh with 140W GaN fast charging technology.",
    specs: ["26,800mAh Capacity","140W Max Output","3 USB-C + 1 USB-A","GaN Fast Charging","Charges 3 Devices at Once","Airplane Safe","LED Charge Indicator"]
  }
];

let users = [
  { id: 1, name: "Admin", email: "admin@techstore.com", password: "admin123", role: "admin", joined: new Date().toISOString(), orders: 0 }
];

let orders = [];

let nextProductId = 9;
let nextUserId = 2;

module.exports = {
  products,
  users,
  orders,
  getNextProductId: () => nextProductId++,
  getNextUserId: () => nextUserId++
};
