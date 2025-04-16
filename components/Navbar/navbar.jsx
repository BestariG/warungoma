'use client';
import { useState } from "react";
import { UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#660F24] text-white px-6 md:px-20 py-6 md:py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
        </div>

        {/* Hamburger icon for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8 text-lg">
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
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-lg">
          <Link href="/" className="block hover:text-gray-300">Home</Link>
          <Link href="/menu" className="block hover:text-gray-300">Menu</Link>
          <Link href="/#contact" className="block hover:text-gray-300">Contact us</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
