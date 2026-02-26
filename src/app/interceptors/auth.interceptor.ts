import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. ค้นหา Token ของ Supabase ใน LocalStorage
  // Key ปกติคือ: sb-<project-ref>-auth-token (หาตัวที่ขึ้นต้นด้วย sb-)
  const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  
  let token = '';
  if (key) {
    try {
      const session = JSON.parse(localStorage.getItem(key)!);
      token = session.access_token; // ดึง access_token ออกมาss
    } catch (e) {
      console.error('Error parsing session', e);
    }
  }

  // 2. ถ้ามี Token ให้แนบไปกับ Header (Bearer Token)
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // 3. ถ้าไม่มีก็ปล่อยไปตามปกติ
  return next(req);
};