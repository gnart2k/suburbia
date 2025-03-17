"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { ChevronRight, LogInIcon, Pencil } from "lucide-react";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wixClient = useWixClient();

  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  return (
    <>
      <SignedOut >
        <SignInButton>
          <div className="flex items-center relative bg-gray-100 rounded-full hover:shadow-md cursor-pointer px-4 py-2 text-gray-600 font-semibold items-center justify-center">
            <p>Login</p>
            <ChevronRight className="w-4" />
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-4 xl:gap-6 relative">
          <UserButton />
        </div>
      </SignedIn>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModal />}
    </>
  );
};

export default NavIcons;
