/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary()
    table.integer('author_id').unsigned().notNullable()
    table.timestamp('date').defaultTo(knex.fn.now())
    table.timestamp('date_gmt').defaultTo(knex.fn.now())
    table.text('content').notNullable()
    table.text('title').notNullable()
    table.text('excerpt')
    table.string('status', 20).defaultTo('publish').notNullable()
    table.string('comment_status', 20).defaultTo('open').notNullable()
    table.string('ping_status', 20).defaultTo('open').notNullable()
    table.string('password', 255)
    table.string('name', 200)
    table.text('to_ping')
    table.text('pinged')
    table.timestamp('modified').defaultTo(knex.fn.now())
    table.timestamp('modified_gmt').defaultTo(knex.fn.now())
    table.text('content_filtered')
    table.integer('parent_id').unsigned().defaultTo(0)
    table.string('guid', 255)
    table.integer('menu_order').defaultTo(0)
    table.string('type', 20).defaultTo('post').notNullable()
    table.string('mime_type', 100)
    table.bigInteger('comment_count').defaultTo(0)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Indexes
    table.index('author_id')
    table.index('status')
    table.index('type')
    table.index('date')
    table.index('parent_id')
    table.index('name')
    
    // Foreign key
    table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('posts')
}; 