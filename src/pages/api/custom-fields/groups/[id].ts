import type { NextApiRequest, NextApiResponse } from 'next'
import { CustomFieldController } from '@/server/controllers/CustomFieldController'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new CustomFieldController(req, res)
  
  try {
    if (req.method === 'PUT' || req.method === 'PATCH') {
      await controller.updateFieldGroup()
    } else if (req.method === 'DELETE') {
      await controller.deleteFieldGroup()
    } else {
      res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE'])
      res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Custom field group API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 