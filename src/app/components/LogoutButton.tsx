import useAuthStore from "@/app/store/useAuthStore";
import {handleLogout} from "@/app/actions/login";

export const LogoutButton = () => {
    const {clearAuth} = useAuthStore();

    const logout = async () => {
        await handleLogout();
        clearAuth();
    }
    return (
        <>
            <button className={"w-full hover:bg-gray-500 text-left p-2 rounded-sm"} onClick={() => {
                logout();
            }}>
                Logout
            </button>
        </>
    );
};