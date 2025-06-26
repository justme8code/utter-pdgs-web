// app/my_components/tree-tabs/ProductionTab.tsx
import {TreeNav} from "./TreeNav";
import {TreeViewTabProps} from "./OverViewTab"; // Assuming this interface is correctly defined here
// import { useRouter } from "next/navigation"; // No longer needed if using href
import {Combine, Factory, ListOrdered} from "lucide-react"; // Icons for production

export const ProductionTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter(); // Not needed if using href
    return (
        <TreeNav
            title="Production"
            icon={Factory}
            pathSegment="productions" // Matches the first segment of child hrefs
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "productions"}
        >
            {/* <TreeNav
                title="New production"
                icon={PlusCircle} // Example icon
                href="/productions/new"
                pathSegment="new"
                activePath={activePath}
            /> */}
            <TreeNav
                title="All Productions"
                icon={ListOrdered}
                href="/productions"
                pathSegment="list" // or just "productions" if it's the main view
                activePath={activePath}
            />
            <TreeNav
                title="Production Mixes"
                icon={Combine}
                href="/productions/mixes"
                pathSegment="mixes"
                activePath={activePath}
            />
        </TreeNav>
    );
};