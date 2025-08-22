/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary()
    table.string('title', 255).notNullable()
    table.text('description')
    table.string('status', 50).defaultTo('pending')
    table.string('priority', 20).defaultTo('medium')
    table.integer('project_id').unsigned().notNullable()
    table.integer('assigned_to').unsigned()
    table.integer('created_by').unsigned().notNullable()
    table.date('due_date')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Foreign keys
    table.foreign('project_id').references('id').inTable('projects').onDelete('CASCADE')
    table.foreign('assigned_to').references('id').inTable('users').onDelete('SET NULL')
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE')
    
    // Indexes
    table.index('project_id')
    table.index('assigned_to')
    table.index('status')
    table.index('priority')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks')
};
