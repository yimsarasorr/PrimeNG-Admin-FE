import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from './service/user.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // เช็ค Session จาก Supabase
  return userService.checkSession().pipe(
    take(1), // เอาค่าล่าสุดค่าเดียวแล้วจบ
    map(response => {
      const session = response.data.session;
      
      if (session) {
        // ✅ มี Session: อนุญาตให้ผ่าน
        return true;
      } else {
        // ❌ ไม่มี Session: เตะกลับไปหน้า Login
        return router.createUrlTree(['/login']);
      }
    })
  );
};