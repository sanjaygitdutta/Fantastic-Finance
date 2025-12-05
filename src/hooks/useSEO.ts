import { useEffect } from 'react';

export interface SEOConfig {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    keywords?: string;
    author?: string;
    twitterCard?: 'summary' | 'summary_large_image';
}

export function useSEO(config: SEOConfig) {
    useEffect(() => {
        // Update document title
        if (config.title) {
            document.title = config.title;
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && config.description) {
            metaDescription.setAttribute('content', config.description);
        }

        // Update OG title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && config.title) {
            ogTitle.setAttribute('content', config.title);
        }

        // Update OG description
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && config.description) {
            ogDescription.setAttribute('content', config.description);
        }

        // Update OG image
        if (config.ogImage) {
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) {
                ogImage.setAttribute('content', config.ogImage);
            }
        }

        // Update Twitter card
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle && config.title) {
            twitterTitle.setAttribute('content', config.title);
        }

        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription && config.description) {
            twitterDescription.setAttribute('content', config.description);
        }

        if (config.ogImage) {
            const twitterImage = document.querySelector('meta[property="twitter:image"]');
            if (twitterImage) {
                twitterImage.setAttribute('content', config.ogImage);
            }
        }

        // Update canonical URL
        if (config.canonical) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', config.canonical);
        }
    }, [config]);
}
