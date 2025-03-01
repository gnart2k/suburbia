"use client";

import { Carousel } from "@trendyol-js/react-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
  }, [index]);

  return (
    <div className="">
      <div className="h-[500px] relative">
        {index > 0 && (
          <ChevronLeft
            className="absolute top-[45%] h-12 w-12 text-white z-50 cursor-pointer"
            onClick={() => setIndex(prev => prev - 1)}
          />
        )}
        <Image
          src={items[index].image?.url}
          alt=""
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
        {index < items.length - 1 && (
          <ChevronRight
            className="absolute top-[45%] right-0 h-12 w-12 text-white z-50 cursor-pointer"
            onClick={() => setIndex(prev => prev + 1)}
          />
        )}
      </div>
      <Carousel
        className="flex justify-between gap-4 mt-8"
        show={4}
        slide={1}
        transition={0.5}
        useArrowKeys
        leftArrow={<ChevronLeft className="mt-8 cursor-pointer" />}
        rightArrow={<ChevronRight className="mt-8 cursor-pointer" />}
      >
        {items.map((item: any, i: number) => (
          <div key={item._id} className="mr-2">
            <Image
              onClick={() => {
                setIndex((prevIndex) => {
                  return i;
                });
              }}
              src={item.image?.url}
              alt=""
              height={120}
              width={120}
              className="object-contain rounded-md cursor-pointer"
            />
          </div>
        ))}
      </Carousel>

    </div>
  );
};

export default ProductImages;

