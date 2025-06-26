// app/my_components/tree-tabs/SuppliersTab.tsx
import {TreeViewTabProps} from "./OverViewTab";
// import { useRouter } from "next/navigation";
import {TreeNav} from "./TreeNav";
import {Truck} from "lucide-react"; // Icon for suppliers

export const SuppliersTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter();
    return (
        <TreeNav
            title="Suppliers"
            icon={Truck}
            href="/suppliers" // This makes it a direct link
            pathSegment="suppliers" // Matches the href segment
            activePath={activePath}
            onActiveChange={onActiveChange} // onActiveChange will still set the top-level active state
        />
        // No children, so it acts as a single navigable item
    );
};