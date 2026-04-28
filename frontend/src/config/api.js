export const BASE_URL = 'http://localhost:5001';
export const API_URL = `${BASE_URL}/api`;

export const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};
