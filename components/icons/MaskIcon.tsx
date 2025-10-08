
import React from 'react';

export const MaskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-3.14 0-6.02-1.42-7.98-3.66a.75.75 0 01.24-1.29C6.06 6.8 8.87 6 12 6s5.94.8 7.74 1.8c.4.2.5.71.24 1.29C18.02 11.33 15.14 12.75 12 12.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-3.14 0-6.02 1.42-7.98 3.66a.75.75 0 00-.24 1.29c1.7 1 4.5 1.8 7.74 1.8s5.94-.8 7.74-1.8a.75.75 0 00.24-1.29C18.02 14.17 15.14 12.75 12 12.75z" />
    </svg>
);
