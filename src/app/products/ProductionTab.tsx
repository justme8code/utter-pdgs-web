'use client';
import {TreeNav} from "@/app/products/TreeNav";
import {useState} from "react";
import {TreeViewTabProps} from "@/app/products/OverViewTab";

export const ProductionTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    return (

            <TreeNav title="Productions" path="/productions" activePath={activePath} onActiveChange={onActiveChange}>
                <TreeNav title="New" path="/productions/new" />
                <TreeNav title="Mixes" path="/productions/mixes" />
            </TreeNav>

    );
};