const bcrypt = require('bcryptjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  
  await knex('users').del()

  // Inserts seed entries
  const hashedPassword = await bcrypt.hash('welcome', 12)
  
  // Insert users
  await knex('users').insert([
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'super_admin',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])

  // Get the inserted user ID
  const user = await knex('users').where('email', 'admin@gmail.com').first()
  console.log('Users seeded successfully')
  console.log('Admin user ID:', user.id)
};
