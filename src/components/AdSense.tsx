import { useEffect } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal' | 'autorelaxed';
    adLayout?: string;
    adStyle?: React.CSSProperties;
    className?: string;
}

// Get AdSense client ID from localStorage (set by admin) or environment variables
const getAdSenseClientId = () => {
    // First check localStorage (set by admin dashboard)
    const storedId = localStorage.getItem('VITE_ADSENSE_CLIENT_ID');
    if (storedId) return storedId;

    // Fallback to environment variable
    return import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
};

export default function AdSense({
    adSlot,
    adFormat = 'auto',
    adLayout,
    adStyle = { display: 'block' },
    className = ''
}: AdSenseProps) {
    const ADSENSE_CLIENT_ID = getAdSenseClientId();

    useEffect(() => {
        // Don't load ads in development mode
        if (import.meta.env.DEV || !ADSENSE_CLIENT_ID) {
            console.log('AdSense: Skipping ad load in development mode');
            return;
        }

        try {
            // Push ad to AdSense queue
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
            console.error('AdSense error:', error);
        }
    }, [ADSENSE_CLIENT_ID]);

    // Don't render ads if client ID is not configured
    if (!ADSENSE_CLIENT_ID) {
        return null;
    }

    return (
        <div className={`adsense-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={adStyle}
                data-ad-client={ADSENSE_CLIENT_ID}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-ad-layout={adLayout}
                data-full-width-responsive="true"
            />
        </div>
    );
}

// Specialized ad component for in-feed ads
export function InFeedAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
    return (
        <AdSense
            adSlot={adSlot}
            adFormat="fluid"
            adLayout="in-article"
            className={className}
        />
    );
}

// Specialized ad component for sidebar/display ads
export function DisplayAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
    return (
        <AdSense
            adSlot={adSlot}
            adFormat="auto"
            adStyle={{ display: 'block', minHeight: '250px' }}
            className={className}
        />
    );
}

// Multiplex ad for related content
export function MultiplexAd({ adSlot, className = '' }: { adSlot: string; className?: string }) {
    return (
        <AdSense
            adSlot={adSlot}
            adFormat="autorelaxed"
            className={className}
        />
    );
}
