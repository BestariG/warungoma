"use client";
import Image from "next/image";

const Hero3 = () => {
  return (
    <section  className="relative text-white h-[80vh] flex justify-center items-center mx-auto max-w-[90%]">
      {/* Bagian kiri dengan background kuning */}
      <div className="w-[45%] h-[80%] bg-[#CC9D2F] p-16 flex flex-col justify-center relative rounded-l-lg">
        {/* Hiasan ikon di kiri */}
        <div className="absolute left-[-20px] top-1/3 transform -translate-y-1/2 text-[#660F24] text-3xl">
          ❖
        </div>

        <h1 className="text-[48px] font-serif font-bold text-[#660F24] leading-snug">
          “Nasi Kuning, <br /> Cita Rasa Tradisi yang <br /> Selalu Dinanti!”
        </h1>

        <p className="mt-[80px] text-gray-700 font-semibold text-lg">
          Warung Makan Oma <br />
          <span className="text-sm text-gray-700">Purwokerto</span>
        </p>
        <hr className="w-[80%] mt-10 border-t-2 border-gray-700"/>
      </div>

      {/* Bagian kanan dengan gambar lebih seamless */}
      <div className="w-[55%] h-[80%] relative">
        <Image
          src="/images/nasikuning.png" // Ganti dengan path gambarmu
          alt="Nasi Kuning"
          layout="fill"
          objectFit="cover"
          className="rounded-r-lg absolute top-0 left-[-5%] w-[110%] h-full clip-custom"
        />
      </div>

      {/* Tambahkan style khusus untuk efek potongan */}
      <style jsx>{`
        .clip-custom {
          clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </section>
  );
};

export default Hero3;
