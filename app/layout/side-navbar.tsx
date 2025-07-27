"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useAuth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconSettings,
  IconChartBar,
  IconList,
  IconCalendar,
  IconUsers,
  IconLogout,
  IconBuilding
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useAuth";

interface LinkType {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface ButtonType {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}

type NavItem = LinkType | ButtonType;

interface SideNavbarProps {
  children?: React.ReactNode;
}

export function SideNavbar({ children }: SideNavbarProps) {
  const { data: user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = useCallback(() => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  }, [logout, router]);

  const isAdmin = user?.role === 'admin';

  const links: NavItem[] = useMemo(() => {
    const adminLinks: LinkType[] = [
      {
        label: "Admin Dashboard",
        href: "/admin",
        icon: (
          <IconChartBar className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
        ),
      },
      {
        label: "Etkinlik Yönetimi",
        href: "/admin/events",
        icon: (
          <IconList className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
        ),
      },
      {
        label: "Departman Yönetimi",
        href: "/admin/department-management",
        icon: (
          <IconBuilding className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
        ),
      },
      {
        label: "Kullanıcı Yönetimi",
        href: "/admin/user-management",
        icon: (
          <IconUsers className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
        ),
      },
     
     {
       label: "S.S.S Yönetimi",
       href: "/admin/faq-management",
       icon: (
         <IconList className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
       ),
     },
   ];

    const settingsLinks: NavItem[] = [
      {
        label: "Ayarlar",
        href: "/settings",
        icon: (
          <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Çıkış Yap",
        onClick: handleLogout,
        icon: (
          <IconLogout className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        ),
      },
    ];

    return [...(isAdmin ? adminLinks : []), ...settingsLinks];
  }, [isAdmin, handleLogout]);

  return (
    <div
      className={cn(
        "flex w-full h-screen flex-col overflow-hidden md:flex-row dark:bg-neutral-800",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) =>
                "href" in link ? (
                  <SidebarLink key={idx} link={link} />
                ) : (
                  <button
                    key={idx}
                    onClick={link.onClick}
                    className={cn(
                      "flex items-center justify-start gap-2 group/sidebar py-2 pl-4 cursor-pointer" // pl-4 for alignment
                    )}
                  >
                      {link.icon}
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover/sidebar:translate-x-1 transition-transform duration-150 ease-in-out">
                        {link.label}
                      </span>
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user ? `${user.first_name} ${user.last_name}` : "Kullanıcı",
                href: "/profile",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user ? user.first_name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {/* Render children instead of hardcoded Dashboard */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex w-full h-full min-h-0 flex-1 flex-col bg-white dark:bg-neutral-900 overflow-y-auto box-border">
          {children}
        </div>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="/admin"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-purple-500 to-pink-500" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        ESOES Admin
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="/admin"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-purple-500 to-pink-500" />
    </a>
  );
};


