export const TVET_FIELDS = [
  {
    "id": "seni-rekabentuk",
    "nameBM": "Seni dan Rekabentuk",
    "nameEN": "Art and Design",
    "safeContexts": [
      "scale drawing",
      "pattern dimensions",
      "material layout",
      "design costing",
      "geometric composition"
    ]
  },
  {
    "id": "automotif",
    "nameBM": "Automotif",
    "nameEN": "Automotive",
    "safeContexts": [
      "vehicle service data",
      "component dimensions",
      "wheel/rotation geometry",
      "diagnostic readings",
      "workshop costing"
    ]
  },
  {
    "id": "bioperubatan",
    "nameBM": "Bioperubatan",
    "nameEN": "Biomedical",
    "safeContexts": [
      "equipment calibration",
      "sensor readings",
      "device dimensions",
      "measurement models",
      "maintenance planning"
    ]
  },
  {
    "id": "bioteknologi",
    "nameBM": "Bioteknologi",
    "nameEN": "Biotechnology",
    "safeContexts": [
      "laboratory batch scaling",
      "sample measurement",
      "culture data",
      "solution quantity models",
      "processing time"
    ]
  },
  {
    "id": "alam-bina",
    "nameBM": "Alam Bina",
    "nameEN": "Built Environment",
    "safeContexts": [
      "floor plans",
      "building dimensions",
      "material quantity",
      "roof/angle geometry",
      "project costing"
    ]
  },
  {
    "id": "awam",
    "nameBM": "Awam",
    "nameEN": "Civil",
    "safeContexts": [
      "site measurement",
      "road geometry",
      "concrete quantity",
      "survey angles",
      "project quantities"
    ]
  },
  {
    "id": "elektrik",
    "nameBM": "Elektrik",
    "nameEN": "Electrical",
    "safeContexts": [
      "cable length",
      "symbolic circuit relationships",
      "installation quantities",
      "signal phase context",
      "maintenance costing"
    ]
  },
  {
    "id": "elektronik",
    "nameBM": "Elektronik",
    "nameEN": "Electronics",
    "safeContexts": [
      "component values",
      "sensor formula",
      "signal phase",
      "circuit-board geometry",
      "production quantities"
    ]
  },
  {
    "id": "pemprosesan-bahan",
    "nameBM": "Pemprosesan Bahan",
    "nameEN": "Materials Processing",
    "safeContexts": [
      "batch mass",
      "material yield",
      "cutting dimensions",
      "processing quantities",
      "quality measurements"
    ]
  },
  {
    "id": "pembuatan",
    "nameBM": "Pembuatan",
    "nameEN": "Manufacturing",
    "safeContexts": [
      "production count",
      "machine time",
      "component tolerances",
      "unit cost",
      "fabrication geometry"
    ]
  },
  {
    "id": "mekanikal-servis",
    "nameBM": "Mekanikal Servis",
    "nameEN": "Mechanical Services",
    "safeContexts": [
      "maintenance time",
      "component sizing",
      "force-related symbolic models",
      "rotational measurements",
      "service costing"
    ]
  },
  {
    "id": "minyak-gas",
    "nameBM": "Minyak dan Gas",
    "nameEN": "Oil and Gas",
    "safeContexts": [
      "pipeline measurement",
      "storage geometry",
      "inspection data",
      "flow-related symbolic models",
      "project quantities"
    ]
  },
  {
    "id": "ict",
    "nameBM": "Teknologi Maklumat dan Komputer",
    "nameEN": "Information and Computer Technology",
    "safeContexts": [
      "network measurements",
      "data-rate calculations",
      "software testing counts",
      "system diagnostics",
      "device configuration"
    ]
  },
  {
    "id": "hospitaliti-kulinari",
    "nameBM": "Hospitaliti, Kulinari dan Perkhidmatan",
    "nameEN": "Hospitality, Culinary and Services",
    "safeContexts": [
      "recipe scaling",
      "service timing",
      "inventory quantities",
      "event layout",
      "operating cost"
    ]
  }
] as const;

export type TvetFieldId = typeof TVET_FIELDS[number]['id'];

export function getTvetField(id: string) {
  return TVET_FIELDS.find(field => field.id === id);
}
