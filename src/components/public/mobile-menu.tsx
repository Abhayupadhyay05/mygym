'use client'

import * as React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { X, Menu } from 'lucide-react'
import Link from 'next/link'
import { NAV_ITEMS, ACCENT_COLOR } from '@/lib/constants'

export function MobileMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
        }
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-[#0A0A0A] p-6">
        <div className="flex flex-col gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="group inline-flex h-12 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF87] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]">
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start h-12 text-left px-4">
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button className="w-full justify-start h-12 text-left px-4" style={{ backgroundColor: ACCENT_COLOR }}>Join Now</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}