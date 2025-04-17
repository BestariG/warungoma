"use client";
import Image from "next/image";

const Hero4 = () => {
  return (
    <section
      id="contact"
      className="relative flex flex-col md:flex-row justify-center items-center mx-auto max-w-[90%] h-auto md:h-[80vh] py-10 md:py-0"
    >
      {/* Left Info Section */}
      <div className="w-full md:w-[30%] h-auto md:h-[75%] bg-[#E9C25D] p-6 md:p-8 flex flex-col justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none relative">
        <h2 className="text-xl md:text-[24px] font-bold text-[#460012] leading-snug">Buka Saat</h2>
        <p className="text-[#460012] text-sm mt-2">Buka Setiap Hari</p>
        <p className="text-[#460012] text-sm">10:00 pagi hingga 16:00 PM</p>

        <h2 className="text-xl md:text-[24px] font-bold text-[#460012] mt-6">Location</h2>
        <p className="text-[#460012] text-sm mt-2">
          Jalan Seloarum, <br />
          Hunian Taman Hijau no 1, <br />
          Sokaraja, Karangrau
        </p>

        <h2 className="text-xl md:text-[24px] font-bold text-[#460012] mt-6">Contact us</h2>
        <p className="text-[#460012] text-sm mt-2">+62 821-3513-1014</p>
      </div>

      {/* Right Map Section */}
      <div className="w-full md:w-[70%] h-[300px] md:h-[75%] relative">
        <Image
          src="/images/map.png"
          alt="Lokasi Map"
          layout="fill"
          objectFit="cover"
          className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none absolute top-0 left-0 w-full h-full clip-custom opacity-90"
        />
      </div>

      {/* Clip Path Only on md+ */}
      <style jsx>{`
        @media (min-width: 768px) {
          .clip-custom {
            clip-path: polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero4;
