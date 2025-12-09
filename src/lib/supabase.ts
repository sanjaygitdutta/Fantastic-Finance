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
// This must support all methods used by analytics and admin dashboard

// Create a chainable mock query builder that returns empty results
const createMockQueryBuilder = () => {
    const builder: any = {
        select: () => builder,
        insert: async () => ({ data: null, error: null }),
        update: () => builder,
        delete: () => builder,
        upsert: async () => ({ data: null, error: null }),
        eq: () => builder,
        neq: () => builder,
        gte: () => builder,
        lte: () => builder,
        gt: () => builder,
        lt: () => builder,
        like: () => builder,
        ilike: () => builder,
        is: () => builder,
        in: () => builder,
        order: () => builder,
        limit: () => builder,
        range: () => builder,
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        // Support async iteration / await
        then: (resolve: any) => resolve({ data: [], count: 0, error: null }),
    };
    return builder;
};

// Create a mock channel for real-time subscriptions
const createMockChannel = () => {
    const channel: any = {
        on: () => channel,
        subscribe: () => channel,
    };
    return channel;
};

const mockSupabase = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
    },
    from: (_table: string) => createMockQueryBuilder(),
    channel: (_name: string) => createMockChannel(),
    removeChannel: (_channel: any) => { },
} as any;

export const supabase = isSupabaseConfigured ? realSupabase : mockSupabase;