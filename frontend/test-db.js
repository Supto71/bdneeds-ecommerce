const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({where: {email: 'mdsupto718@gmail.com'}});
  if (!user) { console.log("User not found"); return; }
  console.log("Avatar URL length:", user.avatarUrl ? user.avatarUrl.length : 0);
  console.log("Name length:", user.name ? user.name.length : 0);
  console.log("Total dbUser stringified length:", JSON.stringify(user).length);
}
main().finally(() => prisma.$disconnect());
