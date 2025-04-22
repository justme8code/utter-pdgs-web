
import {TreeNav} from "@/app/components/tree-tabs/TreeNav";

export interface TreeViewTabProps {
    activePath: string;
    onActiveChange: (path: string) => void;
}

export const OverViewTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    return (

        <TreeNav title="Overview" path="overview" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Data Insights" path="root/data">
            </TreeNav>
            <TreeNav title="My Dashboard" path="root/backend">
            </TreeNav>
        </TreeNav>

    );
};