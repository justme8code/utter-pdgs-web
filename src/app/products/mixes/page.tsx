
import Sidebar from "@/app/components/SideBar";
import {CreateAProductButton} from "@/app/components/production/CreateAProductButton";


export default function ProductsMixes() {


    return (
        <>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 w-full">
                <nav className="bg-white  shadow px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold ">
                        Products
                    </div>
                    <CreateAProductButton/>

                </nav>

                <div className="flex flex-col w-full flex-1 p-4 space-y-6">


                </div>

            </div>
        </>
    );
}