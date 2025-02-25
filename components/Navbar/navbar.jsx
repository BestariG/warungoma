import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#660F24] text-white px-20 py-10 flex items-center justify-between">
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={80} height={80} />
      </div>
      <ul className="flex space-x-8 text-lg">
        <li>
          <Link href="/" className="font-bold hover:text-gray-300">Home</Link>
        </li>
        <li>
          <Link href="/menu" className="hover:text-gray-300">Menu</Link>
        </li>
        <li>
          <Link href="/#contact" className="hover:text-gray-300">Contact us</Link>
        </li>
      </ul>
      <div className="flex items-center space-x-6">
        <UserIcon className="w-6 h-6 text-white hover:text-gray-300" />
      </div>
    </nav>
  );
};

export default Navbar;
