// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from '@/supabase/supabase.config'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const refreshToken = req.cookies['my-refresh-token']
    const accessToken = req.cookies['my-access-token']
    
    if (refreshToken && accessToken) {
      await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      })
    } else {
      // make sure you handle this case!
      throw new Error('User is not authenticated.')
    }
    
    // returns user information
    await supabase.auth.getUser()
}
