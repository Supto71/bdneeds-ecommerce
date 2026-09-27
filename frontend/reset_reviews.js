const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany({});
  await prisma.product.updateMany({
    data: {
      rating: 0,
      reviewCount: 0
    }
  });
  console.log('Reset complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
