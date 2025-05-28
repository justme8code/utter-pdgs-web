'use client';
import {useRouter} from 'next/navigation';
import {ReactNode, useEffect, useState} from 'react';
import {hasRole} from '../utils/auth';
import useAuthStore from '@/app/store/useAuthStore';
import Loading from "@/app/management/loading";
import Unauthorized from "@/app/components/Unauthorized";

const ProtectedRoute = ({ children, requiredRole }: { children: ReactNode; requiredRole: string }) => {
    const router = useRouter();
    const auth = useAuthStore((state) => state.auth);
    const isAuthenticated = !!auth?.jwtToken;
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            if (auth === null) {
                // Auth state is still being loaded/hydrated
                return;
            }

            setIsCheckingAuth(false); // Authentication check is complete

            if (!isAuthenticated) {
                router.push('/login');
            } else if (requiredRole && !hasRole({ userRoles: auth?.user?.roles?.map((role) => role.userRole), requiredRole })) {
                setIsUnauthorized(true);
                // Optionally, you can still implement a delayed redirect back here if needed
                // setTimeout(() => {
                //     router.back();
                // }, 3000);
            }
        };

        checkAuth();
    }, [auth, isAuthenticated, requiredRole, router]);

    if (isCheckingAuth) {
        return <Loading />; // Show a loading indicator while checking authentication
    }

    if (isUnauthorized) {
        return <Unauthorized />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;