import type { NextApiRequest, NextApiResponse } from 'next'
import { PageController } from '@/server/controllers/PageController'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new PageController(req, res)
  
  try {
    if (req.method === 'GET') {
      await controller.getHomePage()
    } else if (req.method === 'POST') {
      await controller.updateHomePage()
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Home page API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 