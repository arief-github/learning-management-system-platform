"use client";

import { UserButton, SignedIn, SignInButton, SignedOut, SignUpButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
    const pathname = usePathname()
    
    const isTeacherPage = pathname?.startsWith('/teacher')
    const isPlayerPage = pathname?.includes('/chapter')

    return (
         <div className="flex gap-2 ml-auto">
            
            {
                isTeacherPage || isPlayerPage ? (
                 <Link href="/">
                    <Button>
                        <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                    </Button>
                 </Link>
                ) : (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher Mode
                        </Button> 
                    </Link>
                )
            }
            
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
    )
}