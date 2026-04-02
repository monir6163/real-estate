export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  type: "Apartment" | "Villa" | "Commercial" | "Land" | "House";
  status: "For Sale" | "For Rent";
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  agent: {
    name: string;
    phone: string;
    image: string;
  };
  featured: boolean;
  yearBuilt: number;
  garage: number;
  reviewCount?: number;
  averageRating?: number;
};

export const properties: Property[] = [
  {
    id: "1",
    title: "Luxury Skyline Apartment",
    location: "Downtown Manhattan, New York",
    price: 1250000,
    type: "Apartment",
    status: "For Sale",
    beds: 3,
    baths: 2,
    sqft: 1850,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Stunning modern apartment with panoramic city views. Floor-to-ceiling windows flood the space with natural light. Premium finishes throughout including hardwood floors, quartz countertops, and custom cabinetry. Building amenities include a rooftop terrace, fitness center, and 24-hour concierge.",
    features: ["City View", "Concierge", "Rooftop Terrace", "Gym", "Parking"],
    agent: { name: "Sarah Mitchell", phone: "+1 (555) 123-4567", image: "" },
    featured: true,
    yearBuilt: 2022,
    garage: 1,
  },
  {
    id: "2",
    title: "Classic Family Home",
    location: "Oakville, Ontario",
    price: 895000,
    type: "House",
    status: "For Sale",
    beds: 4,
    baths: 3,
    sqft: 2800,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Beautiful brick family home in a prestigious neighborhood. Features a spacious open-concept main floor, gourmet kitchen, and a private backyard oasis. Close to top-rated schools, parks, and shopping.",
    features: ["Backyard", "Garage", "Fireplace", "Basement", "School Nearby"],
    agent: { name: "James Cooper", phone: "+1 (555) 234-5678", image: "" },
    featured: true,
    yearBuilt: 2018,
    garage: 2,
  },
  {
    id: "3",
    title: "Prime Office Space",
    location: "Financial District, Chicago",
    price: 3500,
    type: "Commercial",
    status: "For Rent",
    beds: 0,
    baths: 2,
    sqft: 4200,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Class A office space in the heart of the financial district. Modern open floor plan with private offices, conference rooms, and a reception area. High-speed internet, 24/7 access, and premium building security.",
    features: [
      "24/7 Access",
      "High-Speed Internet",
      "Conference Room",
      "Security",
      "Parking",
    ],
    agent: { name: "David Park", phone: "+1 (555) 345-6789", image: "" },
    featured: true,
    yearBuilt: 2020,
    garage: 0,
  },
  {
    id: "4",
    title: "Oceanfront Villa",
    location: "Malibu, California",
    price: 4750000,
    type: "Villa",
    status: "For Sale",
    beds: 5,
    baths: 4,
    sqft: 5200,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Breathtaking oceanfront villa with private beach access. This architectural masterpiece features an infinity pool, outdoor kitchen, home theater, and a wine cellar. Every room offers stunning ocean views.",
    features: [
      "Ocean View",
      "Pool",
      "Private Beach",
      "Wine Cellar",
      "Smart Home",
    ],
    agent: { name: "Emily Chen", phone: "+1 (555) 456-7890", image: "" },
    featured: true,
    yearBuilt: 2021,
    garage: 3,
  },
  {
    id: "5",
    title: "Modern Open Concept Condo",
    location: "Austin, Texas",
    price: 425000,
    type: "Apartment",
    status: "For Sale",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Beautifully designed modern condo with open floor plan. Features hardwood floors, chef's kitchen, and a private balcony. Walking distance to restaurants, shops, and entertainment.",
    features: ["Balcony", "Hardwood Floors", "Walk-in Closet", "Pool", "Gym"],
    agent: { name: "Sarah Mitchell", phone: "+1 (555) 123-4567", image: "" },
    featured: true,
    yearBuilt: 2023,
    garage: 1,
  },
  {
    id: "6",
    title: "Development Land Plot",
    location: "Westchester, New York",
    price: 650000,
    type: "Land",
    status: "For Sale",
    beds: 0,
    baths: 0,
    sqft: 43560,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "One-acre development lot in an upscale residential area. Cleared and ready for construction. All utilities available at the property line. Ideal for custom home build or small development project.",
    features: [
      "Utilities Available",
      "Flat Terrain",
      "Road Access",
      "Zoned Residential",
    ],
    agent: { name: "James Cooper", phone: "+1 (555) 234-5678", image: "" },
    featured: false,
    yearBuilt: 0,
    garage: 0,
  },
];

export const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Commercial",
  "Land",
] as const;
export const locations = [...new Set(properties.map((p) => p.location))];
