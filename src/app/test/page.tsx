"use client";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";



const Test = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("https://3000-idx-suburbia-1740016329860.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/success?orderId=cm8b4gvxe0000jtvogli0f86u");
  };
  return (
    <button
    onClick={handleClick}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Go to Success Page
  </button>
  );
};

export default Test;
