'use client';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';


const tasteBudSchema = z.object({
    name: z.string().min(1, 'Name required'),
    batchRange: z.string().min(1, 'Batch range required'),
    manufacturingDate: z.string().min(1, 'Manufacturing date required'),
    expiryDate: z.string().min(1, 'Expiry date required'),
    products: z.array(
        z.object({
            title: z.string(),
            taste: z.number().optional(),
            afterTaste: z.number().optional(),
            viscosity: z.number().optional(),
            comments: z.string().optional(),
            release: z.string().optional(),
        })
    ),
});

// New type definition using z.infer
type TasteBudFormData = z.infer<typeof tasteBudSchema>;

// Updated defaultProducts with explicit initial values for optional fields
const defaultProducts = [
    { title: 'Watermelon and pineapple', taste: undefined, afterTaste: undefined, viscosity: undefined, comments: '', release: '' },
    { title: 'Carrot and pineapple with ginger', taste: undefined, afterTaste: undefined, viscosity: undefined, comments: '', release: '' },
    { title: 'Mango', taste: undefined, afterTaste: undefined, viscosity: undefined, comments: '', release: '' },
    { title: 'Pineapple', taste: undefined, afterTaste: undefined, viscosity: undefined, comments: '', release: '' },
    { title: 'Pineapple and ginger', taste: undefined, afterTaste: undefined, viscosity: undefined, comments: '', release: '' },
    { title: 'Pineapple and Coconut', taste: undefined, afterTaste: undefined, viscosity: undefined, comments: '', release: '' },
];

// Interface for CircleBox props
interface CircleBoxProps {
    value?: number;
    onClick: () => void;
}

export const TasteBudInfo = () => {
    const { control, handleSubmit, register } = useForm<TasteBudFormData>({
        resolver: zodResolver(tasteBudSchema),
        defaultValues: {
            name: '',
            batchRange: '',
            manufacturingDate: '',
            expiryDate: '',
            products: defaultProducts,
        },
    });

    const { fields } = useFieldArray({
        control,
        name: 'products',
    });

    const onSubmit = (data: TasteBudFormData) => {
        console.log(data);
    };

    // Typed CircleBox component
    const CircleBox: React.FC<CircleBoxProps> = ({ value, onClick }) => {
        // Updated colors type annotation to avoid TS7053
        const colors: Record<number, string> = {
            1: 'bg-green-500',
            2: 'bg-red-500',
        };
        return (
            <div
                onClick={onClick}
                className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
            >
                {value ? (
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${colors[value]}`}>
                        {value}
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Section: Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700">Juice Evaluation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input {...register('name')} placeholder="Name" className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input {...register('batchRange')} placeholder="Batch Range" className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input {...register('manufacturingDate')} type="date" className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input {...register('expiryDate')} type="date" className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                </div>

                {/* Section: Instructions */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-600">Instructions</h3>
                    <p className="text-gray-500 text-sm">
                        This evaluation is aimed at testing or checking the quality parameter of the juice samples in other to make amends
                        where necessary using sensory evaluation, it will be done using the 2 point hedonic scale. We employ you to pick the number that meets your perception of juice
                        samples as listed below.
                     </p>
                    <ul className="list-disc pl-5 text-gray-500 text-sm">
                        <li><strong>1:</strong> Acceptable</li>
                        <li><strong>2:</strong> Unacceptable</li>
                    </ul>
                </div>

                {/* Section: Products Table */}
                <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100 rounded-t-lg">
                        <tr>
                            <th className="p-4 text-left text-gray-700 border-b border-gray-300">Product Title</th>
                            <th className="p-4 text-center text-gray-700 border-b border-gray-300">Taste</th>
                            <th className="p-4 text-center text-gray-700 border-b border-gray-300">After Taste</th>
                            <th className="p-4 text-center text-gray-700 border-b border-gray-300">Viscosity</th>
                            <th className="p-4 text-left text-gray-700 border-b border-gray-300">Comments</th>
                            <th className="p-4 text-left text-gray-700 border-b border-gray-300">Release (Yes/No)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 border-b border-gray-200">{field.title}</td>
                                {(['taste', 'afterTaste', 'viscosity'] as const).map((attr) => (
                                    <td key={attr} className="p-4 border-b border-gray-200 text-center">
                                        <Controller
                                            control={control}
                                            name={`products.${index}.${attr}`}
                                            render={({ field: { value, onChange } }) => (
                                                <CircleBox
                                                    value={value as number | undefined}
                                                    onClick={() => {
                                                        const newValue: number | undefined = value === 1 ? 2 : value === 2 ? undefined : 1;
                                                        onChange(newValue);
                                                    }}
                                                />
                                            )}
                                        />
                                    </td>
                                ))}
                                <td className="p-4 border-b border-gray-200">
                                    <input
                                        {...register(`products.${index}.comments`)}
                                        placeholder="Comments"
                                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                </td>
                                <td className="p-4 border-b border-gray-200">
                                    <select
                                        {...register(`products.${index}.release`)}
                                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Section: Submit */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};
