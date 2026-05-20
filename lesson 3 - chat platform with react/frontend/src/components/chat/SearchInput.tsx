import { Search } from "lucide-react";

export default function SearchInput({
    query,
    setSearchOpen,
    setQuery
}: {
    query: string;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <div className="flex justify-center items-center place-self-center p-2 px-4 gap-2 rounded-4xl bg-(--border)/30 w-max h-full border-3 border-transparent focus-within:border-(--primary) hover:border-(--primary) transition-colors duration-200" >
            <Search className="bg-transparent text-(--text) in-hover:border-(--primary) in-focus-within:text-(--primary) transition-colors duration-200" />

            <input
                type="text"
                className="rtl outline-none bg-transparent text-(--text) in-hover:outline-(--primary) focus:outline-(--primary)"
                placeholder="جست و جو کاربر"
                value={query}
                onFocusCapture={() => setSearchOpen(true)}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    )
}