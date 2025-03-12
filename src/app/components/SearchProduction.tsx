import { TextField } from "@/app/components/TextField";
import { useState } from "react";
import { Production } from "@/app/productions/Navbar";
import { Search } from "lucide-react";

interface SearchProductionProps {
    productions: Production[];
    onSelectProduction: (id: number) => void;
}

export const SearchProduction = ({ productions, onSelectProduction }: SearchProductionProps) => {
    const [searchResults, setSearchResults] = useState<Array<Production>>([]);
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (query: string) => {
        setSearchValue(query);
        if (query.length > 0) {
            const results = productions.filter((production) =>
                production.production.toLowerCase().includes(query.toLowerCase())
            );

            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectProduction = (id: number) => {
        onSelectProduction(id);
        setSearchResults([]);
    };

    return (
        <div className="relative flex gap-2">
            <div className="flex items-center bg-gray-700 p-1 px-4 outline-none border-none rounded-sm">
                <TextField
                    value={searchValue}
                    onChange={(value) => handleSearch(value)}
                    props={{ className: "bg-transparent outline-none border-none rounded-sm", placeholder: "Search Productions" }}
                    label={""}
                />
                <button className="bg-gray-600 p-1 rounded-full cursor-pointer active:scale-125 duration-500">
                    <Search />
                </button>
            </div>

            <select
                className="bg-gray-700 py-2 px-2 rounded-sm outline-none border-none"
                onChange={(e) => handleSelectProduction(Number(e.target.value))}
            >
                <option value="">Filter by</option>
                {productions.map((production) => (
                    <option key={production.id} value={production.id}>
                        {production.production}
                    </option>
                ))}
            </select>
            {searchResults.length > 0 && (
                <ul className="absolute bg-white text-black w-full mt-12 rounded-sm shadow-lg">
                    {searchResults.map((result) => (
                        <li
                            key={result.id}
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectProduction(result.id)}
                        >
                            {result.production}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};