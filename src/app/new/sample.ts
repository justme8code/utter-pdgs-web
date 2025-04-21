import {SampleProduction} from "@/app/new/play-with-data";

const sampleData: SampleProduction =  {
    "id": 1,
    "productionBatches": [],
    "purchaseEntries": [
        {
            "id": 2,
            "rawMaterial": {
                "id": 1,
                "name": "Pineapple",
                "uom": "bags"
            },
            "supplier": {
                "id": 1
            },
            "uom": "uom_ldcss",
            "qty": 1.0,
            "weight": 1.0,
            "productionLost": 1.0,
            "usable": 1.0,
            "cost": 1.0,
            "avgCost": 1.0,
            "avgWeightPerUOM": 1.0
        }
    ],
    "materialToIngredients": [
        {
            "id": 2,
            "rawMaterial": {
                "id": 1,
                "name": "Pineapple",
                "uom": "bags"
            },
            "totalUsable": 1.0,
            "productionLost": 1.0,
            "batch": 1,
            "litresPerKg": 1.0,
            "costPerLitre": 1.0,
            "ingredients": [
                {
                    "id": 1,
                    "name": "Pineapple Juice"
                }
            ]
        }
    ]
};
export default sampleData;