"use client";

import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function Page() {
  const devices = useDevices();
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleScan = (detectedCodes) => {
    console.log("Detected codes:", detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach((code) => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  };

  const highlightCodeOnCanvas = (detectedCodes, ctx) => {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;

      // Draw bounding box
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 4;
      ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

      // Draw corner points
      ctx.fillStyle = "#FF0000";
      cornerPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };
  return (
    <div>
      <select onChange={(e) => setSelectedDevice(e.target.value)}>
        <option value="">Select a camera</option>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <Scanner
        onScan={(result) => console.log(result)}
        constraints={{
          deviceId: selectedDevice,
        }}
        components={{
          audio: true, // Play beep sound on scan
          onOff: true, // Show camera on/off button
          torch: true, // Show torch/flashlight button (if supported)
          zoom: true, // Show zoom control (if supported)
          finder: true, // Show finder overlay
          tracker: highlightCodeOnCanvas,
          facingMode: "environment", // Use rear camera
          aspectRatio: 1, // Square aspect ratio
          // Advanced constraints
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }}
      />
    </div>
  );
}
