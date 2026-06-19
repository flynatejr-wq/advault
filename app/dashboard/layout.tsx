import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile: stack vertically */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MobileNav />
        <main className="flex-1 overflow-y-auto bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  )
}
