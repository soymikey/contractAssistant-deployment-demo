import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Starting database initialization...\n');

  try {
    // Step 1: Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Step 2: Generate Prisma Client
    console.log('🔨 Generating Prisma Client...');
    const { stdout: generateOut } = await execAsync('npx prisma generate');
    console.log(generateOut);
    console.log('✅ Prisma Client generated\n');

    // Step 3: Run migrations
    console.log('🚀 Running database migrations...');
    try {
      const { stdout: migrateOut } = await execAsync(
        'npx prisma migrate deploy',
      );
      console.log(migrateOut);
      console.log('✅ Migrations completed\n');
    } catch (migrateError: any) {
      if (migrateError.message.includes('No pending migrations')) {
        console.log('ℹ️  No pending migrations to apply\n');
      } else {
        throw migrateError;
      }
    }

    // Step 4: Verify database schema
    console.log('🔍 Verifying database schema...');
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log('📊 Tables found in database:');
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`);
    });
    console.log(`   Total: ${tables.length} tables`);

    console.log('\n✅ Database initialization completed successfully! 🎉\n');
    console.log('💡 Next steps:');
    console.log('   1. Run "pnpm db:seed" to populate test data');
    console.log('   2. Run "pnpm start:dev" to start the application\n');
  } catch (error: any) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Ensure PostgreSQL is running');
    console.error('   2. Check DATABASE_URL in .env file');
    console.error('   3. Verify database exists and credentials are correct');
    console.error(
      '   4. Try creating the database: psql -U postgres -c "CREATE DATABASE contract_assistant;"\n',
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
