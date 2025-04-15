import {useState} from "react";
import {TreeNav} from "@/app/components/tree-tabs/TreeNav";
import {useRouter} from "next/navigation";

export interface TreeViewTabProps {
    activePath: string;
    onActiveChange: (path: string) => void;
}

export const InventoryTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Inventory" path="Inventory" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Ingredients" path="/inventory/ingredients" onToggle={() => {
                router.push("/inventory/ingredients");
            }}>
            </TreeNav>
            <TreeNav title="Raw materials" path="/inventory/raw-materials" onToggle={() => {
                router.push("/inventory/raw-materials");
            }}>
            </TreeNav>
        </TreeNav>

    );
};