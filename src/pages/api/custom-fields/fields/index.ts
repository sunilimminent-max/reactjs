import type { NextApiRequest, NextApiResponse } from 'next'
import { CustomFieldController } from '@/server/controllers/CustomFieldController'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new CustomFieldController(req, res)
  
  try {
    if (req.method === 'POST') {
      await controller.createField()
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Custom fields API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 