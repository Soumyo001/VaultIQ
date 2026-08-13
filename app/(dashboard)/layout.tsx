import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from '@/components/app-sidebar'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <div className='flex-1 min-w-0 w-full flex flex-col'>
            <SidebarTrigger/>
            {children}
        </div>
    </SidebarProvider>
  )
}

export default Layout