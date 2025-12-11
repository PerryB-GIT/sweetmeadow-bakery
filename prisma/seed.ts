import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "cakes" },
      update: {},
      create: { name: "Signature Cakes", slug: "cakes", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "seasonal" },
      update: {},
      create: { name: "Seasonal", slug: "seasonal", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "custom" },
      update: {},
      create: { name: "Custom Orders", slug: "custom", sortOrder: 3 },
    }),
  ]);

  console.log("Created categories:", categories.map(c => c.name).join(", "));

  const cakesCategory = categories.find(c => c.slug === "cakes")!;
  const seasonalCategory = categories.find(c => c.slug === "seasonal")!;
  const customCategory = categories.find(c => c.slug === "custom")!;

  // Create products (migrating from products.ts)
  const products = [
    { name: "Classic Vanilla Bean", description: "Light and fluffy vanilla cake with Madagascar vanilla bean buttercream", price: 8, category: cakesCategory, image: "/images/vanilla-cake.jpg", featured: true },
    { name: "Dark Chocolate Truffle", description: "Rich Belgian chocolate cake with ganache and chocolate shavings", price: 9, category: cakesCategory, image: "/images/chocolate-cake.jpg", featured: true },
    { name: "Strawberry Dream", description: "Fresh strawberry cake with cream cheese frosting and berry compote", price: 9, category: cakesCategory, image: "/images/strawberry-cake.jpg", featured: true },
    { name: "Autumn Spice", description: "Pumpkin spice cake with maple cream cheese frosting - seasonal favorite", price: 9, category: seasonalCategory, image: "/images/pumpkin-cake.jpg", featured: true },
    { name: "Salted Caramel", description: "Buttery caramel cake with sea salt buttercream and caramel drizzle", price: 9, category: cakesCategory, image: "/images/caramel-cake.jpg", featured: false },
    { name: "Lemon Lavender", description: "Bright lemon cake with lavender buttercream - light and refreshing", price: 8, category: cakesCategory, image: "/images/lemon-cake.jpg", featured: false },
    { name: "Red Velvet Classic", description: "Traditional red velvet with tangy cream cheese frosting", price: 9, category: cakesCategory, image: "/images/red-velvet-cake.jpg", featured: false },
    { name: "Halloween Spooky Treat", description: "Limited edition Halloween-themed cake with festive decorations", price: 10, category: seasonalCategory, image: "/images/halloween-cake.jpg", featured: false },
    { name: "Custom Creation", description: "Design your own cake with custom flavors, colors, and decorations", price: 12, category: customCategory, image: "/images/custom-cake.jpg", featured: false },
  ];

  for (const product of products) {
    const id = product.name.toLowerCase().replace(/\s+/g, "-");
    await prisma.product.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        categoryId: product.category.id,
        featured: product.featured,
        available: true,
      },
    });
  }

  console.log("Created", products.length, "products");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "perry.bailes@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Perry Bailes",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", adminUser.email);

  // Create inventory for each product
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        quantity: 20,
        lowStockAlert: 5,
      },
    });
  }

  console.log("Created inventory for all products");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
