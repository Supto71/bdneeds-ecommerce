import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for Footwear...');

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'footwear' },
    update: {},
    create: {
      name: 'Footwear',
      slug: 'footwear',
      description: 'Comfortable and stylish footwear for every occasion.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000',
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
    const brand = 'StepStyle';
    
    // For footwear, variants are usually sizes (40, 41, 42, etc.)
    const sizes = ['40', '41', '42'];
    const variants = sizes.map(size => ({
      colorName: 'Standard',
      colorHex: '',
      size: size,
      images: [imageUrl]
    }));

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
          originalPrice: price + (price * 0.15), // 15% discount mock
          stock: 300,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `Comfortable ${name} for daily wear.`,
          description: `Step up your style with these premium ${name}. Made from high-quality materials ensuring maximum comfort and durability throughout the day.`,
          features: ['Comfortable Fit', 'Durable Sole', 'Lightweight', 'Stylish Design'],
          specifications: { Type: subcategoryName, Material: 'Premium Synthetic/Leather', Origin: 'Bangladesh' },
          images: [imageUrl],
          tags: [subcategoryName || category.name, 'Footwear', 'Shoes', name.split(' ')[0]],
          isPublished: true,
          variants: {
            create: variants.map((v, i) => ({
              sku: `SKU-${slug.toUpperCase()}-V${i + 1}`,
              colorName: v.colorName,
              colorHex: v.colorHex,
              size: v.size,
              price: price,
              stock: 100,
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

  const mensFootwear = [
    { name: "Men's Sneakers", price: 2500, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800' },
    { name: "Men's Shoes", price: 3200, img: 'https://images.unsplash.com/photo-1614252339460-e1763bf45300?q=80&w=800' },
  ];

  const womensFootwear = [
    { name: "Women's Sneakers", price: 2200, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800' },
    { name: "Women's Shoes", price: 2800, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800' },
  ];

  for (const p of mensFootwear) {
    await createProduct(p.name, "Men's", p.price, p.img);
  }

  for (const p of womensFootwear) {
    // Note: The screenshot had a typo "Sub-Category: Men's" for women's shoes, 
    // I am assuming it meant Women's based on the context.
    await createProduct(p.name, "Women's", p.price, p.img);
  }

  console.log('Seeding finished for Footwear.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
