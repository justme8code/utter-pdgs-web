import {TreeNav} from "./TreeNav"; // Assuming TreeNav is in the same directory
import {Home, LayoutDashboard} from "lucide-react"; // Example icons

export interface TreeViewTabProps {
    activePath: string;
    onActiveChange: (path: string) => void;
}

export const OverViewTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // For top-level items like "Overview", pathSegment should be unique
    // and match what you'd expect in the URL or your activePath logic.
    return (
        <TreeNav
            title="Overview"
            icon={Home} // Pass an icon
            pathSegment="overview" // A unique key for this top-level section
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "overview" || activePath === "/"} // Expand if it's the active section
        >
            {/* Child items are direct links */}
            <TreeNav
                title="Dashboard"
                icon={LayoutDashboard}
                href="/dashboard" // Direct link
                pathSegment="dashboard" // Unique segment for this item
                activePath={activePath} // Pass activePath for styling
            />
            {/* Add more sub-items if needed */}
            {/* <TreeNav title="Analytics" href="/overview/analytics" pathSegment="analytics" icon={BarChart} /> */}
        </TreeNav>
    );
};