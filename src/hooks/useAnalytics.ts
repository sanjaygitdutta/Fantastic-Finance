import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useAnalytics() {
    const location = useLocation();
    const { user } = useAuth();
    const sessionStartTime = useRef<number>(Date.now());

    // Track Page Views
    useEffect(() => {
        const trackPageView = async () => {
            try {
                await supabase.from('analytics_events').insert({
                    user_id: user?.id || null,
                    event_type: 'page_view',
                    metadata: {
                        path: location.pathname,
                        search: location.search
                    }
                });
            } catch (error) {
                console.error('Error tracking page view:', error);
            }
        };

        trackPageView();
    }, [location.pathname, user]);

    // Track Session Start/End
    useEffect(() => {
        // Session Start
        const startSession = async () => {
            try {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const deviceType = isMobile ? 'Mobile' : 'Desktop';

                await supabase.from('analytics_events').insert({
                    user_id: user?.id || null,
                    event_type: 'session_start',
                    metadata: {
                        userAgent: navigator.userAgent,
                        screenSize: `${window.innerWidth}x${window.innerHeight}`,
                        device_type: deviceType
                    }
                });
            } catch (error) {
                console.error('Error tracking session start:', error);
            }
        };

        startSession();

        // Session End (on unmount)
        return () => {
            const duration = (Date.now() - sessionStartTime.current) / 1000; // seconds
            const endSession = async () => {
                try {
                    await supabase.from('analytics_events').insert({
                        user_id: user?.id || null,
                        event_type: 'session_end',
                        metadata: {
                            duration_seconds: duration
                        }
                    });
                } catch (error) {
                    console.error('Error tracking session end:', error);
                }
            };
            endSession();
        };
    }, []); // Run once on mount/unmount
    const logEvent = async (eventType: string, metadata: any = {}) => {
        try {
            await supabase.from('analytics_events').insert({
                user_id: user?.id || null,
                event_type: eventType,
                metadata: {
                    ...metadata,
                    path: location.pathname,
                    device_type: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
                }
            });
        } catch (error) {
            console.error(`Error tracking event ${eventType}:`, error);
        }
    };

    return { logEvent };
}
