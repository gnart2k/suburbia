"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SliderItem from "./SliderItem";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel } from "@trendyol-js/react-carousel";
const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-pink-50 to-blue-50",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
  },
];


const Sliders = () => {
  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden w-full">
      <Carousel
        className="w-max h-full flex h-[calc(100vh-80px)]"
        show={1}
        slide={1}
        transition={1}
        autoSwipe={10000}
        useArrowKeys
      >
        {slides.map((item: any, i: number) => (
            <SliderItem slide={item}/>
        ))}
      </Carousel>
    </div>
  );
};

export default Sliders;
