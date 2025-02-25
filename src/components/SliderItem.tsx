import Image from "next/image";
import Link from "next/link";

type SliderItemProps = {
    id: number;
    title: string;
    description: string;
    img: string;
    url: string;
    bg: string;
  };
  

export default function SliderItem({slide}: {slide:SliderItemProps}){
    return(
      <div
      className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
      key={slide.id}
    >
      {/* TEXT CONTAINER */}
      <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
        <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
          {slide.description}
        </h2>
        <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
          {slide.title}
        </h1>
        <Link href={slide.url}>
          <button className="rounded-md bg-black text-white py-3 px-4 ">
            SHOP NOW
          </button>
        </Link>
      </div>
      {/* IMAGE CONTAINER */}
      <div className="h-1/2 xl:w-1/2 xl:h-full relative">
        <Image
          src={slide.img}
          alt=""
          fill
          sizes="100%"
          className="object-cover"
        />
      </div>
    </div>
    )
}