import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  try {
    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123456', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@contractassistant.com' },
      update: {},
      create: {
        email: 'admin@contractassistant.com',
        password: adminPassword,
        name: 'System Administrator',
        avatar: null,
      },
    });

    console.log('✅ Created admin user:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: admin123456`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   ID: ${adminUser.id}\n`);

    // Create test users
    const testUsers = [
      {
        email: 'test@example.com',
        password: 'test123456',
        name: 'Test User',
      },
      {
        email: 'demo@example.com',
        password: 'demo123456',
        name: 'Demo User',
      },
    ];

    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          avatar: null,
        },
      });

      console.log(`✅ Created test user: ${user.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   ID: ${user.id}\n`);
    }

    // Create default user preferences for admin
    await prisma.userPreferences.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        language: 'en',
        theme: 'light',
        emailNotifications: true,
      },
    });

    console.log('✅ Created default user preferences\n');

    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('💡 You can now login with:');
    console.log('   Admin: admin@contractassistant.com / admin123456');
    console.log('   Test: test@example.com / test123456');
    console.log('   Demo: demo@example.com / demo123456\n');
  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Database migrations have been run');
    console.error('   2. Database connection is working');
    console.error('   3. Tables exist in the database\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
