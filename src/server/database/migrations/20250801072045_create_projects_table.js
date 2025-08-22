/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('projects', (table) => {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.text('description')
    table.string('status', 50).defaultTo('active')
    table.integer('owner_id').unsigned().notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Foreign key
    table.foreign('owner_id').references('id').inTable('users').onDelete('CASCADE')
    
    // Indexes
    table.index('owner_id')
    table.index('status')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('projects')
};
