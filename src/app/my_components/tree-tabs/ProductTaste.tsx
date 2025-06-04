import {TreeViewTabProps} from "@/app/my_components/tree-tabs/OverViewTab";
import {useRouter} from "next/navigation";
import {TreeNav} from "@/app/my_components/tree-tabs/TreeNav";

export const ProductTaste = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Sensory Evaluation" path="sensory-evaluation" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Evaluations" path="/evaluations" onToggle={() => {
                router.push("/tastebuds");
            }}/>

        </TreeNav>

    );
};