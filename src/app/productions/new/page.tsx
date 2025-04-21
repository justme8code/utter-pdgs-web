import Sidebar from "@/app/components/SideBar";
import {CreatedProductionInfo} from "@/app/productions/new/CreatedProductionInfo";
export default  function NewProductionPage() {

    return (
        <div className="flex">
            <Sidebar />
            <CreatedProductionInfo />
        </div>

    );
}
