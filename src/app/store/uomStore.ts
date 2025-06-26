import {create} from "zustand";
import {createUOM, deleteUOM, fetchUOMS, updateUOM} from "@/api/uomActions";
import {Unitofmeasurement} from "@/app/types";
import {withLoadingAndErrorHandling} from "@/app/utils/zustandHelpers";

interface UOMState {
    uoms: Unitofmeasurement[];
    isLoading: boolean;
    error: string | null;
}

type UOMResponse<T> = Promise<{
    data: T | null;
    status: boolean;
    error: string | null;
}>;

interface UOMActions {
    setUoms(uoms: Unitofmeasurement[]): void;

    fetchUoms(): UOMResponse<Unitofmeasurement[]>;

    createUom(uom: Unitofmeasurement): UOMResponse<Unitofmeasurement>;

    updateUom(uomId: number, uom: Unitofmeasurement): UOMResponse<Unitofmeasurement>;

    deleteUom(id: number): UOMResponse<number>;

    clearError(): void;
}

type UOMStore = UOMState & UOMActions;

export const useUomStore = create<UOMStore>((set) => ({
    uoms: [],
    isLoading: false,
    error: null,

    setUoms(uoms) {
        set({uoms, isLoading: false, error: null});
    },

    fetchUoms: async () =>
        withLoadingAndErrorHandling<UOMStore, Unitofmeasurement[]>(
            async () => {
                const {data, status, error} = await fetchUOMS();
                if (!status || !data) throw new Error(error?.message || "Failed to fetch UOMs.");
                return data;
            },
            set,
            (data) => set({uoms: data})
        ),

    createUom: async (uom) =>
        withLoadingAndErrorHandling<UOMStore, Unitofmeasurement>(
            async () => {
                const {data, status, error} = await createUOM(uom);
                if (!status || !data) throw new Error(error?.message || "Failed to create UOM.");
                return data;
            },
            set,
            (newUom) => set((state) => ({uoms: [...state.uoms, newUom]}))
        ),

    updateUom: async (uomId, uom) =>
        withLoadingAndErrorHandling<UOMStore, Unitofmeasurement>(
            async () => {
                const {data, status, error} = await updateUOM({...uom, id: uomId});
                if (!status || !data) throw new Error(error?.message || "Failed to update UOM.");
                return data;
            },
            set,
            (updatedUom) =>
                set((state) => ({
                    uoms: state.uoms.map((item) => (item.id === updatedUom.id ? updatedUom : item)),
                }))
        ),

    deleteUom: async (id) =>
        withLoadingAndErrorHandling<UOMStore, number>(
            async () => {
                const {status, error} = await deleteUOM(id);
                if (!status) throw new Error(error?.message || "Failed to delete UOM.");
                return id;
            },
            set,
            (deletedId) =>
                set((state) => ({
                    uoms: state.uoms.filter((item) => item.id !== deletedId),
                }))
        ),
    clearError() {
        set((state) => ({...state, error: null}));
    },

}));
