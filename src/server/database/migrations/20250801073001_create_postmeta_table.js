/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('postmeta', (table) => {
    table.increments('id').primary()
    table.integer('post_id').unsigned().notNullable()
    table.string('meta_key', 255)
    table.longText('meta_value')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Indexes
    table.index('post_id')
    table.index('meta_key')
    
    // Foreign key
    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('postmeta')
}; 