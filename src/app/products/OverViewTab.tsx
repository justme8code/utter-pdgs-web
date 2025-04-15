import {useState} from "react";
import {TreeNav} from "@/app/products/TreeNav";

export interface TreeViewTabProps {
    activePath: string;
    onActiveChange: (path: string) => void;
}

export const OverViewTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    return (

        <TreeNav title="Overview" path="overview" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Ongoing Productions" path="root/frontend">

            </TreeNav>
            <TreeNav title="My Dashboard" path="root/backend">
            </TreeNav>
        </TreeNav>

    );
};