/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('project_members', (table) => {
    table.increments('id').primary()
    table.integer('project_id').unsigned().notNullable()
    table.integer('user_id').unsigned().notNullable()
    table.string('role', 50).defaultTo('member')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    
    // Foreign keys
    table.foreign('project_id').references('id').inTable('projects').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    
    // Unique constraint to prevent duplicate memberships
    table.unique(['project_id', 'user_id'])
    
    // Indexes
    table.index('project_id')
    table.index('user_id')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('project_members')
};
