import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
    canonicalUrl?: string;
    schemaData?: object | object[];
}

export default function SEO({
    title = "Live Stock Market Dashboard & AI Analysis | Fantastic Finance",
    description = "Master the Indian stock market with real-time NIFTY/SENSEX data, AI-powered option chain analysis, and professional strategy builders. Get the edge you need for derivatives trading.",
    keywords = "stock market dashboard, NIFTY live analysis, options strategy builder, Indian stock market AI, option chain Greeks, financial news India, investing strategies, nse.com analysis, investing.com alternative, stock market academy, real-time market data",
    image = "https://fantasticfinancialadvisory.com/og-image.jpg",
    type = "website",
    canonicalUrl,
    schemaData
}: SEOProps) {
    const location = useLocation();
    const url = canonicalUrl || `https://fantasticfinancialadvisory.com${location.pathname}`;
    const siteTitle = "Fantastic Finance";

    // Ensure title has the site name if not already present
    const fullTitle = title === "Dashboard" ? `${title} | ${siteTitle}` : (title.includes(siteTitle) ? title : `${title} | ${siteTitle}`);

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

            {/* Structured Data */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}
        </Helmet>
    );
}
