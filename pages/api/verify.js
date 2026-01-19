import { supabase } from '../../libs/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  const { key, hwid, version } = req.body

  if (!key)
    return res.status(400).json({ error: 'Key required' })

  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('key', key)
    .single()

  if (error || !data)
    return res.status(401).json({ error: 'Invalid key' })

  if (!data.is_active)
    return res.status(403).json({ error: 'Key disabled' })

  if (data.expires_at && new Date(data.expires_at) < new Date())
    return res.status(403).json({ error: 'Key expired' })

  // trava HWID
  if (!data.hwid && hwid) {
    await supabase
      .from('licenses')
      .update({ hwid })
      .eq('id', data.id)
  } else if (data.hwid && data.hwid !== hwid) {
    return res.status(403).json({ error: 'HWID mismatch' })
  }

  // checagem de versão
  if (data.version && data.version !== version) {
    return res.status(426).json({
      error: 'Update required',
      version: data.version
    })
  }

  return res.status(200).json({
    success: true,
    expires_at: data.expires_at
  })
}
