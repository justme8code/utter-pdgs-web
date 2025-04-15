import {TreeViewTabProps} from "@/app/components/tree-tabs/OverViewTab";
import {useRouter} from "next/navigation";
import {TreeNav} from "@/app/components/tree-tabs/TreeNav";

export const ProductTab = ({activePath,onActiveChange}:TreeViewTabProps) => {
    const router = useRouter();
    return (

        <TreeNav title="Products" path="products" activePath={activePath} onActiveChange={onActiveChange}>
            <TreeNav title="All products" path="/products" activePath={activePath} onActiveChange={onActiveChange}
                     onToggle={() => {
                         router.push("/products");
                     }}/>

            <TreeNav title="Product mixes" path="/products/mixes" onToggle={() => {
                router.push("/products/mixes");
            }}/>
        </TreeNav>

    );
};