"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  const wixClient = useWixClient();
  const { counter, getCart } = useCartStore();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      //@ts-ignore
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  return (
    <div className="relative flex items-center gap-4 xl:gap-6">
      <SignedOut>
        <SignInButton>
          <div className="flex items-center bg-gray-100 rounded-full hover:shadow-md cursor-pointer px-4 py-2 text-gray-600 font-semibold">
            <p>Login</p>
            <ChevronRight className="w-4" />
          </div>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <div ref={cartRef} className="relative">
        <div
          className="cursor-pointer"
          onClick={() => setIsCartOpen((prev) => !prev)}
        >
          <Image src="/cart.png" alt="Cart" width={22} height={22} />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {counter}
          </div>
        </div>

        {isCartOpen && (
          <div className="absolute lg:left-0 md:right-0 top-0 w-64 bg-white shadow-lg rounded-lg z-50">
            <CartModal />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavIcons;
