import Image from "next/image";
import Link from "next/link";

const Hero2 = () => {
  return (
    <section className="relative bg-[#660F24] text-white min-h-[80vh] flex flex-col md:flex-row items-center px-4 md:px-12 py-10 md:py-0">
      {/* Gambar utama di kiri */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <Image
          src="/images/nasirames.png"
          alt="Nasi Rames"
          width={600}
          height={400}
          className="rounded-lg shadow-lg object-cover w-full"
        />
      </div>

      {/* Container teks di kanan */}
      <div className="w-full md:w-1/2 md:pl-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-serif font-bold leading-tight">
          Hidangan paling <br className="hidden sm:block" /> di minati
        </h1>
        <p className="text-lg text-gray-300">Nasi Rames</p>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 mt-4 bg-yellow-500 text-[#660F24] font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-600 relative"
        >
          Menu Kami
          <span className="absolute left-[-5px] bottom-[-5px] w-full h-full border-2 border-yellow-700 rounded-lg"></span>
        </Link>

        {/* Gambar kecil di bawah teks */}
        <div className="flex flex-wrap gap-4 mt-10 md:mt-20 justify-center md:justify-start md:ml-28">
          <Image
            src="/images/nasikuning.png"
            alt="Nasi Kuning"
            width={157}
            height={157}
            className="rounded-lg shadow-md object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
          />
          <Image
            src="/images/nasiayam.png"
            alt="Nasi Putih"
            width={157}
            height={157}
            className="rounded-lg shadow-md object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
          />
          <Image
            src="/images/nasigoreng.png"
            alt="Nasi Goreng"
            width={157}
            height={157}
            className="rounded-lg shadow-md object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
          />
        </div>
        {/* Garis kuning dibawah gambang*/}
        <div className="w-3/4 md:w-1/2 h-1 bg-yellow-500 mt-4 mx-auto md:mx-0 md:ml-36"></div>
      </div>

      {/* Hiasan di pojok kanan bawah */}
      <div className="absolute bottom-4 md:bottom-12 right-4 md:right-8 text-yellow-500 text-3xl">
        ◇
      </div>
    </section>
  );
};

export default Hero2;