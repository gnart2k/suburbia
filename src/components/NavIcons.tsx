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
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { ChevronRight, LogInIcon, Pencil } from "lucide-react";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  const wixClient = useWixClient();
  const isLoggedIn = wixClient.auth.loggedIn();

  // TEMPORARY
  // const isLoggedIn = false;

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };


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
            <ChevronRight className="w-4"/>
          </div>
        </SignInButton>
        <SignUpButton>
          <div className="flex items-center relative bg-gray-100 rounded-full hover:shadow-md cursor-pointer px-4 py-2 text-gray-600 font-semibold items-center justify-center">
            <p>Register</p>
            <Pencil className="w-4 ml-2"/>
          </div>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-4 xl:gap-6 relative">
          <UserButton />
          {/* <Image
            src="/profile.png"
            alt=""
            width={22}
            height={22}
            className="cursor-pointer"
            // onClick={login}
            onClick={handleProfile}
          />
          {isProfileOpen && (
            <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
              <Link href="/profile">Profile</Link>
              <div className="mt-2 cursor-pointer" onClick={handleLogout}>
                {isLoading ? "Logging out" : "Logout"}
              </div>
            </div>
          )} */}
          <Image
            src="/notification.png"
            alt=""
            width={22}
            height={22}
            className="cursor-pointer"
          />
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
        </div>
      </SignedIn>
    </>
  );
};

export default NavIcons;
