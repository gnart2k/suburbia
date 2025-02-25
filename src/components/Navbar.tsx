import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { wixClientServer } from "@/lib/wixClientServer";
// import NavIcons from "./NavIcons";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().limit(3).find();

  return (
    <div className="h-20 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">Suburdia</div>
        </Link>
        <Menu />
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full m-auto">
        {/* LEFT */}
        <div className="w-1/3 xl:w-3/5 flex items-center gap-12 ">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide font-bold">Suburdia</div>
          </Link>
          <div className="hidden xl:flex gap-4 text-gray-600">
            <Link href="/">Home</Link>
            {cats.items.map((e, i) => (
              <Link key={i} href={`/list?cat=${e.slug}`}>{e.name}</Link>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-2/5 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
        <LanguageSwitcher />

      </div>
    </div>
  );
};

export default Navbar;
