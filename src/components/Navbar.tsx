"use client";

import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useWixClient } from "@/hooks/useWixClient";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  const wixClient = useWixClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("cat"); // Extract category from query params

  const [cats, setCats] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!wixClient) return;
      try {
        const response = await wixClient.collections.queryCollections().limit(3).find();
        //@ts-ignore
        setCats(response.items);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [wixClient]);

  return (
    <div className="h-20 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <svg width="160" height="100" viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg" style={{backgroundColor:"transparent"}}>
            <rect width="100%" height="100%" fill="none" />
            <text
              x="50%"
              y="50%"
              fontFamily="'Fleur De Leah', cursive"
              fontSize="48"
              fill="#374151"
              textAnchor="middle"
              dominantBaseline="middle">
              Suburbia
            </text>
          </svg>
        </Link>
        <Menu />
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-3 h-full m-auto">
        {/* LEFT */}
        <div className="w-1/3 xl:w-5/12 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <svg width="200" height="100" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="none" />
              <text
                x="50%"
                y="50%"
                fontFamily="'Fleur De Leah', cursive"
                fontSize="48"
                fill="#374151"
                textAnchor="middle"
                dominantBaseline="middle">
                Suburbia
              </text>
            </svg>

          </Link>
          <div className="hidden xl:flex gap-4 text-gray-600 " style={{ minWidth: "700px" }}>
            <Link
              href="/"
              className={cn(
                "hover:text-black",
                pathname === "/" && "text-black font-semibold border-b-2 border-black"
              )}
            >
              Home
            </Link>
            {cats.map((e, i) => (
              <Link
                key={i}
                href={`/list?cat=${e.slug}`}
                className={cn(
                  "hover:text-black",
                  currentCategory === e.slug && "text-black font-semibold border-b-2 border-black"
                )}
              >
                {e.name}
              </Link>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-5/12 md:w-8/12 flex items-center justify-between gap-8">
          <SearchBar />
          <div className="flex items-center gap-6">
            <NavIcons />
          </div>
        </div>
        <div className="w-2/12 w-0">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
