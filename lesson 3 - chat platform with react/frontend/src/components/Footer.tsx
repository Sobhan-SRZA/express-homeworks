// Import NavLink for client-side routing.
import { NavLink } from "react-router-dom";

// Footer component, defined as a functional component using TypeScript.
const Footer: React.FC = () => {
    // Array of useful navigation links with translated names and URLs.
    const usefulLinks = [
        { name: "Home Page", url: "/" }, // Home link
    ];

    // Render the footer with logo, links, social media, and copyright notice.
    return (
        <footer className="relative bg-(--sec-bg) backdrop-blur-md text-(--text) py-12 animate-fade-in transition-all">
            {/* Gradient overlay for visual effect */}
            <div className="absolute inset-0 bg-linear-to-t from-(--card-bg)/20 to-transparent z-[-1]"></div>
            <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl ltr`}>
                {/* Grid layout for footer sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Logo or Name Section */}
                    <div className="flex flex-col items-center min-[768px]:items-start">
                        <NavLink
                            to="/" // Link to homepage
                            className="text-2xl min-[768px]:text-[18px] min-[944px]:text-2xl font-bold text-(--primary) hover:text-(--primary-hover) transition-colors"
                            aria-label="Segraph" // Accessible label for screen readers
                        >
                            Segraph
                        </NavLink>
                        <p className="text-(--text)/70 text-sm mt-2 text-center md:text-start transition-colors">
                            {"footer.tagline"} {/* Translated tagline */}
                        </p>
                    </div>

                    {/* Useful Links Section */}
                    <div className="flex flex-col items-center justify-self-center">
                        <h3 className="text-lg font-semibold text-(--primary) mb-4 transition-colors">
                            {"footer.links"} {/* Translated useful links title */}
                        </h3>
                        <ul className="space-y-2 text-center">
                            {usefulLinks.map((link, index) => (
                                <li
                                    key={index}
                                    className="text-(--text)/80 hover:text-(--hover) text-sm transition-all hover:scale-120"
                                > {/* Unique key for each link (consider using link.url for better uniqueness) */}
                                    <NavLink
                                        to={link.url} // Navigation route
                                        aria-label={link.name} // Accessible label for screen readers
                                    >
                                        {link.name} {/* Translated link name */}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright Notice */}
                <div className="mt-8 pt-8 border-t border-(--border) text-center transition-colors">
                    <p className="text-(--text)/70 text-sm transition-colors">
                        &copy; {`2026 Pgraph - Persian Caesar. All rights reserved.`}
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Export the Footer component as the default export.
export default Footer;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */