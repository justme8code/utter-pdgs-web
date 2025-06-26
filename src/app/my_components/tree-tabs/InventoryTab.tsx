// app/my_components/tree-tabs/InventoryTab.tsx
import {TreeNav} from "./TreeNav";
import {TreeViewTabProps} from "./OverViewTab"; // Assuming this is the correct path for the interface
// import { useRouter } from "next/navigation";
import {Archive, Boxes, FlaskConical as IngredientIcon, Scale} from "lucide-react"; // Icons for inventory

export const InventoryTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter();
    return (
        <TreeNav
            title="Inventory"
            icon={Archive}
            pathSegment="inventory" // Changed from "Inventory" to lowercase for consistency
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "inventory"}
        >
            <TreeNav
                title="Ingredients"
                icon={IngredientIcon}
                href="/inventory/ingredients"
                pathSegment="ingredients"
                activePath={activePath}
            />
            <TreeNav
                title="Raw Materials"
                icon={Boxes}
                href="/inventory/raw-materials"
                pathSegment="raw-materials"
                activePath={activePath}
            />

            <TreeNav
                title="Uoms"
                icon={Scale}
                href="/inventory/uom"
                pathSegment="raw-materials"
                activePath={activePath}
            />
        </TreeNav>
    );
};