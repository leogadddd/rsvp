import RSVPForm from "../form";
import Image from "next/image";
export default function Home() {
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
      <RSVPForm />
      <div className="pt-24"></div>
    </div>
  );
}
