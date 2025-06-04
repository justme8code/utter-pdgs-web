import useAuthStore from "@/app/store/useAuthStore";
import {handleLogout} from "@/app/actions/login";
import {LogOutIcon} from "lucide-react";

export const LogoutButton = () => {
    const {clearAuth} = useAuthStore();

    const logout = async () => {
        await handleLogout();
        clearAuth();
    }
    return (
        <>
            <button className={"w-full flex items-center gap-3  hover:bg-red-200 text-left p-2 rounded-sm"} onClick={() => {
                logout();
            }}>
               <LogOutIcon size={15}/> Logout
            </button>
        </>
    );
};