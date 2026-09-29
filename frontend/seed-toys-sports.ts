import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for Toys & Sports...');

  // Create Categories
  const categoryToys = await prisma.category.upsert({
    where: { slug: 'toys-and-kids' },
    update: {},
    create: {
      name: 'Toys & Kids',
      slug: 'toys-and-kids',
      description: 'Fun, safe, and engaging toys for kids of all ages.',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000',
      isActive: true,
    },
  });

  const categorySports = await prisma.category.upsert({
    where: { slug: 'sports-equipments' },
    update: {},
    create: {
      name: 'Sports Equipments',
      slug: 'sports-equipments',
      description: 'Premium quality sports gear and equipment for an active lifestyle.',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000',
      isActive: true,
    },
  });

  const createProduct = async (
    name: string,
    categoryId: string,
    categoryName: string,
    subcategoryName: string,
    price: number,
    imageUrl: string
  ) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const brand = categoryName === 'Toys & Kids' ? 'KidsJoy' : 'ProActive';
    
    const variants = [
      { colorName: 'Standard', colorHex: '', size: 'Standard', images: [imageUrl] },
    ];

    try {
      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
          brand,
          categoryId: categoryId,
          categoryName: categoryName,
          subcategoryId: subcategoryName ? subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : null,
          subcategoryName: subcategoryName || null,
          basePrice: price,
          originalPrice: price + (price * 0.10), // 10% discount mock
          stock: 200,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `Top rated ${name} for you.`,
          description: `Enjoy the best quality ${name}. Designed for maximum performance, safety, and durability. Highly recommended for daily use and professional needs.`,
          features: ['Durable', 'High Quality', 'Safe to Use', 'Premium Build'],
          specifications: { Type: subcategoryName, Material: 'Premium', Origin: 'Imported' },
          images: [imageUrl],
          tags: [subcategoryName || categoryName, categoryName.split(' ')[0], name.split(' ')[0]],
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
      console.log(`Created product: ${name} (${categoryName} -> ${subcategoryName || 'No Sub'})`);
    } catch (err) {
      console.error(`Failed to create product ${name}:`, err);
    }
  };

  // Toys Products
  const toysVehicles = [
    { name: 'Toy Motorcycle', price: 800, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
    { name: 'Toy Train', price: 1200, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
    { name: 'Toy Airplane', price: 950, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
    { name: 'Toy Helicopter', price: 1100, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
  ];
  
  const toysActionPretend = [
    { name: 'Toy Robot', price: 1500, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
    { name: 'Toy Gun', price: 500, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
    { name: 'Toy Kitchen Set', price: 2000, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800' },
  ];

  const toysDolls = [
    { name: 'Doll', price: 650, img: 'https://images.unsplash.com/photo-1558066190-67e3352df8fb?q=80&w=800' },
    { name: 'Teddy Bear', price: 900, img: 'https://images.unsplash.com/photo-1558066190-67e3352df8fb?q=80&w=800' },
  ];

  for (const p of toysVehicles) await createProduct(p.name, categoryToys.id, categoryToys.name, 'Vehicles', p.price, p.img);
  for (const p of toysActionPretend) await createProduct(p.name, categoryToys.id, categoryToys.name, 'Action & Pretend Play', p.price, p.img);
  for (const p of toysDolls) await createProduct(p.name, categoryToys.id, categoryToys.name, 'Dolls & Soft Toys', p.price, p.img);


  // Sports Products
  const sportsCricket = [
    { name: 'Cricket Bat', price: 3500, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
    { name: 'Cricket Ball', price: 400, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
    { name: 'Cricket Gloves', price: 850, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
  ];

  const sportsFootball = [
    { name: 'Football', price: 1200, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
    { name: 'Football Boots', price: 2500, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
  ];

  const sportsRacket = [
    { name: 'Badminton Racket', price: 1800, img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
    { name: 'Badminton Shuttle', price: 600, img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
    { name: 'Tennis Racket', price: 4500, img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
  ];

  const sportsOthers = [
    { name: 'Volleyball', price: 900, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
    { name: 'Sports Jersey', price: 750, img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
  ];

  for (const p of sportsCricket) await createProduct(p.name, categorySports.id, categorySports.name, 'Cricket', p.price, p.img);
  for (const p of sportsFootball) await createProduct(p.name, categorySports.id, categorySports.name, 'Football', p.price, p.img);
  for (const p of sportsRacket) await createProduct(p.name, categorySports.id, categorySports.name, 'Racket Sports', p.price, p.img);
  for (const p of sportsOthers) await createProduct(p.name, categorySports.id, categorySports.name, 'Apparel & Others', p.price, p.img);


  console.log('Seeding finished for Toys and Sports.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
