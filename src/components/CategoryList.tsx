import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const wixClient = await wixClientServer();

  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:mx-8 lg:mx-16 xl:mx-32 2xl:mx-64">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="w-full "
            key={item._id}
          >
            <div className="relative bg-slate-100 w-full h-96 ">
              <Image
                src={item.media?.mainMedia?.image?.url || "/category.png"}
                alt=""
                fill
                sizes="20vw"
                className="object-cover rounded-lg"
              />
            </div>
            <h1 className="mt-8 font-bold text-xl tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
