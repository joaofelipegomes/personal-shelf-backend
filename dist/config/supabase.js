"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminClient = exports.getAuthClient = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Faltam variáveis de ambiente do Supabase!");
}
// Cliente global para ações administrativas ou autenticação base
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl || '', supabaseAnonKey || '');
// Função para criar um cliente autenticado com o token do usuário logado
const getAuthClient = (token) => {
    return (0, supabase_js_1.createClient)(supabaseUrl || '', supabaseAnonKey || '', {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
};
exports.getAuthClient = getAuthClient;
// Cliente para usar funções administrativas bypassando as RLS (Row Level Security)
const getAdminClient = () => {
    return (0, supabase_js_1.createClient)(supabaseUrl || '', supabaseServiceRoleKey || '');
};
exports.getAdminClient = getAdminClient;
