"use client";
import Image from "next/image";

const Hero3 = () => {
  return (
    <section className="relative text-white h-screen max-h-[80vh] flex flex-col md:flex-row justify-center items-center mx-auto max-w-[90%]">
      {/* Left Section */}
      <div className="w-full md:w-[45%] h-[50%] md:h-[80%] bg-[#CC9D2F] p-8 md:p-16 flex flex-col justify-center relative rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
        {/* Icon Decoration */}
        <div className="absolute left-4 md:left-[-20px] top-8 md:top-1/3 transform -translate-y-1/2 text-[#660F24] text-2xl md:text-3xl">
          ❖
        </div>

        <h1 className="text-2xl md:text-[48px] font-serif font-bold text-[#660F24] leading-snug">
          “Nasi Kuning, <br className="hidden md:block" /> Cita Rasa Tradisi yang <br className="hidden md:block" /> Selalu Dinanti!”
        </h1>

        <p className="mt-10 md:mt-[80px] text-gray-700 font-semibold text-base md:text-lg">
          Warung Makan Oma <br />
          <span className="text-sm text-gray-700">Purwokerto</span>
        </p>
        <hr className="w-full md:w-[80%] mt-6 md:mt-10 border-t-2 border-gray-700" />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[55%] h-[50%] md:h-[80%] relative">
        <Image
          src="/images/nasikuning.png"
          alt="Nasi Kuning"
          layout="fill"
          objectFit="cover"
          className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none absolute top-0 left-0 w-full h-full clip-custom"
        />
      </div>

      {/* Custom Clipping Style (applied only on md and up) */}
      <style jsx>{`
        @media (min-width: 768px) {
          .clip-custom {
            clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero3;
