import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  UserProfile,
  useSession,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="container mx-auto justify-between flex items-center">
        <Link href="/" className="flex gap-2 items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          File Drive
        </Link>
        {/* <SignedIn>
        <Button variant={"outline"}>
            <Link href="/dashboard/files">Your Files</Link>
          </Button>
        </SignedIn> */}
        <Button variant={"outline"}>
          <Link href="/dashboard/files">Your Files</Link>
        </Button>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
