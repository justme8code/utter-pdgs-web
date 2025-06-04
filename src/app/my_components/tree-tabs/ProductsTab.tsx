import {TreeViewTabProps} from "@/app/my_components/tree-tabs/OverViewTab";
import {useRouter} from "next/navigation";
import {TreeNav} from "@/app/my_components/tree-tabs/TreeNav";

export const ProductTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Product" path="product" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="Products" path="/products" activePath={activePath} onActiveChange={onActiveChange}
                     onToggle={() => {
                         router.push("/products");
                     }}/>
        </TreeNav>

    );
};