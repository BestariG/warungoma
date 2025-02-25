import Image from "next/image";
import Link from "next/link";

const Hero2 = () => {
  return (
    <section className="relative bg-[#660F24] text-white h-[80vh] flex items-center px-12">
      {/* Gambar utama di kiri */}
      <div className="w-1/2">
        <Image
          src="/images/nasirames.png" // Ganti dengan path gambarmu
          alt="Nasi Rames"
          width={600}
          height={400}
          className="rounded-lg shadow-lg object-cover w-full"
        />
      </div>

      {/* Container teks di kanan */}
      <div className="w-1/2 pl-12">
        <h1 className="text-[80px] font-serif font-bold leading-tight">
          Hidangan paling <br /> di minati
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
        <div className="flex gap-4 mt-20 ml-28">
          <Image
            src="/images/nasikuning.png" // Ganti dengan path gambarmu
            alt="Nasi Kuning"
            width={157}
            height={157}
            className="rounded-lg shadow-md object-cover"
          />
          <Image
            src="/images/nasiayam.png" // Ganti dengan path gambarmu
            alt="Nasi Putih"
            width={157}
            height={157}
            className="rounded-lg shadow-md object-cover"
          />
          <Image
            src="/images/nasigoreng.png" // Ganti dengan path gambarmu
            alt="Nasi Goreng"
            width={157}
            height={157}
            className="rounded-lg shadow-md object-cover"
          />
        </div>
        {/* Garis kuning dibawah gambang*/}
        <div className="w-[50%] h-1 bg-yellow-500 mt-4 ml-36"></div>
      </div>

      {/* Hiasan di pojok kanan bawah */}
      <div className="absolute bottom-12 right-8 text-yellow-500 text-3xl">
        ◇
      </div>
    </section>
  );
};

export default Hero2;
