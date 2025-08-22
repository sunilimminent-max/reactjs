import { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseService } from '@/server/database/DatabaseService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const dbService = new DatabaseService()
    
    // Test database connection
    const isHealthy = await dbService.healthCheck()
    
    if (!isHealthy) {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      })
    }

    // Get database statistics
    const stats = await dbService.getStats()

    return res.status(200).json({
      status: 'healthy',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      stats
    })
  } catch (error) {
    console.error('Database health check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
} 