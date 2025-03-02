// Categories
export const categories = [
  "Buddha", "Ram", "Radha Krishna", "Shivaji", "Ganesh",
  "Sai Baba", "Mahadev", "Dr. Ambedkar"
];

// Sample category images (in production, these would come from a database)
export const categoryImages = {
  "Buddha": [
    { id: "b1", url: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827", title: "Buddha Statue 1" },
    { id: "b2", url: "https://images.unsplash.com/photo-1610498263193-861fbf403f46", title: "Buddha Statue 2" },
    { id: "b3", url: "https://images.unsplash.com/photo-1576723417715-6b408c988c23", title: "Buddha Statue 3" },
  ],
  "Ram": [
    { id: "r1", url: "https://images.unsplash.com/photo-1582126892906-5ba111b3c9dd", title: "Ram Temple" },
    { id: "r2", url: "https://images.unsplash.com/photo-1580742024302-9e5d0927c915", title: "Ram Temple 2" },
  ],
  "Ganesh": [
    { id: "g1", url: "https://images.unsplash.com/photo-1567591370504-c8b05bd3b30e", title: "Ganesh Statue" },
    { id: "g2", url: "https://images.unsplash.com/photo-1576487248805-cf45e9336e14", title: "Ganesh Statue 2" },
  ],
};

// Generic background images
export const defaultBackgrounds = [
  { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", title: "Gradient 1" },
  { url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85", title: "Gradient 2" },
  { url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d", title: "Gradient 3" },
  { url: "https://images.unsplash.com/photo-1557683316-973673baf926", title: "Gradient 4" },
];

// Frame variations
export const frames = [
  { id: "f1", url: "https://images.unsplash.com/photo-1516981879613-9f5da904015f", title: "Classic Wood", borderColor: "#8B4513" },
  { id: "f2", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401", title: "Gold Ornate", borderColor: "#FFD700" },
  { id: "f3", url: "https://images.unsplash.com/photo-1579965342575-16428a7c8881", title: "Antique Bronze", borderColor: "#CD853F" },
  { id: "f4", url: "https://images.unsplash.com/photo-1579965342575-16428a7c8881", title: "Silver Modern", borderColor: "#C0C0C0" },
  { id: "f5", url: "https://images.unsplash.com/photo-1579965342575-16428a7c8881", title: "Black Matte", borderColor: "#2C2C2C" },
];

// Size options
export const landscapeSizes = [
  { value: '30x20', label: '76.2 × 50.8 cm (30" × 20")', price: 59.99, width: 550, height: 367 },
  { value: '24x16', label: '61.0 × 40.6 cm (24" × 16")', price: 49.99, width: 500, height: 333 },
  { value: '18x12', label: '45.7 × 30.5 cm (18" × 12")', price: 39.99, width: 450, height: 300 },
  { value: '12x8', label: '30.5 × 20.3 cm (12" × 8")', price: 29.99, width: 400, height: 267 }
];

export const portraitSizes = [
  { value: '20x30', label: '50.8 × 76.2 cm (20" × 30")', price: 59.99, width: 367, height: 550 },
  { value: '16x24', label: '40.6 × 61.0 cm (16" × 24")', price: 49.99, width: 333, height: 500 },
  { value: '12x18', label: '30.5 × 45.7 cm (12" × 18")', price: 39.99, width: 300, height: 450 },
  { value: '8x12', label: '20.3 × 30.5 cm (8" × 12")', price: 29.99, width: 267, height: 400 }
];

export const squareSizes = [
  { value: '12x12', label: '30.5 × 30.5 cm (12" × 12")', price: 39.99, width: 450, height: 450 },
  { value: '10x10', label: '25.4 × 25.4 cm (10" × 10")', price: 34.99, width: 400, height: 400 },
  { value: '8x8', label: '20.3 × 20.3 cm (8" × 8")', price: 29.99, width: 350, height: 350 },
  { value: '6x6', label: '15.2 × 15.2 cm (6" × 6")', price: 24.99, width: 300, height: 300 }
];

export const sizeOptions = {
  landscape: landscapeSizes,
  portrait: portraitSizes,
  square: squareSizes
};