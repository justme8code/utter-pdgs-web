import {TreeViewTabProps} from "@/app/components/tree-tabs/OverViewTab";
import {useRouter} from "next/navigation";
import {TreeNav} from "@/app/components/tree-tabs/TreeNav";

export const UsersTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav  title="Management" path="management" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Users" path="users" activePath={activePath} onActiveChange={onActiveChange}
                     onToggle={() => {
                         router.push("/management/users");
                     }}>
            </TreeNav>
        </TreeNav>
    );
};