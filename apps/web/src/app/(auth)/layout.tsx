import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-6 font-poppins antialiased">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-12">
          <h1 className="text-3xl font-bold text-[#2d4f44] tracking-tighter">OpenCarbon</h1>
        </div>
        {children}
        <Toaster position="bottom-right" richColors />
      </div>
    </div>
  );
}
