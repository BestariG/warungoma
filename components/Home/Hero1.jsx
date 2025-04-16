import Image from "next/image";
import Link from "next/link";

const Hero1 = () => {
  return (
    <section className="relative text-white min-h-[80vh] flex flex-col md:flex-row items-center px-4 md:px-12 py-10 md:py-0">
      {/* Container teks */}
      <div className="w-full md:w-1/2 relative z-10 mb-8 md:mb-0">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-serif font-bold leading-none">
          Rumah <br /> Makan Oma
        </h1>
        <p className="text-lg italic text-gray-300">
          "Hidangan Rumah, Rasa Nostalgia"
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 mt-4 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-lg transition-all duration-300 hover:bg-yellow-500 hover:text-[#660F24]"
        >
          Menu Kami
        </Link>
      </div>

      {/* Gambar makanan dengan overlay teks */}
      <div className="w-full md:w-1/2 relative h-64 sm:h-80 md:h-full">
        <Image
          src="/images/nasiuduk.png"
          alt="Makanan Enak"
          width={600}
          height={400}
          className="rounded-lg shadow-lg object-cover w-full h-full"
        />

        {/* Overlay latar belakang teks */}
        <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-[#660F24] opacity-50"></div>
      </div>

      {/* Hiasan di pojok kanan atas */}
      <div className="absolute top-4 right-6 text-white text-3xl">
        ✽
      </div>
    </section>
  );
};

export default Hero1;