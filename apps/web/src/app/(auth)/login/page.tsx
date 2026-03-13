"use client"

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "iconsax-react";

export default function LoginPage() {
  return (
    <div className="rounded-[24px] border-[1.5px] border-zinc-200 bg-white p-12 shadow-none text-center space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-[#2d4f44]">Connexion</h1>
      <p className="text-muted-foreground font-medium uppercase tracking-widest text-[11px]">
        Cette fonctionnalité sera bientôt disponible.
      </p>
      <div className="pt-6">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-2xl h-14 px-8 border-zinc-100 bg-zinc-50/50 text-[11px] font-bold uppercase tracking-widest gap-3 shadow-none hover:bg-zinc-100 transition-all active:scale-95"
          )}
        >
          <ArrowLeft size="18" variant="Bold" color="#000000" />
          Retour à l&apos;inscription
        </Link>
      </div>
    </div>
  );
}
