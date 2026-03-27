import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastController } from '@ionic/angular';
import { Html5Qrcode } from 'html5-qrcode';
import { SupabaseService } from '../service/supabase.service';

interface AccessQrPayload {
  accessId: string;
  doorId: string;
  validUntil: string;
}

type GateMode = 'GATE_IN' | 'GATE_OUT';

interface CameraOption {
  label: string;
  value: string;
}

interface CameraDevice {
  id: string;
  label: string;
}

@Component({
  selector: 'app-video-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DropdownModule, SelectButtonModule],
  templateUrl: './video-scanner.component.html',
  styleUrl: './video-scanner.component.scss'
})
export class VideoScannerComponent implements AfterViewInit, OnDestroy {
  selectedMode: GateMode = 'GATE_IN';
  selectedCameraId: string | null = null;
  cameraOptions: CameraOption[] = [];
  isScanning = false;
  isBusy = false;
  lastPayload: AccessQrPayload | null = null;
  cameraError = '';

  private qrScanner: Html5Qrcode | null = null;
  private lastScanText = '';
  private lastScanAt = 0;

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

  ngAfterViewInit(): void {
    void this.startScanner();
  }

  ngOnDestroy(): void {
    void this.stopScanner();
  }

  async onCameraChange(): Promise<void> {
    if (!this.selectedCameraId || this.isBusy || !this.isScanning) {
      return;
    }

    await this.stopScanner();
    await this.startScanner();
  }

  async toggleScanner(): Promise<void> {
    if (this.isBusy) {
      return;
    }

    if (this.isScanning) {
      await this.stopScanner();
      return;
    }

    await this.startScanner();
  }

  private async startScanner(): Promise<void> {
    if (this.isScanning || this.isBusy) {
      return;
    }

    this.isBusy = true;
    this.cameraError = '';

    try {
      if (!window.isSecureContext) {
        this.cameraError = 'ต้องเปิดผ่าน HTTPS เพื่อใช้งานกล้องบนเบราว์เซอร์';
        await this.presentToast(this.cameraError, 'warning');
        return;
      }

      const cameras = await this.getAvailableCameras();
      if (!cameras.length) {
        this.cameraError = 'ไม่พบกล้องในอุปกรณ์นี้';
        await this.presentToast(this.cameraError, 'warning');
        return;
      }

      if (!this.selectedCameraId) {
        this.selectedCameraId = this.pickDefaultCameraId(cameras);
      }

      if (!this.qrScanner) {
        this.qrScanner = new Html5Qrcode('reader', { verbose: false });
      }

      await this.qrScanner.start(
        { deviceId: { exact: this.selectedCameraId } },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1
        },
        (decodedText: string) => {
          void this.handleDecodedText(decodedText);
        },
        () => {
          // Ignore per-frame decode errors while waiting for a valid QR code.
        }
      );

      this.isScanning = true;
    } catch (error: unknown) {
      this.cameraError = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดระหว่างเปิดกล้อง';
      const message = this.cameraError;
      await this.presentToast(message, 'danger');
    } finally {
      this.isBusy = false;
    }
  }

  private async getAvailableCameras(): Promise<CameraDevice[]> {
    const cameras = await Html5Qrcode.getCameras();

    this.cameraOptions = cameras.map((camera, index) => ({
      label: camera.label?.trim() || `Camera ${index + 1}`,
      value: camera.id
    }));

    return cameras;
  }

  private pickDefaultCameraId(cameras: CameraDevice[]): string {
    const rearCamera = cameras.find((camera) =>
      /(back|rear|environment|traseira|arriere|hinten|หลัง|後置|后置)/i.test(camera.label)
    );

    return (rearCamera || cameras[0]).id;
  }

  private async stopScanner(): Promise<void> {
    if (!this.qrScanner || !this.isScanning) {
      this.isScanning = false;
      return;
    }

    this.isBusy = true;

    try {
      await this.qrScanner.stop();
      await this.qrScanner.clear();
    } catch {
      // Ignore cleanup errors so UI can recover and restart scanning.
    } finally {
      this.qrScanner = null;
      this.isScanning = false;
      this.isBusy = false;
    }
  }

  private async handleDecodedText(rawValue: string): Promise<void> {
    const now = Date.now();
    if (this.isBusy || (this.lastScanText === rawValue && now - this.lastScanAt < 3000)) {
      return;
    }

    this.lastScanText = rawValue;
    this.lastScanAt = now;
    this.isBusy = true;

    try {
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
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดระหว่างประมวลผล QR';
      await this.presentToast(message, 'danger');
    } finally {
      this.isBusy = false;
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
