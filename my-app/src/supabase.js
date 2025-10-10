import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vtefixwpkbsgxftfxodg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZWZpeHdwa2JzZ3hmdGZ4b2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTcwNDksImV4cCI6MjA3NTE3MzA0OX0.gHIx98ZRsQhJ7g-ysxhr1P6heK5Id2JmDUh2fXwdtmM";      // from Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
