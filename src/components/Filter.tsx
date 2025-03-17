"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type categoryProps = {
  name: string;
  slug: string;
}

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const wixClient = useWixClient();
  const [catList, setCatList] = useState<categoryProps[]>([])

  useEffect(()=>{
    const fetchCats = async () => {
      const cats = await wixClient.collections
        .queryCollections()
        .limit(20)
        .find();

      const mappedCats = cats.items.map((cat) => ({
        name: cat.name,
        slug: cat.slug, // Assuming name can be used for slug, replace spaces with hyphens
      }));
      //@ts-ignore
      setCatList(mappedCats);
      console.log(cats)
    }
    fetchCats()
  },[])

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        <select
          name="type"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
        >
          <option>Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={handleFilterChange}
        />
        {/* TODO: Filter Categories */}
        <select
          name="cat"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
        >
          <option>Category</option>
          {catList.map((e, i) => (
            <option key={i} value={e.slug}>{e.name}</option>
          ))}
        </select>
        <select
          name=""
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
        >
          <option>All Filters</option>
        </select>
      </div>
      <div className="">
        <select
          name="sort"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400"
          onChange={handleFilterChange}
        >
          <option>Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
          <option value="asc lastUpdated">Newest</option>
          <option value="desc lastUpdated">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
