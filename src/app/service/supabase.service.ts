import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;
  private session: Session | null = null;
  private initPromise: Promise<void>; // ตัวจัดการคิวไม่ให้แย่งกัน

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { 
        detectSessionInUrl: true, 
        persistSession: true 
      }
    });

    // 🚀 ดึง Token แค่ "ครั้งเดียว" ตอนเปิดเว็บ แล้วเก็บไว้ใน Promise
    this.initPromise = this.supabase.auth.getSession().then(({ data }) => {
      this.session = data.session;
    });

    // อัปเดต Token เมื่อมีการ Login/Logout
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.session = session;
    });
  }

  // 🚀 Service อื่นๆ จะมาเรียกใช้ฟังก์ชันนี้
  // มันจะ "รอ" จนกว่าการดึง Token ครั้งแรกสุดจะเสร็จ (รับประกันว่าไม่แย่งกัน 100%)
  async getAuthToken(): Promise<string | null> {
    await this.initPromise; 
    return this.session?.access_token || null;
  }
}