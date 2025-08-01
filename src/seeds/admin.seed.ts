/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function seedAdmin() {
  await AppDataSource.initialize();

  const email = 'admin@fungura.com';

  // Check if admin exists using raw SQL
  const existingAdmin = await AppDataSource.query(
    `SELECT * FROM system_users WHERE email = $1 LIMIT 1`,
    [email],
  );

  if (existingAdmin.length > 0) {
    console.log('Admin already exists');
    await AppDataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  console.log('====================================');
  console.log(hashedPassword);
  console.log('====================================');
  // Insert admin user with raw SQL
  await AppDataSource.query(
    `INSERT INTO system_users 
    ("uuid", "deletedStatus", "createdAt", "updatedAt", "doneBy", "updatedBy", "firstname", "lastname", "email", "password", "gender", "phoneNumber", "dateOfBirth", "role")
   VALUES 
    (uuid_generate_v4(), false, NOW(), NOW(), NULL, NULL, $1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      'System', // firstname
      'Administrator', // lastname
      email, // email
      hashedPassword, // password
      'PREFER_NOT_TO_SAY', // gender
      '+250700000000', // phoneNumber
      '1990-01-01', // dateOfBirth
      'ADMIN', // role
    ],
  );

  console.log('✅ Admin user created successfully');

  await AppDataSource.destroy();
}

seedAdmin().catch((err) => {
  console.error('❌ Failed to seed admin:', err);
  process.exit(1);
});
