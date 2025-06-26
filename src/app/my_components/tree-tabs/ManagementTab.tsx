// app/my_components/tree-tabs/ManagementTab.tsx
import {TreeViewTabProps} from "./OverViewTab";
// import { useRouter } from "next/navigation";
import {TreeNav} from "./TreeNav";
import {Settings, ShieldCheck, Users} from "lucide-react"; // Icons for management

export const ManagementTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter();
    return (
        <TreeNav
            title="Management"
            icon={Settings}
            pathSegment="management"
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "management"}
        >
            <TreeNav
                title="Users"
                icon={Users}
                href="/management/users"
                pathSegment="users"
                activePath={activePath}
            />
            <TreeNav
                title="Permissions"
                icon={ShieldCheck}
                href="/management/permissions"
                pathSegment="permissions"
                activePath={activePath}
            />
        </TreeNav>
    );
};