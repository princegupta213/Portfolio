import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CheckoutFrictionApp } from "@/components/CheckoutFrictionApp";

export default function CheckoutFrictionPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
        </div>
      </header>
      <CheckoutFrictionApp />
      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        CheckoutFriction · Checkout Drop-off Diagnoser · Prince Kumar
      </footer>
    </div>
  );
}
