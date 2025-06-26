// app/my_components/tree-tabs/FeedbackTab.tsx
import {TreeNav} from "./TreeNav";
import {TreeViewTabProps} from "./OverViewTab"; // Assuming this is the correct path for the interface
// import { useRouter } from "next/navigation";
import {Edit3, MessageSquare} from "lucide-react"; // Icons for feedback

export const FeedbackTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter();
    return (
        <TreeNav
            title="Feedback"
            icon={MessageSquare}
            pathSegment="feedbacks"
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "feedbacks"}
        >
            <TreeNav
                title="Submit Feedback" // More descriptive
                icon={Edit3}
                href="/feedbacks"
                pathSegment="submit" // or "feedbacks" if it's the main view
                activePath={activePath}
            />
            {/* If you have a page to view feedbacks: */}
            {/* <TreeNav title="View Feedbacks" href="/feedbacks/view" pathSegment="view" icon={ListChecks} /> */}
        </TreeNav>
    );
};