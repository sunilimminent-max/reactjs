import type { NextApiRequest, NextApiResponse } from 'next'
import { router } from '@/server/routes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Route the request through our MVC router
    await router.handleRequest(req, res)
  } catch (error) {
    console.error('API handler error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
} 