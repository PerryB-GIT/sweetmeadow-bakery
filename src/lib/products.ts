export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: "cakes" | "seasonal" | "custom";
  image: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Vanilla Bean",
    description: "Light and fluffy vanilla cake with Madagascar vanilla bean buttercream",
    price: "$8",
    category: "cakes",
    image: "/images/vanilla-cake.jpg",
    featured: true,
  },
  {
    id: "2",
    name: "Dark Chocolate Truffle",
    description: "Rich Belgian chocolate cake with ganache and chocolate shavings",
    price: "$9",
    category: "cakes",
    image: "/images/chocolate-cake.jpg",
    featured: true,
  },
  {
    id: "3",
    name: "Strawberry Dream",
    description: "Fresh strawberry cake with cream cheese frosting and berry compote",
    price: "$9",
    category: "cakes",
    image: "/images/strawberry-cake.jpg",
    featured: true,
  },
  {
    id: "4",
    name: "Autumn Spice",
    description: "Pumpkin spice cake with maple cream cheese frosting - seasonal favorite",
    price: "$9",
    category: "seasonal",
    image: "/images/pumpkin-cake.jpg",
    featured: true,
  },
  {
    id: "5",
    name: "Salted Caramel",
    description: "Buttery caramel cake with sea salt buttercream and caramel drizzle",
    price: "$9",
    category: "cakes",
    image: "/images/caramel-cake.jpg",
  },
  {
    id: "6",
    name: "Lemon Lavender",
    description: "Bright lemon cake with lavender buttercream - light and refreshing",
    price: "$8",
    category: "cakes",
    image: "/images/lemon-cake.jpg",
  },
  {
    id: "7",
    name: "Red Velvet Classic",
    description: "Traditional red velvet with tangy cream cheese frosting",
    price: "$9",
    category: "cakes",
    image: "/images/red-velvet-cake.jpg",
  },
  {
    id: "8",
    name: "Halloween Spooky Treat",
    description: "Limited edition Halloween-themed cake with festive decorations",
    price: "$10",
    category: "seasonal",
    image: "/images/halloween-cake.jpg",
  },
  {
    id: "9",
    name: "Custom Creation",
    description: "Design your own cake with custom flavors, colors, and decorations",
    price: "From $12",
    category: "custom",
    image: "/images/custom-cake.jpg",
  },
];

export const categories = [
  { id: "all", name: "All Treats" },
  { id: "cakes", name: "Signature Cakes" },
  { id: "seasonal", name: "Seasonal" },
  { id: "custom", name: "Custom Orders" },
];
