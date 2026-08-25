"use client";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/app/ui/dashboard/app-sidebar";
import { AppHeader } from "@/app/ui/dashboard/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import NextTopLoader from 'nextjs-toploader';
export default function Layout({ children }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  function DecodeToJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Échec du décodage du token", error);
      return null;
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("Access_Token");
    const now = new Date();
    if (!token) {
      router.replace("/");
    } else {
      const user = DecodeToJwt(token);
      if (now > new Date(user?.exp * 1000)) {
        localStorage.removeItem("Access_Token");
        router.replace("/");
      } else {
        setIsAuthChecked(true);
      }
    }
  }, []);

  if (!isAuthChecked) {
    return;
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 50)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      {/* #8f3d00 */}
      <NextTopLoader color="#8f3d00" showSpinner={false} />
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-/4">{children}</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
