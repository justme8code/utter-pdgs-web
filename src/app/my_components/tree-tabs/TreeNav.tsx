// app/my_components/tree-tabs/TreeNav.tsx
import React, {cloneElement, isValidElement, ReactNode, useEffect, useState} from "react";
import {ChevronDown, ChevronRight} from "lucide-react"; // Using Lucide icons
import {cn} from "@/lib/utils"; // Shadcn utility
import Link from 'next/link'; // Import Link
import {usePathname} from "next/navigation"; // To determine active state based on URL

interface TreeNavProps {
    title: string;
    icon?: React.ElementType; // Optional icon component
    href?: string; // URL for direct navigation (for non-parent items)
    children?: ReactNode;
    depth?: number;
    /** The path segment this TreeNav item represents (e.g., "overview", "productions") */
    pathSegment: string; // Renamed from 'path' to 'pathSegment' for clarity
    /** The currently active top-level path segment */
    activePath?: string;
    /** Callback to set the active top-level path segment */
    onActiveChange?: (pathSegment: string) => void;
    /** Initial expanded state */
    initialExpanded?: boolean;
}

export const TreeNav = ({
                            title,
                            icon: Icon,
                            href, // If this item is a direct link
                            children,
                            depth = 0,
                            pathSegment,
                            activePath,
                            onActiveChange = () => {
                            },
                            initialExpanded = false,
                        }: TreeNavProps) => {
    const pathname = usePathname(); // Get current full URL path
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const hasChildren = React.Children.count(children) > 0;

    // An item is "active" if its pathSegment matches the activePath (for top-level items)
    // OR if it's a direct link (href) and the current pathname starts with this href.
    const isActive = href
        ? pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
        : activePath === pathSegment;

    // Automatically expand if a child is active or this item itself is active
    useEffect(() => {
        if (isActive || initialExpanded) {
            setIsExpanded(true);
        }
        // If you want to collapse when another top-level item becomes active:
        // else if (depth === 0 && activePath !== pathSegment) {
        //  setIsExpanded(false);
        // }
    }, [isActive, initialExpanded, depth, activePath, pathSegment]);


    const handleToggle = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
        // If it's a top-level item, set it as active
        if (depth === 0) {
            onActiveChange(pathSegment);
        }
        // If it's a direct link and not a parent, navigation is handled by <Link>
    };

    const itemContent = (
        <span className="flex items-center gap-2.5">
            {Icon &&
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")}/>}
            <span className="truncate flex-grow">{title}</span>
            {hasChildren && (
                isExpanded
                    ? <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground transition-transform"/>
                    : <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground transition-transform"/>
            )}
        </span>
    );

    const buttonClasses = cn(
        "flex items-center w-full text-left px-2.5 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80",
        depth > 0 && "hover:bg-accent/70" // Slightly different hover for nested items
    );

    return (
        <div className="flex flex-col">
            {href && !hasChildren ? ( // If it's a direct link without children
                <Link href={href} className={buttonClasses} style={{paddingLeft: `${8 + depth * 16}px`}}
                      onClick={handleToggle}>
                    {itemContent}
                </Link>
            ) : ( // If it's a collapsible parent or a non-link item
                <button
                    onClick={handleToggle}
                    className={buttonClasses}
                    style={{paddingLeft: `${8 + depth * 16}px`}} // Base padding + indent
                    aria-expanded={isExpanded}
                >
                    {itemContent}
                </button>
            )}

            {hasChildren && isExpanded && (
                <div className="mt-1 flex flex-col space-y-0.5">
                    {React.Children.map(children, (child, index) =>
                        isValidElement<TreeNavProps>(child)
                            ? cloneElement(child, {
                                key: child.key ?? `${pathSegment}-${index}`, // More unique key
                                depth: depth + 1,
                                activePath, // Pass down activePath for child active state determination
                                onActiveChange, // Pass down if children can also change top-level active
                            })
                            : child
                    )}
                </div>
            )}
        </div>
    );
};