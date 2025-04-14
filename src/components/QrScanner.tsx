import React, { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    overflow: "hidden",
    width: "var(--qr-scanner-width)",
    height: "var(--qr-scanner-height)",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  canvas: {
    display: "none",
  },
});

interface QrScannerProps {
  onScan?: (result: string) => void;
  onError?: (error: string) => void;
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
  className?: string;
}

const QrScanner: React.FC<QrScannerProps> = ({
  onScan,
  onError,
  width = 300,
  height = 300,
  facingMode = "environment",
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const styles = useStyles();

  const startCamera = useCallback(async () => {
    if (stream) {
      console.log("Stopping previous stream:", stream);
      stream.getTracks().forEach((track) => track.stop());
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: width },
        height: { ideal: height },
      },
      audio: false,
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("MediaStream obtained:", mediaStream);
      setStream((prevStream) => {
        if (prevStream !== mediaStream) {
          return mediaStream;
        }
        return prevStream;
      });
      if (videoRef.current && videoRef.current.srcObject !== mediaStream) {
        videoRef.current.srcObject = mediaStream;
        console.log("Video element srcObject set:", videoRef.current.srcObject);
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              console.log("Video is playing");
            })
            .catch((playError) => {
              console.error("Error playing video:", playError);
            });
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      onError?.(err instanceof Error ? err.message : "Failed to access camera");
    }
  }, [facingMode, height, onError, width]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        console.log("Cleaning up stream:", stream);
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;

    const scanQRCode = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          onScan?.(code.data);
        }
      }
      animationFrameId = requestAnimationFrame(scanQRCode);
    };

    scanQRCode();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onScan]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <div
      className={`${styles.container} ${className || ""}`}
      style={
        {
          ["--qr-scanner-width" as string]: typeof width === "number" ? `${width}px` : width,
          ["--qr-scanner-height" as string]: typeof height === "number" ? `${height}px` : height,
        } as React.CSSProperties
      }
    >
      <video ref={videoRef} className={styles.video} playsInline />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default QrScanner;
