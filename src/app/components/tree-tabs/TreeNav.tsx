import { ReactNode, useState, isValidElement, cloneElement } from "react";
import {FaChevronDown} from "react-icons/fa6";
import {FaChevronRight} from "react-icons/fa6";

interface TreeNavProps {
    title: string;
    onToggle?: () => void;
    children?: ReactNode;
    depth?: number;
    path: string;
    activePath?: string;
    onActiveChange?: (path: string) => void;
}

export const TreeNav = ({
                            title,
                            onToggle = () => {},
                            children,
                            depth = 0,
                            path,
                            activePath,
                            onActiveChange = () => {},
                        }: TreeNavProps) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = !!children;
    const isActive = activePath === path;

    const toggle = () => {
        setExpanded(!expanded);
        onToggle();
        onActiveChange(path);
    };

    const renderChildren = () => {
        if (!children || !expanded) return null;

        return (
            <div className="flex flex-col ml-3 text-sm font-medium ">
                {Array.isArray(children)
                    ? children.map((child, index) =>
                        isValidElement<TreeNavProps>(child)
                            ? cloneElement(child, {
                                key: child.key ?? index,
                                depth: (depth ?? 0) + 1,
                                activePath,
                                onActiveChange,
                            })
                            : child
                    )
                    : isValidElement<TreeNavProps>(children)
                        ? cloneElement(children, {
                            depth: (depth ?? 0) + 1,
                            activePath,
                            onActiveChange,
                        })
                        : children}
            </div>
        );
    };

    return (
        <div className="flex flex-col font-medium">
            <button
                onClick={toggle}
                className={`flex items-center space-x-1 p-1 mb-4 rounded-sm w-full text-left truncate ${
                    isActive ? "bg-blue-200 text-blue-900 font-semibold" : ""
                }`}
                style={{ paddingLeft: `${depth * 8}px` }}
            >
                {hasChildren ? (
                    <span>{expanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}</span>
                ) : (
                    <span className="text-gray-400  inline-block"></span>
                )}
                <span>{title}</span>
            </button>
            {renderChildren()}
        </div>
    );
};
