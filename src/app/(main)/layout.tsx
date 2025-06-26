// app/(main)/layout.tsx
import Sidebar from "@/app/my_components/SideBar";

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <main className="flex-1 overflow-y-auto md:pl-64 pt-16 md:pt-6">
                <div className="p-0">{children}</div>
            </main>
        </div>
    );
}
