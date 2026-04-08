"use client";

import { ArrowUp, Loader2, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "./ModeToggle";
import { ProfileDropdown } from "./ProfileDropdown";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-md border-b"
            : "bg-background border-b"
        }`}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          {/* Left - Logo */}
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">
                SP
              </span>
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:block">
              SmartProperty
            </span>
          </Link>

          {/* Middle - Nav Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right - Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : session?.user ? (
              <ProfileDropdown user={session?.user} />
            ) : (
              <>
                <Button size="sm" className="hidden sm:flex gap-2" asChild>
                  <Link href="/login">
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <SheetTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </div>

              <SheetContent side="right" className="w-64">
                <SheetHeader className="hidden">
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-6 px-4">
                  {/* Mobile Nav */}
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsSheetOpen(false)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col gap-4 mt-4">
                    {isPending ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : session?.user ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <ProfileDropdown user={session?.user} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button size="sm" className="flex gap-2" asChild>
                          <Link href="/login">
                            <User className="w-4 h-4" />
                            Sign In
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
