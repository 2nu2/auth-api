import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { key, hwid, version } = req.body

  if (!key || !hwid) {
    return res.json({ success: false, message: 'Missing data' })
  }

  // busca key
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('key', key)
    .single()

  if (error || !data) {
    return res.json({ success: false, message: 'Invalid key' })
  }

  if (!data.is_active) {
    return res.json({ success: false, message: 'Key disabled' })
  }

  // versão
  if (data.version && data.version !== version) {
    return res.json({
      success: false,
      update: true,
      message: 'Update required'
    })
  }

  // expiração
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return res.json({ success: false, message: 'Key expired' })
  }

  // HWID
  if (data.hwid && data.hwid !== hwid) {
    return res.json({ success: false, message: 'HWID mismatch' })
  }

  // primeiro login → registra hwid
  if (!data.hwid) {
    await supabase
      .from('licenses')
      .update({
        hwid: hwid,
        last_ip: req.headers['x-forwarded-for'] || 'unknown'
      })
      .eq('id', data.id)
  }

  return res.json({
    success: true,
    message: 'Authorized',
    expires_at: data.expires_at
  })
}
