export interface Metric {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  color: string;
}

export interface Change {
  field: string;
  old: string;
  new: string;
}

export interface Meta {
  location?: string;
  device?: string;
  method?: string;
  verification?: string;
}

export interface ActivityLog {
  id: number;
  
  // ✅ 1. แก้ไขชื่อและขยาย Type ให้รองรับ Backend
  log_type?: string; // Backend ส่งมาเป็นคำนี้
  logType?: string;  // เผื่อไว้ถ้า HTML เดิมยังใช้อยู่
  
  time_display?: string; // Backend ส่งเวลามาในชื่อนี้
  time?: string; 
  
  type: string;
  action: string;
  user: string;
  
  // ✅ 2. ปลดล็อค Category จาก 'normal' | 'abnormal' ให้เป็น string ธรรมดา
  // เพื่อให้รองรับคำว่า 'Admin Management' ได้
  category: string; 
  
  // ✅ 3. ปลดล็อค Status เป็น string เพราะ Backend อาจจะส่ง 'Success' (ตัว S ใหญ่) มา
  status: string; 
  
  entity_id?: string; // Backend ส่งมาเป็นคำนี้
  entityId?: string;
  detail?: string;
  changes?: Change[];
  meta?: Meta;
}