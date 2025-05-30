import {format, formatDistanceToNow, parseISO} from "date-fns";

export function checkNan(val: number|undefined|string) {
    const qty = Number(val);
    return !isNaN(qty) ? qty.toFixed(2) : '0.00';
}

export const safeParse = (val: string) => val === "" ? "" : parseFloat(val).toFixed(2);

export const beautifyDate = (raw: string) => {
    const iso = parseISO(raw);
    return {
        formatted: format(iso, 'yyyy-MM-dd HH:mm'),
        relative: formatDistanceToNow(iso, { addSuffix: true }),
    };
};





/*react-data-table-component*/