
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, LogOut, User as UserIcon, ShieldCheck, Zap, CreditCard, Server } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-5 w-5 animate-spin" />
            <span>Verifying access...</span>
          </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center gap-2 border-b">
                <div className="p-2 bg-primary rounded-lg">
                    <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-sans text-xl">AuthFlow</span>
            </div>
          <SidebarMenu className="p-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="/dashboard/profile">
                  <UserIcon />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Billing">
                <Link href="/dashboard/billing">
                  <CreditCard />
                  <span>Billing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="VPS Management">
                <Link href="/dashboard/vps">
                  <Server />
                  <span>VPS Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial"></div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar>
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <UserIcon className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/profile">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/billing">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/vps">
                            <Server className="mr-2 h-4 w-4" />
                            <span>VPS Management</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
