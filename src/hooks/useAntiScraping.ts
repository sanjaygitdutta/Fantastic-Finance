import { useEffect } from 'react';

/**
 * Hook to prevent scraping and protect content
 * - Disables Right Click
 * - Disables Text Selection
 * - Disables Developer Tools Shortcuts
 */
export const useAntiScraping = () => {
    useEffect(() => {
        // Prevent context menu (right click)
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Prevent keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent F12 (Dev Tools)
            if (e.key === 'F12') {
                e.preventDefault();
            }

            // Prevent Ctrl+Shift+I (Dev Tools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
            }

            // Prevent Ctrl+Shift+J (Dev Tools Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
            }

            // Prevent Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
            }

            // Prevent Ctrl+S (Save Page)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
            }

            // Prevent Ctrl+P (Print)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
            }
        };

        // Add global styles for user-select
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            body {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            input, textarea {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.head.removeChild(style);
        };
    }, []);
};
