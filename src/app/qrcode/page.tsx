"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import { Button } from "@/c/ui/button";

const QRCodePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <QRCodeGenerator />
    </div>
  );
};

const QRCodeGenerator = () => {
  const qrRef = useRef<HTMLDivElement | null>(null);

  const downloadQRCode = () => {
    const qrElement = qrRef.current;

    if (!qrElement) return;

    html2canvas(qrElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qr-code.png";
      link.click();
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-12">
      <div ref={qrRef}>
        <QRCodeSVG
          value="https://invitation.leogadil.com"
          title="Title for my QR Code"
          size={128}
          bgColor="#fbf6e3"
          fgColor="#000000"
          level="L"
        />
      </div>
      <Button onClick={downloadQRCode} variant={"outline"}>
        Download
      </Button>
    </div>
  );
};

export default QRCodePage;
