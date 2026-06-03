import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bxlkbnzaigkrifvtdmji.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4bGtibnphaWdrcmlmdnRkbWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0Mzg4MDAsImV4cCI6MjA5NDAxNDgwMH0.Akg5IMl2BMhZaxWqgm6GkJP1q9e8Ru6ay4Kl-zYMtTs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
