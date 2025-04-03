'use client';
import {TextField} from "@/app/components/TextField";

export const ProductMix = () => {
    return (
        <div className={"p-6 space-y-5"}>
            <h1 className={"text-xl font-medium"}> Production Mix</h1>


            <div className={"bg-gray-100 w-full flex p-5 gap-2 rounded-xs "}>
                <div className={"space-y-5 font-medium"}>
                    <h1>Product</h1>
                    <TextField placeholder={"Product name"}
                               className={"max-w-40"}
                               onChange={value => console.log(value)}
                    />
                </div>

                <div  className={"space-y-5 font-medium"}>
                    <h1>Ingredient</h1>
                    <div className={"space-y-2"}>
                        <TextField placeholder={"Auto"}
                                   className={"max-w-40 text-center"}
                                   onChange={value => console.log(value)}
                        />

                        <TextField placeholder={"Auto"}
                                   className={"max-w-40 text-center"}
                                   onChange={value => console.log(value)}
                        />

                        <TextField placeholder={"Auto"}
                                   className={"max-w-40 text-center"}
                                   onChange={value => console.log(value)}
                        />
                    </div>
                </div>

                <div  className={"space-y-5 font-medium"}>
                    <h1>Litres Used</h1>
                    <div className={"space-y-2"}>
                        <TextField placeholder={"litres used"}
                                   className={"max-w-40 text-center"}
                                   onChange={value => console.log(value)}
                        />
                        <TextField placeholder={"litres used"}
                                   className={"max-w-40 text-center"}
                                   onChange={value => console.log(value)}
                        />
                        <TextField placeholder={"litres used"}
                                   className={"max-w-40 text-center"}
                                   onChange={value => console.log(value)}
                        />
                    </div>
                </div>
                <div className={"space-y-5 font-medium"}>
                    <h1>Litres Used</h1>
                    <TextField placeholder={"litres used"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />

                </div>
                <div className={"space-y-5 font-medium"}>
                    <h1>Production Output</h1>
                    <TextField placeholder={"Production output count"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />
                </div>

                <div className={"space-y-5 font-medium"}>
                    <h1>Brix no Diluent</h1>

                    <TextField placeholder={"Brix no Diluent"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />
                </div>

                <div className={"space-y-5 font-medium"}>
                    <h1>Initial Brix</h1>
                    <TextField placeholder={"Initial Brix"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />
                </div>
                <div className={"space-y-5 font-medium"}>
                    <h1>Final Brix</h1>
                    <TextField placeholder={"Final Brix"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />
                </div>

                <div className={"space-y-5 font-medium"}>
                    <h1>Initial ph</h1>
                    <TextField placeholder={"Initial PH"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />
                </div>

                <div className={"space-y-5 font-medium"}>
                    <h1>Final PH</h1>
                    <TextField placeholder={"Final PH"}
                               className={"max-w-40 text-center"}
                               onChange={value => console.log(value)}
                    />
                </div>
            </div>

        </div>
    );
};