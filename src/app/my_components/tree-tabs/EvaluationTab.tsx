import {TreeViewTabProps} from "./OverViewTab";
import {TreeNav} from "./TreeNav";
import {FileText, Smile} from "lucide-react"; // Icons for sensory evaluation

export const EvaluationTab = ({activePath, onActiveChange}: TreeViewTabProps) => {
    // const router = useRouter();
    return (
        <TreeNav
            title="Sensory Evaluation"
            icon={Smile} // Or FlaskConical for lab/taste
            pathSegment="evaluations" // Changed from "sensory-evaluation" to match href
            activePath={activePath}
            onActiveChange={onActiveChange}
            initialExpanded={activePath === "evaluations"}
        >
            <TreeNav
                title="All Evaluations" // More descriptive
                icon={FileText}
                href="/evaluations" // Corrected path from "/evaluations" if it should be /evaluations
                pathSegment="list" // or "evaluations"
                activePath={activePath}
            />
            {/* If you have other sub-links for sensory evaluation: */}
            {/* <TreeNav title="New Evaluation" href="/evaluations/new" pathSegment="new" icon={PlusCircle} /> */}
        </TreeNav>
    );
};