export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#09090b] text-zinc-100">
      {children}
    </div>
  );
}
