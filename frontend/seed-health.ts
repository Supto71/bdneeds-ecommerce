import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for Health & Medical...');

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'health-and-medical' },
    update: {},
    create: {
      name: 'Health & Medical',
      slug: 'health-and-medical',
      description: 'Essential health care products, medical devices, and first aid supplies.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
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
    const brand = 'MediCare';
    
    // For medical products, we might not always have variants, but we will add a default one.
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
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: subcategoryName ? subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : null,
          subcategoryName: subcategoryName || null,
          basePrice: price,
          originalPrice: price + (price * 0.10), // 10% discount mock
          stock: 500,
          sku: `SKU-${slug.toUpperCase()}`,
          shortDescription: `Reliable and high-quality ${name}.`,
          description: `This ${name} is designed to meet strict health and safety standards. Essential for your daily healthcare or emergency needs.`,
          features: ['Clinically Tested', 'Safe to Use', 'High Quality', 'Reliable'],
          specifications: { Type: subcategoryName, Certification: 'ISO/CE', Origin: 'Global' },
          images: [imageUrl],
          tags: [subcategoryName || category.name, 'Health', 'Medical', name.split(' ')[0]],
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

  const feminineCareProducts = [
    { name: 'Sanitary Pad', price: 150, img: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=800' },
    { name: 'Panty Liner', price: 120, img: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=800' },
    { name: 'Tampon', price: 250, img: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=800' },
    { name: 'Menstrual Cup', price: 800, img: 'https://images.unsplash.com/photo-1596752763293-85a69151e9f1?q=80&w=800' }, // Cup shaped object approximation
    { name: 'Menstrual Disc', price: 900, img: 'https://images.unsplash.com/photo-1596752763293-85a69151e9f1?q=80&w=800' },
    { name: 'Period Panty', price: 600, img: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=800' },
    { name: 'Reusable Cloth Pad', price: 350, img: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=800' },
    { name: 'Intimate Wash', price: 400, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800' },
    { name: 'Period Pain Relief Patch', price: 180, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800' },
  ];

  const medicalDevicesProducts = [
    { name: 'Heating Pad', price: 1200, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800' },
    { name: 'Thermometer', price: 350, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' },
    { name: 'Digital BP Monitor', price: 2800, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' },
    { name: 'Pulse Oximeter', price: 1500, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' },
  ];

  const firstAidProducts = [
    { name: 'First Aid Box', price: 1500, img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800' },
    { name: 'Syringe', price: 20, img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800' },
    { name: 'Surgical Gloves', price: 50, img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800' },
    { name: 'Face Mask', price: 10, img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=800' },
    { name: 'Cotton', price: 80, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800' },
    { name: 'Bandage', price: 40, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800' },
    { name: 'Antiseptic Solution', price: 120, img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800' },
  ];

  for (const p of feminineCareProducts) {
    await createProduct(p.name, 'Feminine Care', p.price, p.img);
  }

  for (const p of medicalDevicesProducts) {
    await createProduct(p.name, 'Medical Devices', p.price, p.img);
  }

  for (const p of firstAidProducts) {
    await createProduct(p.name, 'First Aid & Supplies', p.price, p.img);
  }

  console.log('Seeding finished for Health & Medical.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
