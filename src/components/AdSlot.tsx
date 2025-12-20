import { useEffect } from 'react';

interface AdSlotProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal' | 'autorelaxed';
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const getAdSenseClientId = () => {
    const storedId = localStorage.getItem('VITE_ADSENSE_CLIENT_ID');
    if (storedId) return storedId;
    return import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
};

const AdSlot = ({
    slot,
    format = 'auto',
    responsive = true,
    className = '',
    style
}: AdSlotProps) => {
    const ADSENSE_CLIENT_ID = getAdSenseClientId();

    useEffect(() => {
        try {
            if (ADSENSE_CLIENT_ID !== 'ca-pub-XXXXXXXXXXXXXXXX') {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, [ADSENSE_CLIENT_ID]);

    return (
        <div className={`ad-container my-4 overflow-hidden ${className}`} style={style}>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block text-center">Sponsored</span>
            <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center min-h-[100px] border border-dashed border-slate-200 dark:border-slate-700">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', ...style }}
                    data-ad-client={ADSENSE_CLIENT_ID}
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive={responsive ? 'true' : 'false'}
                />
            </div>
        </div>
    );
};

export default AdSlot;
