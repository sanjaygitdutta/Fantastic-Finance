import { useEffect, useRef, memo } from 'react';

export const TVWidget = memo(({ scriptHTML, height = "400px" }: { scriptHTML: any, height?: string }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;

        if (scriptHTML.src) script.src = scriptHTML.src;
        if (scriptHTML.innerHTML) script.innerHTML = scriptHTML.innerHTML;

        container.current.appendChild(script);
        return () => {
            if (container.current) container.current.innerHTML = '';
        };
    }, [scriptHTML]);

    return (
        <div className="tradingview-widget-container" style={{ height }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});
