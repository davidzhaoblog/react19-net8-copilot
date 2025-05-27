'use client';

import { useEffect } from 'react';

export function MetadataDebugger() {
    useEffect(() => {
        console.log('Current document head:', document.head);
        const title = document.querySelector('title')?.textContent;
        console.log('Page title:', title);
        const metaTags = Array.from(document.querySelectorAll('meta'));
        console.log('Meta tags:', metaTags.map(tag => ({
            name: tag.getAttribute('name'),
            content: tag.getAttribute('content')
        })));

        // More metadata usage examples
        // Access the Next.js internal metadata 
        console.log('Next.js metadata queue:', (window as any).__next_f);

        // Log the actual document head
        console.log('Document head:', document.head);
    }, []);

    return null; // Renders nothing
}