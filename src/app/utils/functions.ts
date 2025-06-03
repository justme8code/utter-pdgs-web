// src/app/utils/functions.ts

// Corrected imports for date-fns v3
import { format } from "date-fns/format";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { parseISO } from "date-fns/parseISO";

// Your existing functions
export function checkNan(val: number | undefined | string) {
    const qty = Number(val);
    return !isNaN(qty) ? qty.toFixed(2) : '0.00';
}

export const safeParse = (val: string) => val === "" ? "" : parseFloat(val).toFixed(2);

export const beautifyDate = (raw: string) => {
    const iso = parseISO(raw); // This will now use the correctly imported parseISO
    return {
        formatted: format(iso, 'yyyy-MM-dd HH:mm'), // This will now use the correctly imported format
        relative: formatDistanceToNow(iso, { addSuffix: true }), // This will now use the correctly imported formatDistanceToNow
    };
};

/*react-data-table-component*/