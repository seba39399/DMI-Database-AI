// @vitest-environment jsdom
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import React from "react";
import App from "../src/App";

// Global variable to hold mock database responses dynamically
let mockFetchResponse = [];

beforeAll(() => {
  // Spy on global fetch and intercept with custom mock implementation
  vi.spyOn(global, "fetch").mockImplementation((url, options) => {
    // If it's a POST request, simulate successful creation
    if (options && options.method === "POST") {
      return Promise.resolve({
        status: 201,
        json: () => Promise.resolve({ id: 99, risk_class: "Class III" }),
      });
    }
    // Standard GET response returning the current array state
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve(mockFetchResponse),
    });
  });

  // Mirror globally defined mock to the JSDOM window context
  window.fetch = global.fetch;
});

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
  mockFetchResponse = []; // Reset response state to empty array
});

afterEach(() => {
  cleanup();
});

describe("Club Noel - Complete Frontend UI Integration Suite", () => {
  // TEST 01: Brand Render Check
  test("01 - renders sidebar brand information correctly", () => {
    render(<App />);
    expect(screen.queryByText("Club Noel")).not.toBeNull();
    expect(screen.queryByText("Children's Clinic // DMI")).not.toBeNull();
  });

  // TEST 02: Default Active Tab
  test("02 - displays data ingestion view as the default active tab", () => {
    render(<App />);
    expect(
      screen.queryByText("Medical Device Ingestion & Registry"),
    ).not.toBeNull();
    expect(
      screen.queryByText(
        "Two-column digital mirror layout for physical technical card validation workflows.",
      ),
    ).not.toBeNull();
  });

  // TEST 03: Tab Transition - Analytics
  test("03 - navigates to Analytics Dashboard when tab is clicked", () => {
    render(<App />);
    const analyticsBtn = screen.getByRole("button", {
      name: /analytics dashboard/i,
    });
    fireEvent.click(analyticsBtn);

    expect(
      screen.queryByText("Global Statistics & Key Performance Indicators"),
    ).not.toBeNull();
    expect(screen.queryByText("Total Implants")).not.toBeNull();
  });

  // TEST 04: Tab Transition - AI Sandbox
  test("04 - navigates to AI Risk Sandbox when tab is clicked", () => {
    render(<App />);
    const sandboxBtn = screen.getByRole("button", { name: /ai risk sandbox/i });
    fireEvent.click(sandboxBtn);

    expect(screen.queryByText("AI Risk Simulation Sandbox")).not.toBeNull();
    expect(screen.queryByText(/Simulation Parameters/i)).not.toBeNull();
  });

  // TEST 05: Ingestion Form Layout Check
  test("05 - renders all mandatory form input fields correctly", () => {
    render(<App />);
    expect(
      screen.queryByPlaceholderText("e.g., Pacemaker St. Jude"),
    ).not.toBeNull();
    expect(screen.queryByPlaceholderText("e.g., SN-203948")).not.toBeNull();
    expect(
      screen.queryByPlaceholderText("e.g., INVIMA-2023DM-001"),
    ).not.toBeNull();
    expect(
      screen.queryByPlaceholderText("Dr. Alejandro Restrepo"),
    ).not.toBeNull();
    expect(
      screen.queryByPlaceholderText("e.g., Medica Express S.A.S"),
    ).not.toBeNull();
    expect(screen.queryByPlaceholderText("e.g., 900123456-1")).not.toBeNull();
  });

  // TEST 06: Form Input Interactions
  test("06 - permits key values to be typed into input fields", () => {
    render(<App />);
    const nameInput = screen.getByPlaceholderText("e.g., Pacemaker St. Jude");
    fireEvent.change(nameInput, {
      target: { value: "Club Noel Artificial Heart" },
    });
    expect(nameInput.value).toBe("Club Noel Artificial Heart");
  });

  // TEST 07: Successful Ingestion Form Submit Action
  test("07 - triggers API post request and resets state on successful submission", async () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText("e.g., Pacemaker St. Jude");
    const codeInput = screen.getByPlaceholderText("e.g., SN-203948");
    const dateInput = screen
      .getByText(/Implantation Date \*/i)
      .parentElement.querySelector('input[type="date"]');
    const invimaInput = screen.getByPlaceholderText("e.g., INVIMA-2023DM-001");
    const surgeonInput = screen.getByPlaceholderText("Dr. Alejandro Restrepo");
    const providerInput = screen.getByPlaceholderText(
      "e.g., Medica Express S.A.S",
    );
    const nitInput = screen.getByPlaceholderText("e.g., 900123456-1");

    fireEvent.change(nameInput, {
      target: { value: "Edwards Biological Heart Valve" },
    });
    fireEvent.change(codeInput, { target: { value: "SN-V881" } });
    fireEvent.change(dateInput, { target: { value: "2026-06-26" } });
    fireEvent.change(invimaInput, { target: { value: "INVIMA-VALVE-77" } });
    fireEvent.change(surgeonInput, {
      target: { value: "Dr. Fernando Restrepo" },
    });
    fireEvent.change(providerInput, { target: { value: "CardioSupply Inc." } });
    fireEvent.change(nitInput, { target: { value: "800454321-2" } });

    const submitBtn = screen.getByRole("button", {
      name: /ai classify & save record/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.queryByText(/Record securely stored and AI-Classified!/i),
      ).not.toBeNull();
    });

    expect(nameInput.value).toBe("");
  });

  // TEST 08: Handle Ingestion API Network Errors Gracefully
  test("08 - handles connection error grace period and prompts feedback notification", async () => {
    // Override the mock to throw a connection error on submit
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([]),
      }),
    ); // initial mount GET
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Connection Timeout Mock")),
    ); // subsequent POST

    render(<App />);

    // Must fill out required fields to satisfy browser HTML5 validation checks in JSDOM
    const nameInput = screen.getByPlaceholderText("e.g., Pacemaker St. Jude");
    const codeInput = screen.getByPlaceholderText("e.g., SN-203948");
    const dateInput = screen
      .getByText(/Implantation Date \*/i)
      .parentElement.querySelector('input[type="date"]');
    const invimaInput = screen.getByPlaceholderText("e.g., INVIMA-2023DM-001");
    const surgeonInput = screen.getByPlaceholderText("Dr. Alejandro Restrepo");
    const providerInput = screen.getByPlaceholderText(
      "e.g., Medica Express S.A.S",
    );
    const nitInput = screen.getByPlaceholderText("e.g., 900123456-1");

    fireEvent.change(nameInput, { target: { value: "Failing Dev" } });
    fireEvent.change(codeInput, { target: { value: "SN-FAIL" } });
    fireEvent.change(dateInput, { target: { value: "2026-06-26" } });
    fireEvent.change(invimaInput, { target: { value: "INVIMA-FAIL" } });
    fireEvent.change(surgeonInput, { target: { value: "Dr. Fail" } });
    fireEvent.change(providerInput, { target: { value: "Fail Corp" } });
    fireEvent.change(nitInput, { target: { value: "00000000-0" } });

    const submitBtn = screen.getByRole("button", {
      name: /ai classify & save record/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.queryByText(/Connection failed. Verify your server instance./i),
      ).not.toBeNull();
    });
  });

  // TEST 09: Database Table Render with Items
  test("09 - renders a populated database list on active rows", async () => {
    mockFetchResponse = [
      {
        id: 1,
        implant_name: "Premium Pacemaker",
        common_denomination: "Marcapasos Cardiaco",
        implant_code: "SN-9922",
        implantation_date: "2026-06-26",
        surgeon_name: "Dr. Restrepo",
        provider: "CardioSupply S.A.",
        risk_class: "Class III",
      },
    ];

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Premium Pacemaker")).not.toBeNull();
      expect(screen.queryByText("SN-9922")).not.toBeNull();
      expect(screen.queryByText("Class III")).not.toBeNull();
    });
  });

  // TEST 10: Empty Table Fallback Message Check
  test("10 - displays a clean placeholder alert when sql database array is empty", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.queryByText(
          /No records stored yet. Run seed.py or complete the form above./i,
        ),
      ).not.toBeNull();
    });
  });

  // TEST 11: AI Sandbox Empty Startup Condition
  test("11 - displays helpful prompt message inside AI Sandbox upon startup", () => {
    render(<App />);
    const sandboxBtn = screen.getByRole("button", { name: /ai risk sandbox/i });
    fireEvent.click(sandboxBtn);

    expect(screen.queryByText(/Awaiting parameters.../i)).not.toBeNull();
  });

  // TEST 12: AI Sandbox Classification Evaluation - Class III (Pacemakers)
  test("12 - classifies vital heart pacemaker implants as Class III under the AI sandbox environment", () => {
    render(<App />);
    const sandboxBtn = screen.getByRole("button", { name: /ai risk sandbox/i });
    fireEvent.click(sandboxBtn);

    const devNameInput = screen.getByPlaceholderText(
      "e.g., Edwards Magna Valve",
    );
    const devCommonInput = screen.getByPlaceholderText(
      "e.g., Biological aortic heart valve replacement",
    );
    const runSimBtn = screen.getByRole("button", {
      name: /Run Risk Diagnostics Evaluation/i,
    });

    fireEvent.change(devNameInput, {
      target: { value: "Medtronic Pacemaker System" },
    });
    fireEvent.change(devCommonInput, {
      target: { value: "Cardiac supportive pacemaker" },
    });
    fireEvent.click(runSimBtn);

    expect(screen.queryByText("Class III")).not.toBeNull();
    expect(
      screen.queryByText(
        /Critical invasive life-support device with high cardiac complexity/i,
      ),
    ).not.toBeNull();
  });

  // TEST 13: Analytics Metrics KPI Real-time Updates
  test("13 - updates KPIs correctly inside Analytics dashboard when dataset is loaded", async () => {
    const mockedDatabaseList = [
      {
        id: 1,
        implant_name: "P1",
        common_denomination: "Marcapasos",
        implant_code: "X1",
        implantation_date: "2026",
        surgeon_name: "Dr. A",
        provider: "Medica Express",
        risk_class: "Class III",
      },
      {
        id: 2,
        implant_name: "P2",
        common_denomination: "Tornillo",
        implant_code: "X2",
        implantation_date: "2026",
        surgeon_name: "Dr. B",
        provider: "Medica Express",
        risk_class: "Class IIb",
      },
    ];

    global.fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockedDatabaseList),
    });

    render(<App />);

    const analyticsBtn = screen.getByRole("button", {
      name: /analytics dashboard/i,
    });
    fireEvent.click(analyticsBtn);

    await waitFor(() => {
      // Robust target selection matching the specific parent KPI metric containers
      const totalCard = screen.getByText("Total Implants").parentElement;
      expect(totalCard.querySelector("h3").textContent).toBe("2");

      const criticalCard = screen.getByText(
        "Critical Risk (CIII)",
      ).parentElement;
      expect(criticalCard.querySelector("h3").textContent).toBe("1");

      const highCard = screen.getByText("High Risk (CIIb)").parentElement;
      expect(highCard.querySelector("h3").textContent).toBe("1");
    });
  });
});
