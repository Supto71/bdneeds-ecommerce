import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting full seed for Clothing & Apparel...');

  // Ensure Category exists
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

  const createProduct = async (
    name: string,
    subcategoryName: string,
    price: number,
    imageUrl: string
  ) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const brand = 'BDneeds Collection';
    
    // Default variants
    const sizes = ['M', 'L', 'XL'];
    const colors = [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy Blue', hex: '#000080' }
    ];
    
    // Generate variants randomly to mix it up, or just basic combinations
    const variants = sizes.map((size, idx) => ({
      colorName: colors[idx % colors.length].name,
      colorHex: colors[idx % colors.length].hex,
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
          subcategoryId: subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
          subcategoryName,
          basePrice: price,
          originalPrice: price,
          stock: 100,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `High-quality ${name} from our latest collection.`,
          description: `This is a premium ${name}, designed for maximum comfort and style. Ideal for everyday wear. Made with high-quality fabrics ensuring durability.`,
          features: ['Premium Quality', 'Comfortable Fit', 'Durable Material', 'Trendy Design'],
          specifications: { Material: 'Cotton Blend', 'Care Instructions': 'Machine Wash', Origin: 'Bangladesh' },
          images: [imageUrl],
          tags: [subcategoryName, 'Clothing', 'Fashion', name.split(' ')[0]],
          isPublished: true,
          variants: {
            create: variants.map((v, i) => ({
              sku: `SKU-${slug.toUpperCase()}-V${i + 1}`,
              colorName: v.colorName,
              colorHex: v.colorHex,
              size: v.size,
              price: price,
              stock: 50,
              images: v.images,
            })),
          },
        },
      });
      console.log(`Created product: ${name} (${subcategoryName})`);
    } catch (err) {
      console.error(`Failed to create product ${name}:`, err);
    }
  };

  const mensProducts = [
    { name: 'T-Shirt', price: 500, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800' },
    { name: 'Polo T-Shirt', price: 800, img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800' },
    { name: 'Casual Shirt', price: 1200, img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=800' },
    { name: 'Formal Shirt', price: 1500, img: 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=800' },
    { name: 'Jeans', price: 1800, img: 'https://images.unsplash.com/photo-1542272604-780c8d5215ff?q=80&w=800' },
    { name: 'Trousers', price: 1400, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800' },
    { name: 'Drop-Shoulder T-Shirt', price: 700, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800' },
    { name: 'Winter Denim', price: 2200, img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800' },
    { name: 'Full-Sleeve T-Shirt', price: 650, img: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?q=80&w=800' },
    { name: 'Hoodie', price: 1600, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
    { name: 'Winter Shirt', price: 1300, img: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800' },
  ];

  const womensProducts = [
    { name: 'Three-Piece', price: 3500, img: 'https://images.unsplash.com/photo-1583391733958-67520c5bf315?q=80&w=800' }, // Using general ethnic wear
    { name: 'Salwar Kameez', price: 3000, img: 'https://images.unsplash.com/photo-1631541909061-71e34a471cfb?q=80&w=800' },
    { name: 'Saree', price: 5500, img: 'https://images.unsplash.com/photo-1610030469983-98e550d61dc0?q=80&w=800' },
    { name: 'Kurti', price: 1500, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800' },
    { name: 'Tops', price: 1200, img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800' },
    { name: 'Ladies T-Shirt', price: 500, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800' },
    { name: 'Ladies Jeans', price: 1600, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800' },
    { name: 'Leggings', price: 600, img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800' },
    { name: 'Hijab', price: 400, img: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=800' },
    { name: 'Scarf/Orna', price: 350, img: 'https://images.unsplash.com/photo-1596568160081-37d400eef538?q=80&w=800' },
    { name: 'Abaya', price: 2500, img: 'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=800' },
    { name: 'Burqa', price: 3000, img: 'https://images.unsplash.com/photo-1582294474771-33157ba3b817?q=80&w=800' },
    { name: 'Night Dress', price: 1100, img: 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800' },
  ];

  for (const p of mensProducts) {
    await createProduct(p.name, "Men's Clothing", p.price, p.img);
  }

  for (const p of womensProducts) {
    await createProduct(p.name, "Women's Clothing", p.price, p.img);
  }

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
