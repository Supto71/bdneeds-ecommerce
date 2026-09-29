import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for Beauty & Personal Care...');

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'beauty-and-personal-care' },
    update: {},
    create: {
      name: 'Beauty & Personal Care',
      slug: 'beauty-and-personal-care',
      description: 'Premium cosmetics, skincare, and personal care products for a glowing you.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000',
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
    const brand = 'GlowBeauty';
    
    // For beauty products, we might not always have variants, but we will add a default one.
    const variants = [
      { colorName: 'Standard', colorHex: '', size: '50ml / 50g', images: [imageUrl] },
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
          originalPrice: price + (price * 0.15), // 15% discount mock
          stock: 300,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `Authentic ${name} from top beauty brands.`,
          description: `Enhance your beauty routine with this premium ${name}. Formulated with safe, skin-friendly ingredients, it offers long-lasting results and radiant perfection.`,
          features: ['Dermatologically Tested', 'Cruelty Free', 'Long Lasting', 'Premium Ingredients'],
          specifications: { Type: subcategoryName, SuitableFor: 'All Skin Types', Origin: 'UK/USA/BD' },
          images: [imageUrl],
          tags: [subcategoryName || category.name, 'Beauty', 'Cosmetics', name.split(' ')[0]],
          isPublished: true,
          variants: {
            create: variants.map((v, i) => ({
              sku: `SKU-${slug.toUpperCase()}-V${i + 1}`,
              colorName: v.colorName,
              colorHex: v.colorHex,
              size: v.size,
              price: price,
              stock: 150,
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

  const makeupProducts = [
    { name: 'Primer', price: 850, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800' },
    { name: 'Foundation', price: 1200, img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800' },
    { name: 'Concealer', price: 750, img: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800' },
    { name: 'Compact Powder', price: 900, img: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=800' },
    { name: 'Face Powder', price: 600, img: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=800' },
    { name: 'Blush', price: 800, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800' },
    { name: 'Highlighter', price: 1100, img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800' },
    { name: 'Makeup Remover', price: 500, img: 'https://images.unsplash.com/photo-1608248593842-8021c640989b?q=80&w=800' },
    { name: 'Eyeliner', price: 400, img: 'https://images.unsplash.com/photo-1512496015851-a908fc99a515?q=80&w=800' },
    { name: 'Mascara', price: 650, img: 'https://images.unsplash.com/photo-1588046132717-e4abaf9022ee?q=80&w=800' },
    { name: 'Eyebrow Pencil', price: 300, img: 'https://images.unsplash.com/photo-1625081186718-9c16b50e32b0?q=80&w=800' },
    { name: 'Lipstick', price: 550, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800' },
    { name: 'Lip Gloss', price: 450, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800' },
    { name: 'Nail Polish', price: 250, img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800' },
  ];

  const skincareProducts = [
    { name: 'Face Wash', price: 350, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800' },
    { name: 'Body Wash', price: 450, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800' },
    { name: 'Soap', price: 150, img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800' },
    { name: 'Moisturizer', price: 650, img: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=800' },
    { name: 'Sunscreen', price: 800, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800' },
    { name: 'Hair Serum', price: 750, img: 'https://images.unsplash.com/photo-1526715690558-750c377dd9f5?q=80&w=800' },
  ];

  const fragranceProducts = [
    { name: 'Perfume', price: 2500, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800' },
    { name: 'Body Spray', price: 600, img: 'https://images.unsplash.com/photo-1594119330950-86c8d76e7b15?q=80&w=800' },
  ];

  for (const p of makeupProducts) {
    await createProduct(p.name, 'Makeup', p.price, p.img);
  }

  for (const p of skincareProducts) {
    await createProduct(p.name, 'Skincare & Bath', p.price, p.img);
  }

  for (const p of fragranceProducts) {
    await createProduct(p.name, 'Fragrances', p.price, p.img);
  }

  console.log('Seeding finished for Beauty & Personal Care.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
