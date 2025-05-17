// src/services/universalCookieService.ts

/**
 * A universal cookie service that works in both client and server components
 */
const cookies = {
  get: (name: string): string | undefined => {
    // Server-side
    if (typeof window === 'undefined') {
      // This will throw an error if used in a client component
      try {
        const { cookies } = require('next/headers');
        return cookies().get(name)?.value;
      } catch (e) {
        console.error('Cannot use cookies() in client components');
        return undefined;
      }
    }
    
    // Client-side
    else {
      // Use js-cookie or a direct way to access cookies
      const value = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
      
      return value ? decodeURIComponent(value) : undefined;
    }
  },
  
  set: (name: string, value: string, options: { 
    expires?: Date | number, 
    path?: string,
    sameSite?: 'strict' | 'lax' | 'none',
    secure?: boolean
  } = {}): void => {
    // Can only set cookies client-side
    if (typeof window === 'undefined') {
      console.error('Cannot set cookies server-side');
      return;
    }
    
    const { expires, path = '/', sameSite = 'lax', secure = true } = options;
    
    let cookie = `${name}=${encodeURIComponent(value)}; path=${path}; samesite=${sameSite}`;
    
    if (secure) cookie += '; secure';
    
    if (expires) {
      if (typeof expires === 'number') {
        // expires is days from now
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookie += `; expires=${date.toUTCString()}`;
      } else {
        cookie += `; expires=${expires.toUTCString()}`;
      }
    }
    
    document.cookie = cookie;
  },
  
  remove: (name: string, path = '/'): void => {
    if (typeof window === 'undefined') {
      console.error('Cannot remove cookies server-side');
      return;
    }
    
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  },
  
  // Check if a cookie exists
  has: (name: string): boolean => {
    return !!cookies.get(name);
  }
};

export default cookies;