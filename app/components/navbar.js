import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex justify-center">
      <Image src="/logo-senna.svg" height={21.08} width={31} />
    </nav>
  );
}
