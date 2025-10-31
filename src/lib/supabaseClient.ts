import { createClient } from '@supabase/supabase-js';

// Read environment variables robustly for Vite / Next / runtime environments.
// Vite exposes variables via import.meta.env (typically prefixed with VITE_),
// some projects ported from Next.js may use NEXT_PUBLIC_* names. Also allow
// an optional runtime-injected `window.__env` object if your deployment uses it.

const runtimeWindowEnv = typeof window !== 'undefined' ? (window as any)?.__env : undefined;

const supabaseUrl =
	// runtime-injected window env (optional)
	(runtimeWindowEnv && runtimeWindowEnv.NEXT_PUBLIC_SUPABASE_URL) ||
	// Vite-style variable (recommended for Vite projects)
	(import.meta.env as any).VITE_SUPABASE_URL ||
	// keep compatibility with Next.js-style var names if present in import.meta
	(import.meta.env as any).NEXT_PUBLIC_SUPABASE_URL ||
	// Node process env fallback (build-time/server) - guard to avoid ReferenceError in browser
	(typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined) ||
	'https://placeholder.supabase.co';

const supabaseAnonKey =
	(runtimeWindowEnv && runtimeWindowEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
	(import.meta.env as any).VITE_SUPABASE_ANON_KEY ||
	(import.meta.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	(typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) ||
	'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
