import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://umilfqlyfkxxdcggqexh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaWxmcWx5Zmt4eGRjZ2dxZXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjA4NTksImV4cCI6MjEwNTg5Njg1OX0.UHAc6g1abkru7BB66qDsm3cCOO8IJVl7yOEZZFzuQ4Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);