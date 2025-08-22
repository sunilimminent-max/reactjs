import type { NextApiRequest, NextApiResponse } from 'next'
import { PageController } from '@/server/controllers/PageController'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new PageController(req, res)
  
  try {
    if (req.method === 'GET') {
      await controller.getPage()
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      await controller.updatePage()
    } else if (req.method === 'DELETE') {
      await controller.deletePage()
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
      res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Page API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 