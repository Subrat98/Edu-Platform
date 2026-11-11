import type { RenewableEnergyData } from "@/types";

export const initialRenewableEnergyData: RenewableEnergyData = {
  academicYear: "2025-26",
  solarGridCapacityKw: 120, // 120 kW Rooftop Grid
  annualSolarGenerationUnits: 156000, // 156,000 kWh / Units
  campusRenewablePowerSharePercentage: 42.5, // 42.5% of total campus load
  totalAnnualCo2MitigatedTonnes: 128,
  annualEnergyCostSavingsLakhs: 12.8,
  initiatives: [
    {
      id: "en-01",
      initiativeName: "120 kW Grid-Connected Rooftop Solar Photovoltaic (PV) Plant",
      type: "120 kW Rooftop Solar PV Grid",
      capacityOrRating: "120 kWp (Mono-crystalline Tier-1 Solar Panels with String Inverters)",
      annualEnergySavedKwh: 156000,
      annualFinancialSavingsLakhs: 11.2,
      vendorOrInstallationAgency: "Tata Power Solar Systems Ltd & OREDA",
    },
    {
      id: "en-02",
      initiativeName: "Occupancy PIR Sensor-Based Lighting & Air-Conditioning Automation",
      type: "Sensor-Based Lighting & Climate Control",
      capacityOrRating: "84 Dual-Technology Sensors installed in classrooms, labs & corridors",
      annualEnergySavedKwh: 14500,
      annualFinancialSavingsLakhs: 1.15,
      vendorOrInstallationAgency: "Schneider Electric Building Automation",
    },
    {
      id: "en-03",
      initiativeName: "100% Campus-wide Retrofitting with High-Efficiency LED Fixtures",
      type: "100% LED Campus Retrofitting",
      capacityOrRating: "1,240 LED Tube lights, Downlights, and 45W Solar Streetlamps",
      annualEnergySavedKwh: 22000,
      annualFinancialSavingsLakhs: 1.65,
      vendorOrInstallationAgency: "Philips Lighting & Campus Electrical Cell",
    },
    {
      id: "en-04",
      initiativeName: "Institutional Biogas Plant Utilizing Hostel Food Waste",
      type: "Biogas Plant (Hostel Food Waste)",
      capacityOrRating: "150 kg/day Solid Waste Digester with 10 m³ gas storage",
      annualEnergySavedKwh: 8500,
      annualFinancialSavingsLakhs: 0.85,
      vendorOrInstallationAgency: "BioEnergy GreenTech Solutions",
    },
  ],
  generationMonthlyLogs: [
    {
      id: "sol-2026-03",
      billingMonth: "March 2026",
      solarGenerationUnitsKwh: 14200,
      campusConsumptionKwh: 31500,
      wheeledToGridKwh: 2800,
      netMeteringBillInr: 138000,
      co2SavedTonnes: 11.6,
      billPdfUrl: "https://documents.eduplatform.ac.in/naac/7.1.2/solar_bill_mar2026.pdf",
    },
    {
      id: "sol-2026-02",
      billingMonth: "February 2026",
      solarGenerationUnitsKwh: 13400,
      campusConsumptionKwh: 29800,
      wheeledToGridKwh: 2450,
      netMeteringBillInr: 132000,
      co2SavedTonnes: 11.0,
      billPdfUrl: "https://documents.eduplatform.ac.in/naac/7.1.2/solar_bill_feb2026.pdf",
    },
    {
      id: "sol-2026-01",
      billingMonth: "January 2026",
      solarGenerationUnitsKwh: 12100,
      campusConsumptionKwh: 28400,
      wheeledToGridKwh: 2100,
      netMeteringBillInr: 130500,
      co2SavedTonnes: 9.9,
      billPdfUrl: "https://documents.eduplatform.ac.in/naac/7.1.2/solar_bill_jan2026.pdf",
    },
    {
      id: "sol-2025-12",
      billingMonth: "December 2025",
      solarGenerationUnitsKwh: 11800,
      campusConsumptionKwh: 27900,
      wheeledToGridKwh: 1950,
      netMeteringBillInr: 129000,
      co2SavedTonnes: 9.7,
      billPdfUrl: "https://documents.eduplatform.ac.in/naac/7.1.2/solar_bill_dec2025.pdf",
    },
  ],
};

export const MOCK_RENEWABLE_ENERGY_DATA = initialRenewableEnergyData;
