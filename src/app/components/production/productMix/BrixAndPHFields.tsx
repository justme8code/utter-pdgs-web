
// BrixAndPHFields.tsx
export const BrixAndPHFields = ({
                                    brix,
                                    pH,
                                    onChange,
                                }: {
    brix: string;
    pH: string;
    onChange: (field: "brix" | "pH", value: string) => void;
}) => (
    <div className="flex gap-4">
        <input
            type="text"
            value={brix}
            placeholder="Brix"
            onChange={(e) => onChange("brix", e.target.value)}
            className="w-24 border px-2 py-1"
        />
        <input
            type="text"
            value={pH}
            placeholder="pH"
            onChange={(e) => onChange("pH", e.target.value)}
            className="w-24 border px-2 py-1"
        />
    </div>
);