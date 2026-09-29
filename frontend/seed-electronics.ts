import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for Electronics & Lighting...');

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'electronics-and-lighting' },
    update: {},
    create: {
      name: 'Electronics & Lighting',
      slug: 'electronics-and-lighting',
      description: 'Top quality electronics and bright lighting solutions for your home.',
      image: 'https://images.unsplash.com/photo-1550009158-9effb6c69e6d?q=80&w=1000',
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
    const brand = 'TechNova';
    
    // For electronics, variants might be colors (Black/White)
    const variants = [
      { colorName: 'Black', colorHex: '#000000', size: null, images: [imageUrl] },
      { colorName: 'White', colorHex: '#FFFFFF', size: null, images: [imageUrl] },
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
          originalPrice: price + (price * 0.2), // 20% fake discount just to show original price
          stock: 200,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `Premium ${name} with high durability and performance.`,
          description: `This ${name} is engineered to deliver the best experience. With modern design and reliable build quality, it is a perfect addition to your tech collection.`,
          features: ['High Performance', 'Durable Build', 'Energy Efficient', '1 Year Warranty'],
          specifications: { Power: '220V', Material: 'Polycarbonate', Origin: 'China' },
          images: [imageUrl],
          tags: [subcategoryName || category.name, 'Tech', name.split(' ')[0]],
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

  // I am grouping them logically into subcategories "Electronics" and "Lighting" so the new UI cards work beautifully.
  const electronicsProducts = [
    { name: 'Mobile Charger', price: 450, img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800' },
    { name: 'USB Cable', price: 250, img: 'https://images.unsplash.com/photo-1592503254549-33827471fb98?q=80&w=800' },
    { name: 'Power Bank', price: 1500, img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800' },
    { name: 'Earphones', price: 600, img: 'https://images.unsplash.com/photo-1505236273191-1dce886b01e9?q=80&w=800' },
    { name: 'Bluetooth Speaker', price: 2200, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800' },
    { name: 'Electric Fan', price: 3500, img: 'https://images.unsplash.com/photo-1563297127-d4fa28bf4f48?q=80&w=800' },
    { name: 'Extension Board', price: 850, img: 'https://images.unsplash.com/photo-1558231061-0b54fbd66e74?q=80&w=800' },
  ];

  const lightingProducts = [
    { name: 'LED Bulb', price: 200, img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800' },
    { name: 'LED Emergency Light', price: 1200, img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800' },
    { name: 'Profile Light', price: 1800, img: 'https://images.unsplash.com/photo-1563242099-28c0b9bdc7eb?q=80&w=800' },
    { name: 'Focus Light', price: 2500, img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?q=80&w=800' },
    { name: 'Hanging Light', price: 3000, img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?q=80&w=800' }, // Reusing elegant light photo
  ];

  for (const p of electronicsProducts) {
    await createProduct(p.name, 'Electronics', p.price, p.img);
  }

  for (const p of lightingProducts) {
    await createProduct(p.name, 'Lighting', p.price, p.img);
  }

  console.log('Seeding finished for Electronics & Lighting.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
