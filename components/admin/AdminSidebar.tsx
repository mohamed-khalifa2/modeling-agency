"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { adminNav } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

type SidebarPanelProps = {
  agencyName: string;
  pathname: string;
  onNavigate?: () => void;
};

function SidebarPanel({
  agencyName,
  pathname,
  onNavigate,
}: SidebarPanelProps) {
  return (
    <>
      <div className="border-b border-black/10 px-6 py-5">
        <p className="truncate font-serif text-lg leading-tight">
          {agencyName}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-black/40">
          Admin
        </p>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {adminNav.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={cn(
                    "block px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black",
                    active
                      ? "bg-black/5 font-medium text-black"
                      : "text-black/55 hover:bg-black/5 hover:text-black"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-black/10 p-3">
        <LogoutButton />
      </div>
    </>
  );
}

type AdminSidebarProps = {
  agencyName: string;
};

export function AdminSidebar({ agencyName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-sidebar"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 flex-col items-center justify-center gap-[6px] border border-black/10 bg-white transition-colors hover:bg-black/5 lg:hidden"
      >
        <span
          className={cn(
            "block h-px w-4 bg-black transition-transform duration-200",
            open && "translate-y-[3.5px] rotate-45"
          )}
        />
        <span
          className={cn(
            "block h-px w-4 bg-black transition-transform duration-200",
            open && "-translate-y-[3.5px] -rotate-45"
          )}
        />
      </button>

      {open ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-black/10 bg-white lg:flex">
        <SidebarPanel agencyName={agencyName} pathname={pathname} />
      </aside>

      <aside
        id="admin-sidebar"
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/10 bg-white transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarPanel
          agencyName={agencyName}
          pathname={pathname}
          onNavigate={() => setOpen(false)}
        />
      </aside>
    </>
  );
}
