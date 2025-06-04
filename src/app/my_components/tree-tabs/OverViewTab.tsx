import {TreeNav} from "@/app/my_components/tree-tabs/TreeNav";
import {useRouter} from "next/navigation";

export interface TreeViewTabProps {
    activePath: string;
    onActiveChange: (path: string) => void;
}

export const OverViewTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Overview" path="overview" activePath={activePath} onActiveChange={onActiveChange}>

            <TreeNav title="Dashboard" path="/" onToggle={() => router.push("/")} />

        </TreeNav>

    );
};