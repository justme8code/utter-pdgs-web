import React, {ReactNode} from "react";

export const Navbar = ({title, icon, children}: { icon?: ReactNode, title: string, children?: ReactNode }) => {
    return (
        <header
            className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
            <div className={"flex gap-2 items-center"}>
                {icon}
                <h1 className="text-2xl text-card-foregroundtext-2xl font-semibold tracking-tight text-card-foreground">{title}</h1>
            </div>
            {children}
        </header>
    );
};