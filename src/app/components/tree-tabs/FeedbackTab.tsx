import {TreeNav} from "@/app/components/tree-tabs/TreeNav";
import {useRouter} from "next/navigation";

export interface TreeViewTabProps {
    activePath: string;
    onActiveChange: (path: string) => void;
}

export const FeedbackTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Feedback" path="feedbacks" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Write A Feedback" path="/feedbacks" onToggle={() => {
                router.push("/feedbacks");
            }}>
            </TreeNav>

        </TreeNav>

    );
};