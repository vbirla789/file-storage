import {
  OrganizationSwitcher,
  SignedIn,
  SignInButton,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";

export function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container mx-auto justify-between flex items-center">
        <div>FileDrive</div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
