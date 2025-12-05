import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

console.log('Supabase Config:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length,
    isConfigured: !!supabaseUrl && !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Validate URL to prevent "Failed to execute 'fetch' on 'Window': Invalid value" errors
const isValidUrl = (urlString: string) => {
    try {
        return Boolean(new URL(urlString));
    } catch (e) {
        return false;
    }
};

const urlToUse = supabaseUrl && isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const keyToUse = supabaseAnonKey || 'placeholder-key';

if (urlToUse === 'https://placeholder.supabase.co') {
    console.warn('Using placeholder Supabase URL. Authentication and database features will not work. Please check your .env file.');
    if (supabaseUrl) {
        console.error('Invalid VITE_SUPABASE_URL provided:', supabaseUrl);
    }
}

export const isSupabaseConfigured = !!supabaseUrl &&
    !!supabaseAnonKey &&
    isValidUrl(supabaseUrl) &&
    !supabaseUrl.includes('placeholder.supabase.co');

// Clear stale sessions if not configured to prevent "Invalid value" fetch errors
if (!isSupabaseConfigured) {
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                console.log('Clearing stale Supabase session:', key);
                localStorage.removeItem(key);
            }
        });
    } catch (e) {
        // Ignore errors accessing localStorage
    }
}

// Create client with options to prevent errors when using placeholder
const realSupabase = createClient(urlToUse, keyToUse, {
    auth: {
        // Disable auto-refresh if using placeholder to prevent fetch errors
        autoRefreshToken: isSupabaseConfigured,
        persistSession: isSupabaseConfigured,
        detectSessionInUrl: isSupabaseConfigured,
    }
});

// Mock client to prevent ANY network requests when not configured
const mockSupabase = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                single: async () => ({ data: null, error: null }),
                data: null,
                error: null
            }),
            data: null,
            error: null
        })
    })
} as any;

export const supabase = isSupabaseConfigured ? realSupabase : mockSupabase;