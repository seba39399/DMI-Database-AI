import requests
from datetime import date, timedelta
import random

API_URL = "http://127.0.0.1:8000/api/v1/implant-cards"

dummy_implants = [
    {
        "name": "St. Jude Medical Pacemaker",
        "common": "Marcapasos Cardiaco Implantable",
        "reg": "INVIMA-2023DM-001",
    },
    {
        "name": "Titanium Orthopedic Screw O-91",
        "common": "Tornillo de Fijación Ósea",
        "reg": "INVIMA-2022DM-005",
    },
    {
        "name": "Aura Intraocular Lens Plus",
        "common": "Lente Intraocular Acrílico",
        "reg": "INVIMA-2024DM-009",
    },
    {
        "name": "Biomedical Surgical Suture Silk 3-0",
        "common": "Sutura Quirúrgica No Absorbible",
        "reg": "INVIMA-2021DM-002",
    },
    {
        "name": "Medtronic Heart Valve BioPro",
        "common": "Válvula Cardiaca Biológica",
        "reg": "INVIMA-2025DM-012",
    },
]

surgeons = [
    "Dr. Alejandro Restrepo",
    "Dra. Maria Camila Hoyos",
    "Dr. Carlos Eduardo Mejia",
]
providers = ["Medica Express S.A.S", "Implant Salud Colombia", "Biomédicos del Valle"]


def seed_random_data():
    print("🚀 Starting data injection payload to Club Noel local API...")

    for i in range(10):  # Generates 10 random entries
        item = random.choice(dummy_implants)
        random_days = random.randint(1, 365)
        mock_date = (date.today() - timedelta(days=random_days)).isoformat()

        payload = {
            "implant_name": f"{item['name']} v{random.randint(1, 5)}",
            "implant_code": f"SN-{random.randint(100000, 999999)}",
            "implantation_date": mock_date,
            "common_denomination": item["common"],
            "sanitary_registration": item["reg"],
            "surgeon_name": random.choice(surgeons),
            "provider": random.choice(providers),
            "nit": f"{random.randint(800000000, 999999999)}-{random.randint(0, 9)}",
            "phone": f"+57 3{random.randint(10, 19)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
            "references": f"REF-{random.randint(1000, 9999)}",
            "storage_unit_code": f"WH-ZONE-{random.choice(['A', 'B', 'C'])}",
            "implantation_unit_code": f"OR-ROOM-0{random.randint(1, 5)}",
        }

        response = requests.post(API_URL, json=payload)
        if response.status_code == 201:
            data = response.json()
            print(
                f"✅ Saved successfully: {data['implant_name']} -> Classified as: {data['risk_class']}"
            )
        else:
            print(f"❌ Failed connection: {response.text}")


if __name__ == "__main__":
    # Ensure uvicorn is running in another terminal window before executing this file
    seed_random_data()
