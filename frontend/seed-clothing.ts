import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'clothing-and-apparel' },
    update: {},
    create: {
      name: 'Clothing & Apparel',
      slug: 'clothing-and-apparel',
      description: 'Find the best clothing and apparel for men and women.',
      image: 'https://images.unsplash.com/photo-1489987707023-afc8271074fa?q=80&w=1000',
      isActive: true,
    },
  });

  console.log('Category created:', category.name);

  // Helper to create product
  const createProduct = async (
    name: string,
    slug: string,
    subcategoryName: string,
    brand: string,
    price: number,
    images: string[],
    variants: any[]
  ) => {
    try {
      const product = await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
          brand,
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: subcategoryName.toLowerCase().replace(/ /g, '-').replace(/'/g, ''),
          subcategoryName,
          basePrice: price,
          originalPrice: price,
          stock: 100,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `High-quality ${name} from ${brand}.`,
          description: `This is a premium ${name}, designed for maximum comfort and style. Ideal for everyday wear.`,
          features: ['Premium Quality', 'Comfortable Fit', 'Durable Material', 'Trendy Design'],
          specifications: { Material: 'Cotton Blend', 'Care Instructions': 'Machine Wash', Origin: 'Bangladesh' },
          images,
          tags: [subcategoryName, 'Clothing', 'Fashion'],
          isPublished: true,
          variants: {
            create: variants.map((v, i) => ({
              sku: `SKU-${slug.toUpperCase()}-V${i + 1}`,
              colorName: v.colorName,
              colorHex: v.colorHex,
              size: v.size,
              price: price,
              stock: 50,
              images: v.images || [images[0]],
            })),
          },
        },
      });
      console.log('Created product:', product.name);
    } catch (err) {
      console.error(`Failed to create product ${name}:`, err);
    }
  };

  // Men's Clothing
  await createProduct(
    'Premium Cotton Polo T-Shirt',
    'premium-cotton-polo',
    "Men's Clothing",
    'Outfitters',
    1200,
    ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000'],
    [
      { colorName: 'Navy Blue', colorHex: '#000080', size: 'M' },
      { colorName: 'Navy Blue', colorHex: '#000080', size: 'L' },
      { colorName: 'White', colorHex: '#FFFFFF', size: 'M' },
    ]
  );

  await createProduct(
    'Classic Blue Denim Jeans',
    'classic-blue-denim-jeans',
    "Men's Clothing",
    'Levis',
    2500,
    ['https://images.unsplash.com/photo-1542272604-780c8d5215ff?q=80&w=1000'],
    [
      { colorName: 'Blue', colorHex: '#0000FF', size: '32' },
      { colorName: 'Blue', colorHex: '#0000FF', size: '34' },
    ]
  );
  
  await createProduct(
    'Winter Hoodie',
    'winter-hoodie-men',
    "Men's Clothing",
    'WinterWear',
    1800,
    ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000'],
    [
      { colorName: 'Black', colorHex: '#000000', size: 'L' },
      { colorName: 'Grey', colorHex: '#808080', size: 'L' },
    ]
  );

  // Women's Clothing
  await createProduct(
    'Elegant Silk Saree',
    'elegant-silk-saree',
    "Women's Clothing",
    'Aarong',
    5000,
    ['https://images.unsplash.com/photo-1610030469983-98e550d61dc0?q=80&w=1000'],
    [
      { colorName: 'Red', colorHex: '#FF0000', size: 'Free Size' },
      { colorName: 'Green', colorHex: '#008000', size: 'Free Size' },
    ]
  );

  await createProduct(
    'Designer Kurti',
    'designer-kurti-women',
    "Women's Clothing",
    'Yellow',
    2200,
    ['https://images.unsplash.com/photo-1583391733958-67520c5bf315?q=80&w=1000'],
    [
      { colorName: 'Yellow', colorHex: '#FFFF00', size: 'M' },
      { colorName: 'Yellow', colorHex: '#FFFF00', size: 'L' },
    ]
  );

  await createProduct(
    'Comfortable Cotton Leggings',
    'cotton-leggings',
    "Women's Clothing",
    'Cats Eye',
    600,
    ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000'],
    [
      { colorName: 'Black', colorHex: '#000000', size: 'M' },
      { colorName: 'Black', colorHex: '#000000', size: 'L' },
    ]
  );

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
