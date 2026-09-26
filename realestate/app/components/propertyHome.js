import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, MapPin } from "lucide-react";

const properties = [
  { image: "/images/kenya/karen-villa.png", location: "Karen, Nairobi", title: "Garden Estate Villa", meta: "4 beds · 4 baths", price: "KSh 68M", className: "lg:col-span-2 lg:row-span-2" },
  { image: "/images/kenya/westlands-apartments.png", location: "Westlands, Nairobi", title: "Skyline Residences", meta: "3 beds · 3 baths", price: "KSh 32M", className: "" },
  { image: "/images/kenya/diani-villa.png", location: "Diani, Kwale", title: "Coral Coast Villa", meta: "5 beds · pool", price: "KSh 85M", className: "" },
];

export default function PropertyHome() {
  return (
    <section className="bg-[#f7f4ed] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-[#b4382d]">Featured collection</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#12251d] sm:text-5xl">Remarkable spaces, rooted in Kenya.</h2>
          </div>
          <Link href="/properties" className="group inline-flex items-center gap-2 font-semibold text-[#173d30]">View all properties <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
        </div>

        <div className="mt-12 grid auto-rows-[330px] gap-5 lg:grid-cols-2 lg:auto-rows-[290px]">
          {properties.map((property) => (
            <Link href="/properties" key={property.title} className={`group relative overflow-hidden rounded-[1.75rem] bg-[#173d30] ${property.className}`}>
              <Image src={property.image} alt={`${property.title} in ${property.location}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081c15]/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="flex items-center gap-2 text-sm text-white/70"><MapPin className="h-4 w-4 text-[#e7bd67]" />{property.location}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div><h3 className="text-2xl font-semibold">{property.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-white/70"><BedDouble className="h-4 w-4" />{property.meta}</p></div>
                  <p className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold text-[#12251d]">{property.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
