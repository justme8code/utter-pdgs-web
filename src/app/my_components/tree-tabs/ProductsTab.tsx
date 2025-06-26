// app/my_components/tree-tabs/ProductTab.tsx
import {TreeViewTabProps} from "./OverViewTab";
// import { useRouter } from "next/navigation";
import {TreeNav} from "./TreeNav";
import {List, Package} from "lucide-react"; // Icons for products

export const ProductTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter();
    return (
        <TreeNav
            title="Product Templates" // Changed title to be more descriptive
            icon={Package}
            pathSegment="products"
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "products"}
        >
            <TreeNav
                title="View Products"
                icon={List}
                href="/products"
                pathSegment="view" // or just "products"
                activePath={activePath}
            />
        </TreeNav>
    );
};