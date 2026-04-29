import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

interface CreateIconOptions {
    displayName: string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    paths: React.ReactNode;
}

export function createIcon({ displayName, viewBox = "0 0 24 24", paths, fill = "currentColor", stroke = "currentColor" }: CreateIconOptions) {
    const Component = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            fill={fill}
            stroke={stroke}
            className={className}
            {...props}
        >
            {paths}
        </svg >
    ));

    Component.displayName = displayName;

    return Component;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */