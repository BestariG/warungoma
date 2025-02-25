const page = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#680E1F] text-white">
        <div className="bg-[#680E1F] p-6 rounded-lg text-center">
          <div className="mb-4">
            <img
              src="/images/check.png"
              alt="Sukses"
              className="w-40 h-40 mx-auto" 
            />
          </div>
          <p className="text-[30px] mb-10 font-medium">Pesanan Anda sedang diproses</p>
          <button className="mt-6 px-6 py-2 h-[80px] w-[400px] bg-[#EEC563] text-[#680E1F] font-semibold rounded-lg hover:bg-yellow-400">
            <a href="/">
            Kembali ke halaman utama
            </a>
          </button>
        </div>
      </div>
    );
  };
  
  export default page;