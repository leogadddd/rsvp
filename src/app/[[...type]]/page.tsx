"use client";

import { useParams } from "next/navigation";

import { Navigation, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Schoolbell } from "next/font/google";

const schoolbell = Schoolbell({
  weight: ["400"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
});

export default function Home() {
  const params = useParams();
  const { type } = params;

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
      <LandingPage isReal={type == "sat" ? false : true} />
      <div className="pt-24"></div>
    </div>
  );
}

interface LandingPageProps {
  isReal: boolean;
}

const LandingPage = ({ isReal }: LandingPageProps) => {
  return (
    <div className="flex flex-col gap-y-2 w-full max-w-xl mx-auto relative">
      <Image
        src={"/half-note.png"}
        alt="half-note"
        width={1000}
        height={1000}
        className="h-6 w-6 absolute top-1/2 left-10 animate-jittery-3"
      />
      <Image
        src={"/shimmer.png"}
        alt="half-note"
        width={1000}
        height={1000}
        className="h-6 w-6 absolute top-[calc(50%-3em)] right-10 animate-jittery-3 animate-delay-2"
      />
      <div className="mx-auto px-4 mt-10">
        <Image
          src={"/title.png"}
          alt="Jannea Eiden is Turning 19"
          width={2000}
          height={2000}
          className="w-full max-w-sm"
        />
      </div>
      <div className="mx-auto px-4 w-full max-w-sm">
        <h3
          className="text-primary text-xl sm:text-2xl text-center animate-delay-1"
          style={{ fontFamily: "wcmano-bold" }}
        >
          {isReal
            ? "Friday, April 25th | 7PM - Saturday, April 26th | 4pm"
            : "Saturday, April 26th | 8AM - 1PM"}
        </h3>
      </div>
      <div className="mx-auto px-4 mt-4">
        <Image
          src={"/cake.png"}
          alt="cake"
          width={2000}
          height={2000}
          className="w-full sm:w-3/4 max-w-sm mx-auto animate-jittery-1"
        />
      </div>
      <div className="mx-auto px-4 w-full max-w-sm mt-10 flex flex-col gap-y-2 items-center">
        <div>
          <h3
            className="text-foreground text-3xl/5 sm:text-4xl/5 text-center"
            style={{ fontFamily: "wcmano-bold" }}
          >
            The Lauv Villa
          </h3>
          <h2
            className={`text-foreground text-lg sm:text-lg text-center ${schoolbell.className}`}
          >
            Binangonan, City
          </h2>
        </div>
        <div className="mt-12 flex flex-col md:flex-row gap-x-4 items-center justify-center w-full">
          <Button
            size={"lg"}
            className={`w-full md:w-auto p-6 drop-shadow-lg cursor-pointer transition-colors duration-300 ${schoolbell.className}`}
          >
            <Link
              href={`/rsvp${!isReal ? "/1" : "/0"}`}
              className="flex gap-x-4 items-center text-xl"
            >
              <Users className="h-7 w-7 animate-jittery-2" /> RSVP
            </Link>
          </Button>
          <Button
            asChild
            className="w-full md:w-auto flex-1 p-6 text-xl cursor-pointer transition-colors duration-300"
            variant={"ghost"}
            size={"lg"}
          >
            <Link
              href="https://maps.app.goo.gl/9rYB34Lua1pgaDAS9"
              target="_blank"
              className={`flex items-center ${schoolbell.className}`}
            >
              <Navigation className="animate-jittery-3" /> Get Directions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
