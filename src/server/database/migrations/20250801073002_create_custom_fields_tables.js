exports.up = function(knex) {
  return knex.schema
    .createTable('custom_field_groups', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('key').notNullable().unique();
      table.text('description');
      table.json('location_rules'); // Where this field group appears
      table.integer('menu_order').defaultTo(0);
      table.boolean('active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('custom_fields', function(table) {
      table.increments('id').primary();
      table.integer('field_group_id').unsigned().references('id').inTable('custom_field_groups').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('key').notNullable();
      table.string('type').notNullable(); // text, textarea, image, select, etc.
      table.string('label').notNullable();
      table.text('instructions');
      table.boolean('required').defaultTo(false);
      table.json('field_config'); // Field-specific configuration
      table.integer('menu_order').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('custom_field_values', function(table) {
      table.increments('id').primary();
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
      table.integer('field_id').unsigned().references('id').inTable('custom_fields').onDelete('CASCADE');
      table.text('value');
      table.timestamps(true, true);
      
      // Unique constraint to prevent duplicate values for same post+field
      table.unique(['post_id', 'field_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('custom_field_values')
    .dropTableIfExists('custom_fields')
    .dropTableIfExists('custom_field_groups');
}; 