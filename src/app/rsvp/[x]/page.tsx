"use client";

import { useParams } from "next/navigation";

import RSVPForm from "../../form";
import Image from "next/image";

export default function RSVP() {
  const params = useParams();
  const { x } = params;

  return (
    <div className="">
      <div className="">
        <Image
          src={"/top.png"}
          alt="Top-design"
          width={2000}
          height={2000}
          className=""
        />
      </div>
      <RSVPForm isReal={x === "1" ? false : true} />
      <div className="pt-24"></div>
    </div>
  );
}
