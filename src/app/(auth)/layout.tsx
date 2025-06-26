// app/(auth)/layout.tsx
export default function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <main className=" flex justify-center h-screen items-center w-full">
            {children}
        </main>
    );
}