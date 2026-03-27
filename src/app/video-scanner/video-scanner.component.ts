import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../service/supabase.service';

interface AccessQrPayload {
  accessId: string;
  doorId: string;
  validUntil: string;
}

type GateMode = 'GATE_IN' | 'GATE_OUT';

@Component({
  selector: 'app-video-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, SelectButtonModule],
  templateUrl: './video-scanner.component.html',
  styleUrl: './video-scanner.component.scss'
})
export class VideoScannerComponent {
  selectedMode: GateMode = 'GATE_IN';
  isScanning = false;
  lastPayload: AccessQrPayload | null = null;

  readonly modeOptions = [
    { label: 'Check-in (ทางเข้า)', value: 'GATE_IN' },
    { label: 'Check-out (ทางออก)', value: 'GATE_OUT' }
  ];

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly toastController: ToastController
  ) {}

  get selectedDoorId(): GateMode {
    return this.selectedMode;
  }

  async scanQrCode(): Promise<void> {
    if (this.isScanning) {
      return;
    }

    this.isScanning = true;

    try {
      const supportResult = await BarcodeScanner.isSupported();
      if (!supportResult.supported) {
        await this.presentToast('อุปกรณ์นี้ยังไม่รองรับการสแกน QR', 'warning');
        return;
      }

      const permissionResult = await BarcodeScanner.requestPermissions();
      if (permissionResult.camera !== 'granted') {
        await this.presentToast('ต้องอนุญาตสิทธิ์กล้องก่อนใช้งาน', 'warning');
        return;
      }

      const result = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode]
      });

      const rawValue = result.barcodes?.[0]?.rawValue;
      if (!rawValue) {
        await this.presentToast('ไม่พบข้อมูลใน QR Code', 'warning');
        return;
      }

      const payload = this.parsePayload(rawValue);
      if (!payload) {
        return;
      }

      this.lastPayload = payload;

      const { data, error } = await this.supabaseService.supabase.rpc('process_gate_access', {
        p_access_id: payload.accessId,
        p_door_id: this.selectedDoorId
      });

      if (error) {
        await this.handleRpcError(error.message || 'ไม่สามารถประมวลผลการเข้า-ออกได้');
        return;
      }

      const displayName = this.extractUserName(data);
      const actionText = this.selectedDoorId === 'GATE_IN' ? 'เช็คอินสำเร็จ' : 'เช็คเอาท์สำเร็จ';
      const message = displayName ? `${actionText}: ${displayName}` : actionText;
      await this.presentToast(message, 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดระหว่างการสแกน';
      await this.presentToast(message, 'danger');
    } finally {
      this.isScanning = false;
    }
  }

  private parsePayload(rawValue: string): AccessQrPayload | null {
    try {
      const parsed = JSON.parse(rawValue) as Partial<AccessQrPayload>;
      const accessId = parsed.accessId?.trim();
      const doorId = parsed.doorId?.trim();
      const validUntil = parsed.validUntil?.trim();

      if (!accessId || !doorId || !validUntil) {
        void this.presentToast('รูปแบบ QR ไม่ถูกต้อง (ข้อมูลไม่ครบ)', 'danger');
        return null;
      }

      const expiryTime = new Date(validUntil).getTime();
      if (Number.isNaN(expiryTime)) {
        void this.presentToast('รูปแบบเวลาใน QR ไม่ถูกต้อง', 'danger');
        return null;
      }

      if (expiryTime < Date.now()) {
        void this.presentToast('รหัสหมดอายุแล้ว', 'danger');
        return null;
      }

      return { accessId, doorId, validUntil };
    } catch {
      void this.presentToast('ข้อมูล QR ไม่ใช่ JSON ที่รองรับ', 'danger');
      return null;
    }
  }

  private extractUserName(data: unknown): string {
    if (!data || typeof data !== 'object') {
      return '';
    }

    if (Array.isArray(data)) {
      const firstRow = data[0] as Record<string, unknown> | undefined;
      return this.pickName(firstRow);
    }

    return this.pickName(data as Record<string, unknown>);
  }

  private pickName(row?: Record<string, unknown>): string {
    if (!row) {
      return '';
    }

    const name = row['full_name'] || row['name'] || row['user_name'] || row['username'];
    return typeof name === 'string' ? name : '';
  }

  private async handleRpcError(rawMessage: string): Promise<void> {
    const lowered = rawMessage.toLowerCase();

    if (lowered.includes('expired')) {
      await this.presentToast('รหัสหมดอายุแล้ว', 'danger');
      return;
    }

    if (lowered.includes('invalid')) {
      await this.presentToast('QR ไม่ถูกต้องหรือไม่สามารถใช้งานได้', 'danger');
      return;
    }

    await this.presentToast(`ไม่สามารถเช็คสิทธิ์ได้: ${rawMessage}`, 'danger');
  }

  private async presentToast(
    message: string,
    color: 'success' | 'warning' | 'danger'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'top',
      color
    });

    await toast.present();
  }
}
