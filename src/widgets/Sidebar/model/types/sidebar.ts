import React from "react";


export interface SidebarItemType {
    path?: string;
    text: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    authOnly?: boolean;
    children?: SidebarItemType[];
    defaultExpanded?: boolean;
}
