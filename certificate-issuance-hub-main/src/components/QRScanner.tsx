import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

const QRScanner = ({ onScan, onError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {
          // QR code not found - this is normal during scanning
        }
      );

      setIsScanning(true);
      setHasPermission(true);
    } catch (err) {
      console.error("Scanner error:", err);
      setHasPermission(false);
      onError?.("Failed to access camera. Please check permissions.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id={containerId}
        className="w-full max-w-sm overflow-hidden rounded-xl bg-secondary"
        style={{ minHeight: isScanning ? "300px" : "0" }}
      />

      {!isScanning && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Scan a certificate QR code to verify
          </p>
        </div>
      )}

      <Button
        onClick={isScanning ? stopScanner : startScanner}
        variant={isScanning ? "secondary" : "default"}
        className="w-full max-w-xs"
      >
        {isScanning ? (
          <>
            <CameraOff className="mr-2 h-4 w-4" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera Scanner
          </>
        )}
      </Button>

      {hasPermission === false && (
        <p className="text-center text-sm text-destructive">
          Camera access denied. Please enable camera permissions.
        </p>
      )}
    </div>
  );
};

export default QRScanner;
