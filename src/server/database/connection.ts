import knex from 'knex'
import knexConfig from '../../../knexfile'

const environment = process.env.NODE_ENV || 'development'
const config = knexConfig[environment as keyof typeof knexConfig]

if (!config) {
  throw new Error(`Database configuration not found for environment: ${environment}`)
}

const db = knex(config)

export default db 