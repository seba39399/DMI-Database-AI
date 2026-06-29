from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# ==============================================================================
# 1. READ / QUERY TEST SUITES
# ==============================================================================


def test_01_read_implant_cards_success():
    """
    Ensure the main GET endpoint responds with HTTP 200 and yields a structured array list.
    """
    response = client.get("/api/v1/implant-cards")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ==============================================================================
# 2. AI HEURISTIC & RISK CLASSIFICATION INTEGRATION TESTS (CREATION)
# ==============================================================================


def test_02_create_class_iii_pacemaker_device():
    """
    Ensure cardiac pacemaker terms are correctly intercepted and classified as Class III (High Risk).
    """
    payload = {
        "implant_name": "Premium Pacemaker Multi-Chamber",
        "implant_code": "SN-C3-882",
        "implantation_date": "2026-06-26",
        "common_denomination": "Marcapasos Cardiaco Invasivo",
        "sanitary_registration": "INVIMA-2026-003",
        "surgeon_name": "Dr. Alejandro Restrepo",
        "provider": "Medica Express S.A.S",
        "nit": "900123456-1",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class III"


def test_03_create_class_iii_heart_valve_device():
    """
    Ensure biological heart valves route securely into Class III classification.
    """
    payload = {
        "implant_name": "Edwards Biological Heart Valve",
        "implant_code": "SN-VALVE-102",
        "implantation_date": "2026-06-25",
        "common_denomination": "Valvula Cardiaca Biologica",
        "sanitary_registration": "INVIMA-2026-012",
        "surgeon_name": "Dr. Camilo Gomez",
        "provider": "CardioSupply S.A.",
        "nit": "800999888-2",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class III"


def test_04_create_class_iib_trauma_screw_device():
    """
    Ensure orthopedic trauma screws map accurately to Class IIb (High-Medium Risk).
    """
    payload = {
        "implant_name": "Titanium Bone Screw 4.0mm",
        "implant_code": "SN-SCREW-99",
        "implantation_date": "2026-06-24",
        "common_denomination": "Tornillo de Fijacion Osea",
        "sanitary_registration": "INVIMA-2025-098",
        "surgeon_name": "Dr. Marta Ruiz",
        "provider": "OrthoTech Imports",
        "nit": "911222333-0",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class IIb"


def test_05_create_class_iib_fixation_plate_device():
    """
    Ensure orthopedic reconstruction bone plates map to Class IIb.
    """
    payload = {
        "implant_name": "Clavicle LCP Reconstruction Plate",
        "implant_code": "SN-PLATE-441",
        "implantation_date": "2026-06-20",
        "common_denomination": "Placa de Fijacion Interna",
        "sanitary_registration": "INVIMA-2025-010",
        "surgeon_name": "Dr. Fernando Ortiz",
        "provider": "OrthoTech Imports",
        "nit": "911222333-0",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class IIb"


def test_06_create_class_iia_ophthalmic_lens_device():
    """
    Ensure ophthalmic/intraocular lenses map correctly to Class IIa (Medium-Low Risk).
    """
    payload = {
        "implant_name": "Alcon AcrySof Intraocular Lens",
        "implant_code": "SN-LENS-332",
        "implantation_date": "2026-06-22",
        "common_denomination": "Lente Intraocular Monofocal",
        "sanitary_registration": "INVIMA-2024-882",
        "surgeon_name": "Dr. Laura Beltran",
        "provider": "Ophthalmic Logistics",
        "nit": "900555444-9",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class IIa"


def test_07_create_class_iia_surgical_suture_device():
    """
    Ensure surgical sutures map to Class IIa risk tier.
    """
    payload = {
        "implant_name": "Ethicon Vicryl Suture",
        "implant_code": "SN-SUTURE-001",
        "implantation_date": "2026-06-21",
        "common_denomination": "Sutura Quirurgica Sintetica",
        "sanitary_registration": "INVIMA-2023-111",
        "surgeon_name": "Dr. Alejandro Restrepo",
        "provider": "Medica Express S.A.S",
        "nit": "900123456-1",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class IIa"


def test_08_create_class_i_generic_device():
    """
    Ensure low-risk devices with no structural matches fall back cleanly to Class I (Low Risk).
    """
    payload = {
        "implant_name": "Standard Surface Dermal Bandage",
        "implant_code": "SN-BANDAGE-77",
        "implantation_date": "2026-06-19",
        "common_denomination": "Aposito Superficial",
        "sanitary_registration": "INVIMA-2022-771",
        "surgeon_name": "Dr. Laura Beltran",
        "provider": "Medica Express S.A.S",
        "nit": "900123456-1",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class I"


# ==============================================================================
# 3. ROBUST VALIDATION TEST SUITES (HTTP 422 ERROR HANDLING)
# ==============================================================================


def test_09_create_validation_error_missing_implant_name():
    """
    Validate that omitting the mandatory 'implant_name' field aborts transaction with HTTP 422.
    """
    payload = {
        "implant_code": "SN-ERROR-001",
        "implantation_date": "2026-06-26",
        "sanitary_registration": "INVIMA-VALIDATION-ERROR",
        "surgeon_name": "Dr. Error Test",
        "provider": "Mock Provider",
        "nit": "123456789-0",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 422


def test_10_create_validation_error_missing_implant_code():
    """
    Validate that omitting the mandatory 'implant_code' serial field triggers HTTP 422.
    """
    payload = {
        "implant_name": "Critical Cardiac Pacemaker",
        "implantation_date": "2026-06-26",
        "sanitary_registration": "INVIMA-VALIDATION-ERROR",
        "surgeon_name": "Dr. Error Test",
        "provider": "Mock Provider",
        "nit": "123456789-0",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 422


def test_11_create_validation_error_missing_sanitary_registration():
    """
    Validate that omitting the mandatory 'sanitary_registration' (INVIMA) yields HTTP 422.
    """
    payload = {
        "implant_name": "Titanium Trauma Screw",
        "implant_code": "SN-SCREW-ERROR",
        "implantation_date": "2026-06-26",
        "surgeon_name": "Dr. Error Test",
        "provider": "Mock Provider",
        "nit": "123456789-0",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 422


def test_12_create_validation_error_invalid_date_format():
    """
    Validate that passing an incorrect date format string triggers FastAPI Pydantic schema rejection.
    """
    payload = {
        "implant_name": "Titanium Trauma Screw",
        "implant_code": "SN-SCREW-ERROR",
        "implantation_date": "not-a-valid-iso-date-string",
        "sanitary_registration": "INVIMA-DATE-ERROR",
        "surgeon_name": "Dr. Error Test",
        "provider": "Mock Provider",
        "nit": "123456789-0",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 422


def test_13_create_validation_error_empty_json_body():
    """
    Validate sending an empty dictionary payload triggers validation errors.
    """
    response = client.post("/api/v1/implant-cards", json={})
    assert response.status_code == 422


# ==============================================================================
# 4. CORS AND HEURISTIC SANITY CHECKS
# ==============================================================================


def test_14_cors_preflight_handshake_approval():
    """
    Ensure CORS preflight OPTIONS request approves critical cross-origin operations.
    """
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
    }
    response = client.options("/api/v1/implant-cards", headers=headers)
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_15_case_insensitive_classification_matching():
    """
    Validate that uppercase mixed terms like 'MaRcApAsOs' trigger standard cardiac Class III classifications.
    """
    payload = {
        "implant_name": "Alternative Device XYZ",
        "implant_code": "SN-CASE-99",
        "implantation_date": "2026-06-26",
        "common_denomination": "MaRcApAsOs De AlTa TeCnOlOgIa",
        "sanitary_registration": "INVIMA-CASE-TEST",
        "surgeon_name": "Dr. Case Sensitivity",
        "provider": "Case Provider S.A.S",
        "nit": "111222333-1",
    }
    response = client.post("/api/v1/implant-cards", json=payload)
    assert response.status_code == 201
    assert response.json()["risk_class"] == "Class III"


def test_16_non_existent_route_gives_404():
    """
    Validate that querying arbitrary paths yields a clean HTTP 404 response.
    """
    response = client.get("/api/v1/non-existent-module-path")
    assert response.status_code == 404
