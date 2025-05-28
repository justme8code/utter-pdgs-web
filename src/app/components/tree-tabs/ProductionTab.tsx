// Created by:  <Thompson Oretan>
import {TreeNav} from "@/app/components/tree-tabs/TreeNav";
import {TreeViewTabProps} from "@/app/components/tree-tabs/OverViewTab";
import {useRouter} from "next/navigation";

export const ProductionTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

            <TreeNav title="Production" path="production" activePath={activePath} onActiveChange={onActiveChange}>
              {/*  <TreeNav title="New production" path="/productions/new"  onToggle={() => {
                    router.push("/productions/new");
                }}/>*/}
                <TreeNav title="Productions" path="/productions"  onToggle={() => {
                    router.push("/productions");
                }}/>
                <TreeNav title="Production mixes" path="/productions/mixes" onToggle={() => {
                    router.push("/productions/mixes");
                }}/>
            </TreeNav>

    );
};