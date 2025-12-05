import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
    canonicalUrl?: string;
}

export default function SEO({
    title = "Live Stock Market Dashboard & AI Analysis | Fantastic Finance",
    description = "Track live Indian stock market data (NIFTY, SENSEX), analyze options chains, and get AI-powered trading signals. The best platform for derivatives trading and market analysis.",
    keywords = "stock market, share market, indian stock market, live market data, nifty 50, bank nifty, options trading, option chain, ai trading, trading platform, stock analysis",
    image = "https://fantasticfinance.com/og-image.jpg",
    type = "website",
    canonicalUrl
}: SEOProps) {
    const location = useLocation();
    const url = canonicalUrl || `https://fantasticfinance.com${location.pathname}`;
    const siteTitle = "Fantastic Finance";

    // Ensure title has the site name if not already present
    const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
}
