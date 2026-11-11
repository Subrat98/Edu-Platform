import type { EnvironmentalAuditData } from "@/types";

export const initialEnvironmentalAuditData: EnvironmentalAuditData = {
  academicYear: "2025-26",
  totalRainwaterCapacityLitres: 450000, // 4.5 Lakh Litres
  stpPlantCapacityKld: 100, // 100 KLD Sewage Treatment Plant
  annualCompostGeneratedKg: 8200,
  greenAuditCertification: "ISO 14001:2015 & Platinum Green Campus Rating",
  auditAgency: "Bureau of Energy & Environmental Audits (BEEA)",
  wasteFacilities: [
    {
      id: "w-01",
      wasteType: "Solid Waste Management (Composting)",
      facilityName: "Organic Wet Waste Vermicomposting Unit",
      dailyCapacity: "250 kg/day raw organic & canteen food waste",
      disposalOrRecyclingProtocol: "Segregation at source (Twin-bin green/blue system); microbial aerobic composting converting waste into rich organic manure utilized in campus gardens.",
      mouPartnerOrVendor: "Prakruti Organic Agro Solutions",
      inspectionCertificateRef: "ENV/SWM/2025/1102",
    },
    {
      id: "w-02",
      wasteType: "Liquid Waste Treatment (STP / Greywater)",
      facilityName: "100 KLD Moving Bed Biofilm Reactor (MBBR) STP Plant",
      dailyCapacity: "100,000 Litres/Day (100 KLD)",
      disposalOrRecyclingProtocol: "Three-stage biological treatment, sand filtration, and UV disinfection. 100% treated greywater recycled for landscape irrigation and toilet flushing.",
      mouPartnerOrVendor: "Aquatech Water Treatment Systems Ltd",
      inspectionCertificateRef: "PCB/OD/STP/2025/4412",
    },
    {
      id: "w-03",
      wasteType: "Biomedical Waste Management",
      facilityName: "Campus Health Centre Bio-Medical Waste Redressal Unit",
      dailyCapacity: "15 kg/month color-coded disposable waste",
      disposalOrRecyclingProtocol: "Barcoded puncture-proof disposal bins; authorized bi-weekly collection and autoclaving/incineration by State Pollution Control Board certified agency.",
      mouPartnerOrVendor: "Mediaid Bio-Clean Systems (Odisha SPCB Authorized)",
      inspectionCertificateRef: "OSPCB/BMW/AUTH/2025/089",
    },
    {
      id: "w-04",
      wasteType: "E-Waste Recycling & Buyback",
      facilityName: "Central E-Waste Storage & Decommissioning Depot",
      dailyCapacity: "Annual collection drive (~1,800 kg dismantled e-waste)",
      disposalOrRecyclingProtocol: "Formal buyback agreement for old computer motherboards, CRTs, Li-ion batteries, and cartridges; recycled under CPCB E-Waste Management Rules 2022.",
      mouPartnerOrVendor: "EcoRecycle India Pvt Ltd (Govt Certified Recycler)",
      inspectionCertificateRef: "CPCB/EW/REG/2025/304",
    },
    {
      id: "w-05",
      wasteType: "Hazardous Chemical Neutralization",
      facilityName: "Chemistry & Biotech Lab Effluent Neutralization Tank",
      dailyCapacity: "500 Litres/Day acidic/basic laboratory wastewater",
      disposalOrRecyclingProtocol: "Neutralization pit with pH stabilization buffers before release into secondary biological treatment.",
      mouPartnerOrVendor: "Internal Environmental Safety Cell",
      inspectionCertificateRef: "CHEM/SAF/2025/012",
    },
  ],
  rainwaterUnits: [
    {
      id: "rwh-01",
      unitLocation: "Academic Block A & Auditorium Catchment Rooftop",
      catchmentAreaSqM: 3200,
      storageCapacityLitres: 200000,
      rechargeBorewellsCount: 2,
      filtrationStages: "Multi-layered gravel, coarse sand, and activated charcoal filters with overflow desilting chamber.",
      geoTaggedPhotoUrl: "https://documents.eduplatform.ac.in/naac/7.1.3/rwh_block_a_photo.jpg",
    },
    {
      id: "rwh-02",
      unitLocation: "Central Library & Science Complex Rooftop",
      catchmentAreaSqM: 2500,
      storageCapacityLitres: 150000,
      rechargeBorewellsCount: 2,
      filtrationStages: "Rapid gravity sand filtration with dual recharge injection shafts into underground aquifer.",
      geoTaggedPhotoUrl: "https://documents.eduplatform.ac.in/naac/7.1.3/rwh_library_photo.jpg",
    },
    {
      id: "rwh-03",
      unitLocation: "Student Hostels & Indoor Sports Complex",
      catchmentAreaSqM: 1800,
      storageCapacityLitres: 100000,
      rechargeBorewellsCount: 1,
      filtrationStages: "Mesh leaf-trap strainers and percolation pit recharge system.",
      geoTaggedPhotoUrl: "https://documents.eduplatform.ac.in/naac/7.1.3/rwh_hostel_photo.jpg",
    },
  ],
};

export const MOCK_ENVIRONMENT_MANAGEMENT_DATA = initialEnvironmentalAuditData;
