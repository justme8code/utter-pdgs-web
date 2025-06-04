import {TreeViewTabProps} from "@/app/my_components/tree-tabs/OverViewTab";
import {useRouter} from "next/navigation";
import {TreeNav} from "@/app/my_components/tree-tabs/TreeNav";

export const SuppliersTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Suppliers" path="suppliers" activePath={activePath} onActiveChange={onActiveChange}
        onToggle={() => {
            router.push("/suppliers");
        }}>
        </TreeNav>

    );
};