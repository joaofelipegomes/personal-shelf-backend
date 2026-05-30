import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltam variáveis de ambiente do Supabase!");
}

// Cliente global para ações administrativas ou autenticação base
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Função para criar um cliente autenticado com o token do usuário logado
export const getAuthClient = (token: string) => {
  return createClient(supabaseUrl || '', supabaseAnonKey || '', {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

// Cliente para usar funções administrativas bypassando as RLS (Row Level Security)
export const getAdminClient = () => {
  return createClient(supabaseUrl || '', supabaseServiceRoleKey || '');
};
