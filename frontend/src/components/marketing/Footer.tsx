import Link from "next/link";
import { Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              TransitOps
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4" aria-label="Footer">
            <Link href="#" className="text-sm leading-6 text-slate-400 hover:text-amber-400 transition-colors">
              Features
            </Link>
            <Link href="#" className="text-sm leading-6 text-slate-400 hover:text-amber-400 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm leading-6 text-slate-400 hover:text-amber-400 transition-colors">
              About
            </Link>
            <Link href="#" className="text-sm leading-6 text-slate-400 hover:text-amber-400 transition-colors">
              GitHub
            </Link>
            <Link href="#" className="text-sm leading-6 text-slate-400 hover:text-amber-400 transition-colors">
              Hackathon
            </Link>
            <Link href="#" className="text-sm leading-6 text-slate-400 hover:text-amber-400 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-slate-500">
          &copy; {new Date().getFullYear()} TransitOps Inc. All rights reserved. Created for Odoo Hackathon.
        </p>
      </div>
    </footer>
  );
}
