"use client";
import { usePathname } from "next/navigation";
import { Anchor, Lock } from "lucide-react";
import { Link } from "@nextui-org/react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Applications", href: "/applications" },
  { name: "Saved Jobs", href: "/saved-jobs" },
  { name: "Profile", href: "/profile" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 font-medium">
      {links.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "text-sm transition-colors hover:text-pink-500",
            pathname === item.href
              ? "bg-secondary/80 px-3 py-1.5 rounded-full dark:hover:text-white"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
