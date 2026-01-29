// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://czcksdlxuovenbhyabne.supabase.co'
const supabaseAnonKey = 'sb_publishable_GG0_i90KCnsUKgH4E-PLKQ_RdqD_sLn'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)