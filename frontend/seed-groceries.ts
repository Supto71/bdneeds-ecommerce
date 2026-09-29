import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for Groceries...');

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'groceries' },
    update: {},
    create: {
      name: 'Groceries',
      slug: 'groceries',
      description: 'Daily essentials, fresh produce, snacks, and cooking ingredients for your home.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000',
      isActive: true,
    },
  });

  const createProduct = async (
    name: string,
    subcategoryName: string,
    price: number,
    imageUrl: string
  ) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const brand = 'FreshMart';
    
    // For groceries, variants are typically weight/size. Let's add a default size variant.
    const variants = [
      { colorName: 'Standard', colorHex: '', size: '1 Kg / 1 Pcs', images: [imageUrl] },
    ];

    try {
      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
          brand,
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: subcategoryName ? subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : null,
          subcategoryName: subcategoryName || null,
          basePrice: price,
          originalPrice: price + (price * 0.05), // 5% slight discount mock
          stock: 500,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `Fresh and high-quality ${name}.`,
          description: `Get the best quality ${name} delivered right to your doorstep. Carefully sourced and packed to ensure freshness and purity for you and your family.`,
          features: ['Freshly Sourced', 'High Quality', 'Hygienically Packed', 'Daily Essential'],
          specifications: { Type: subcategoryName, ShelfLife: 'Variable', Origin: 'Bangladesh' },
          images: [imageUrl],
          tags: [subcategoryName || category.name, 'Groceries', 'Food', name.split(' ')[0]],
          isPublished: true,
          variants: {
            create: variants.map((v, i) => ({
              sku: `SKU-${slug.toUpperCase()}-V${i + 1}`,
              colorName: v.colorName,
              colorHex: v.colorHex,
              size: v.size,
              price: price,
              stock: 250,
              images: v.images,
            })),
          },
        },
      });
      console.log(`Created product: ${name} (${subcategoryName || 'No Sub'})`);
    } catch (err) {
      console.error(`Failed to create product ${name}:`, err);
    }
  };

  const staplesProducts = [
    { name: 'Rice', price: 75, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800' },
    { name: 'Lentils', price: 120, img: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?q=80&w=800' },
    { name: 'Chickpeas', price: 110, img: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?q=80&w=800' },
    { name: 'Flour', price: 65, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800' },
    { name: 'Cooking Oil', price: 180, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800' },
    { name: 'Salt', price: 40, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' },
    { name: 'Sugar', price: 130, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' }, // Reusing basic powder/crystal image
  ];

  const freshProduceDairy = [
    { name: 'Potatoes', price: 50, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800' },
    { name: 'Onions', price: 80, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=800' },
    { name: 'Eggs', price: 150, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800' },
    { name: 'Liquid Milk', price: 90, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800' },
  ];

  const snacksBeverages = [
    { name: 'Tea', price: 180, img: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?q=80&w=800' },
    { name: 'Coffee', price: 350, img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800' },
    { name: 'Powdered Milk', price: 850, img: 'https://images.unsplash.com/photo-1628186105307-e8971f1ea21a?q=80&w=800' },
    { name: 'Biscuits', price: 60, img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800' },
    { name: 'Bread', price: 70, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800' },
    { name: 'Noodles', price: 180, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800' },
  ];

  const spicesCondiments = [
    { name: 'Spices', price: 150, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' },
    { name: 'Tomato Sauce', price: 120, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800' },
    { name: 'Soy Sauce', price: 100, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800' }, // Reusing bottle image
  ];

  for (const p of staplesProducts) {
    await createProduct(p.name, 'Staples & Oil', p.price, p.img);
  }

  for (const p of freshProduceDairy) {
    await createProduct(p.name, 'Fresh Produce & Dairy', p.price, p.img);
  }

  for (const p of snacksBeverages) {
    await createProduct(p.name, 'Snacks & Beverages', p.price, p.img);
  }

  for (const p of spicesCondiments) {
    await createProduct(p.name, 'Spices & Condiments', p.price, p.img);
  }

  console.log('Seeding finished for Groceries.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
