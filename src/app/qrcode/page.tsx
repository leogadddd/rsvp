"use client";

import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import { Button } from "@/c/ui/button";
import { Input } from "@/components/ui/input";

const QRCodePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <QRCodeGenerator />
    </div>
  );
};

const QRCodeGenerator = () => {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [link, setLink] = useState<string>("https://invitation.leogadil.com");

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
          value={link}
          title="Title for my QR Code"
          size={128}
          bgColor="#fbf6e3"
          fgColor="#000000"
          level="L"
        />
      </div>
      <Input value={link} onChange={(e) => setLink(e.target.value)} />
      <Button onClick={downloadQRCode} variant={"outline"}>
        Download
      </Button>
    </div>
  );
};

export default QRCodePage;
