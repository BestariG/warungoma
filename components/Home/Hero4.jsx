"use client";
import Image from "next/image";

const Hero4 = () => {
  return (
    <section id="contact" className="relative flex justify-center items-center mx-auto max-w-[80%] h-[80vh]">
      {/* Bagian kiri dengan informasi */}
      <div className="w-[30%] h-[75%] bg-[#E9C25D] p-6 flex flex-col justify-center rounded-l-lg relative">

        <h2 className="text-[24px] font-bold text-[#460012] leading-snug">
          Buka Saat
        </h2>
        <p className="text-[#460012] text-sm mt-2">Buka Setiap Hari</p>
        <p className="text-[#460012] text-sm">10:00 pagi hingga 16:00 PM</p>

        <h2 className="text-[24px] font-bold text-[#460012] mt-6">Location</h2>
        <p className="text-[#460012] text-sm mt-2">
          Jalan Seloarum, <br />
          Hunian Taman Hijau no 1, <br />
          Sokaraja, Karangrau
        </p>

        <h2 className="text-[24px] font-bold text-[#460012] mt-6">Contact us</h2>
        <p className="text-[#460012] text-sm mt-2">+62 821-3513-1014</p>
      </div>

      {/* Bagian kanan dengan map lebih besar */}
      <div className="w-[70%] h-[75%] relative">
        <Image
          src="/images/map.png" // Pastikan path ini benar
          alt="Lokasi Map"
          layout="fill"
          objectFit="cover"
          className="rounded-r-lg absolute top-0 left-[-3%] w-[106%] h-full clip-custom opacity-90"
        />
      </div>

      {/* Efek potongan seperti Hero3 */}
      <style jsx>{`
        .clip-custom {
          clip-path: polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </section>
  );
};

export default Hero4;
