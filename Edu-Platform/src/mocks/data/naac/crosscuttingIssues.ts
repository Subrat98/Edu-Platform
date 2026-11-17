import type {
  CrosscuttingCourseMapping,
  CrosscuttingCoCurricularActivity,
  CrosscuttingSummaryData,
} from "@/types";

export const initialCrosscuttingCourseMappings: CrosscuttingCourseMapping[] = [
  // ---------------------------------------------------------
  // THEME 1: GENDER SENSITIZATION & EQUITY (6 Courses)
  // ---------------------------------------------------------
  {
    id: "cc-gen-01",
    courseCode: "AECC-GEN101",
    courseTitle: "Gender Sensitization, Human Rights & Prevention of Sexual Harassment",
    programmeName: "All Undergraduate Programmes (Common Foundation)",
    department: "Department of Humanities & Gender Sensitization Cell",
    courseType: "Ability Enhancement (AECC)",
    theme: "Gender Sensitization & Equity",
    highlightedUnit: "Unit II: Legal Frameworks, POSH Act 2013 & Gender Equity in Public Spaces",
    unitTitle: "Constitutional Guarantees, Vishaka Guidelines & Workplace Equality",
    syllabusExcerpt:
      "Analysis of Articles 14, 15, and 16 of the Indian Constitution ensuring equality of opportunity. Detailed provisions of the Protection of Women from Domestic Violence Act 2005 and the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013. Role of Internal Complaints Committee (ICC), bystander intervention, and institutional grievance redressal protocols.",
    highlightedKeywords: [
      "Articles 14, 15, 16",
      "POSH Act 2013",
      "Internal Complaints Committee (ICC)",
      "Workplace Equality",
      "Gender Sensitization",
    ],
    contactHoursDevoted: 12,
    learningOutcomes:
      "Students demonstrate constitutional literacy regarding gender equity, recognize subtle forms of workplace bias, and understand institutional redressal mechanisms.",
    syllabusPdfUrl: "/documents/naac/crosscutting/AECC_GEN101_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-gen-02",
    courseCode: "ENG-GE201",
    courseTitle: "Gender Studies and Women's Voices in Indian Literature",
    programmeName: "B.A. English (Honours) / Generic Elective for All Streams",
    department: "Department of English",
    courseType: "Generic Elective (GE)",
    theme: "Gender Sensitization & Equity",
    highlightedUnit: "Unit III: Deconstructing Patriarchy & Voices of Resistance",
    unitTitle: "Ecriture Feminine, Dalit Feminist Narratives & Subaltern Resistance",
    syllabusExcerpt:
      "Critical reading of Mahasweta Devi's 'Draupadi', Rokeya Sakhawat Hossain's 'Sultana's Dream', and Kamala Das's poetry. Examination of intersectional vulnerability, patriarchal hegemony, caste-gender intersections, and reclamation of female agency in post-independence literature.",
    highlightedKeywords: [
      "Intersectional Vulnerability",
      "Patriarchal Hegemony",
      "Female Agency",
      "Sultana's Dream",
      "Dalit Feminism",
    ],
    contactHoursDevoted: 16,
    learningOutcomes:
      "Learners critically deconstruct socio-cultural stereotypes, articulate gender perspectives, and appreciate literature as a vehicle for human rights.",
    syllabusPdfUrl: "/documents/naac/crosscutting/ENG_GE201_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-gen-03",
    courseCode: "POL-CC302",
    courseTitle: "Women and the Political Process in Modern India",
    programmeName: "B.A. Political Science (Honours)",
    department: "Department of Political Science",
    courseType: "Core Course",
    theme: "Gender Sensitization & Equity",
    highlightedUnit: "Unit IV: Affirmative Action, 73rd/74th Constitutional Amendments & Grassroots Leadership",
    unitTitle: "Panchayati Raj Institutions, Women's Reservation & Policy Interventions",
    syllabusExcerpt:
      "Empirical study of women's representation in urban and rural local bodies post the 73rd and 74th Amendments (33% to 50% reservation in Odisha). Evaluation of women sarpanches, self-help groups (Mission Shakti), gender budgeting, and policy challenges in mainstream political representation.",
    highlightedKeywords: [
      "73rd and 74th Amendments",
      "Panchayati Raj Institutions",
      "Gender Budgeting",
      "Mission Shakti SHGs",
      "Women Leadership",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Equips students with analytical tools to assess grassroots political empowerment of women and identify structural barriers to legislative representation.",
    syllabusPdfUrl: "/documents/naac/crosscutting/POL_CC302_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-gen-04",
    courseCode: "SOC-CC104",
    courseTitle: "Sociology of Gender, Family and Social Stratification",
    programmeName: "B.A. Sociology (Honours)",
    department: "Department of Sociology",
    courseType: "Core Course",
    theme: "Gender Sensitization & Equity",
    highlightedUnit: "Unit II: Social Construction of Gender & Queer Inclusivity",
    unitTitle: "Sex vs. Gender, Masculinities, Transgender Rights & NALSA Verdict",
    syllabusExcerpt:
      "Sociological distinction between biological sex and socially constructed gender roles. Examination of hegemonic masculinity, queer identities, Supreme Court NALSA judgment (2014) recognizing the third gender, and Transgender Persons (Protection of Rights) Act 2019.",
    highlightedKeywords: [
      "Sex vs. Gender",
      "NALSA Judgment 2014",
      "Transgender Rights",
      "Hegemonic Masculinity",
      "Queer Inclusivity",
    ],
    contactHoursDevoted: 15,
    learningOutcomes:
      "Deepens understanding of intersectional social identities and prepares students to champion anti-discriminatory environments in civic and professional life.",
    syllabusPdfUrl: "/documents/naac/crosscutting/SOC_CC104_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-gen-05",
    courseCode: "COM-HRM302",
    courseTitle: "Human Resource Management & Workplace Diversity",
    programmeName: "Bachelor of Commerce (B.Com. Honours)",
    department: "Department of Commerce",
    courseType: "Discipline Specific (DSE)",
    theme: "Gender Sensitization & Equity",
    highlightedUnit: "Unit III: Diversity, Equity and Inclusion (DEI) Frameworks",
    unitTitle: "Pay Parity, Maternity Benefit Act & Prevention of Unconscious Bias",
    syllabusExcerpt:
      "Strategic implementation of Diversity, Equity, and Inclusion (DEI) in corporate organizations. Compliance with Maternity Benefit Amendment Act 2017, equal remuneration directives, parental leave policies, breaking the glass ceiling, and auditing unconscious gender bias during recruitment.",
    highlightedKeywords: [
      "Diversity, Equity and Inclusion (DEI)",
      "Maternity Benefit Act",
      "Equal Remuneration",
      "Glass Ceiling",
      "Unconscious Bias",
    ],
    contactHoursDevoted: 10,
    learningOutcomes:
      "Graduates enter corporate careers equipped with standard diversity management tools, anti-bias protocols, and statutory compliance expertise.",
    syllabusPdfUrl: "/documents/naac/crosscutting/COM_HRM302_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-gen-06",
    courseCode: "BBA-OB204",
    courseTitle: "Organizational Behavior & Inclusive Leadership Ethics",
    programmeName: "Bachelor of Business Administration (BBA)",
    department: "Department of Management Studies",
    courseType: "Core Course",
    theme: "Gender Sensitization & Equity",
    highlightedUnit: "Unit IV: Inclusive Decision-Making & Psychological Safety",
    unitTitle: "Gender Diverse Boardrooms, ESG Social Metrics & Inclusive Culture",
    syllabusExcerpt:
      "Empirical linkage between board gender diversity, corporate governance indices, and financial stability. Techniques for building psychological safety, mentoring women in business, and reporting on Corporate Social Responsibility (CSR) gender indices.",
    highlightedKeywords: [
      "Gender Diverse Boardrooms",
      "Psychological Safety",
      "ESG Social Metrics",
      "Inclusive Leadership",
      "CSR Gender Indices",
    ],
    contactHoursDevoted: 11,
    learningOutcomes:
      "Prepares future enterprise managers to foster inclusive work cultures and align organizational goals with gender-balanced leadership.",
    syllabusPdfUrl: "/documents/naac/crosscutting/BBA_OB204_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },

  // ---------------------------------------------------------
  // THEME 2: ENVIRONMENT & SUSTAINABILITY (8 Courses)
  // ---------------------------------------------------------
  {
    id: "cc-env-01",
    courseCode: "AECC-ENV101",
    courseTitle: "Environmental Studies and Disaster Management",
    programmeName: "Mandatory Across All 14 Degree Programmes (UG Semester I)",
    department: "College IQAC & Department of Life Sciences",
    courseType: "Ability Enhancement (AECC)",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit III & IV: Ecosystem Health, Climate Change, Solid Waste & Disaster Mitigation",
    unitTitle: "Global Warming, Carbon Footprint, E-Waste Rules & Coastal Cyclone Protocols",
    syllabusExcerpt:
      "Principles of ecology, biodiversity hotspots of Odisha (Bhitarkanika, Chilika, Similipal), anthropogenic climate drivers, greenhouse gas accounting. Comprehensive study of Solid Waste Management Rules 2016, Plastic Waste Management, and Odisha State Disaster Management Authority (OSDMA) cyclone and flood mitigation frameworks.",
    highlightedKeywords: [
      "Biodiversity Hotspots",
      "Carbon Footprint",
      "Solid Waste Management Rules 2016",
      "OSDMA Cyclone Protocols",
      "Climate Change Mitigation",
    ],
    contactHoursDevoted: 25,
    learningOutcomes:
      "Mandatory for 100% undergraduate students; equips every graduate with ecological literacy, disaster preparedness skills, and waste-reduction habits.",
    syllabusPdfUrl: "/documents/naac/crosscutting/AECC_ENV101_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-02",
    courseCode: "BOT-CC203",
    courseTitle: "Plant Ecology, Environmental Biology & Phytoremediation",
    programmeName: "B.Sc. Botany (Honours)",
    department: "Department of Botany",
    courseType: "Core Course",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit III: Wetland Ecology, Carbon Sequestration & Mangrove Ecosystems",
    unitTitle: "Blue Carbon Sinks, Mangrove Conservation & Coastal Eco-Restoration",
    syllabusExcerpt:
      "Ecological valuation of coastal wetlands, mangrove adaptations in Bhitarkanika National Park, blue carbon sequestration dynamics, threat vectors from sea-level rise, and practical field techniques for indigenous saline-tolerant reforestation.",
    highlightedKeywords: [
      "Blue Carbon Sinks",
      "Mangrove Ecosystems",
      "Bhitarkanika Conservation",
      "Phytoremediation",
      "Carbon Sequestration",
    ],
    contactHoursDevoted: 16,
    learningOutcomes:
      "Students understand coastal ecosystem dynamics, blue carbon accounting, and plant-assisted remediation for degraded lands.",
    syllabusPdfUrl: "/documents/naac/crosscutting/BOT_CC203_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-03",
    courseCode: "CHEM-DSE401",
    courseTitle: "Green Chemistry, Sustainable Catalysis & Clean Technologies",
    programmeName: "B.Sc. Chemistry (Honours)",
    department: "Department of Chemistry",
    courseType: "Discipline Specific (DSE)",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit I & II: Twelve Principles of Green Chemistry & Solvent-Free Synthesis",
    unitTitle: "Atom Economy, Supercritical Fluids, Green Solvents & Microwave Synthesis",
    syllabusExcerpt:
      "Rigorous exploration of Paul Anastas and John Warner's 12 Principles of Green Chemistry. Calculation of atom economy, E-factor, reaction mass efficiency. Use of benign solvents like supercritical CO2, ionic liquids, bio-catalysis, and microwave-assisted synthesis to eliminate toxic effluents.",
    highlightedKeywords: [
      "12 Principles of Green Chemistry",
      "Atom Economy & E-factor",
      "Supercritical CO2",
      "Bio-catalysis",
      "Effluent Elimination",
    ],
    contactHoursDevoted: 18,
    learningOutcomes:
      "Students design laboratory synthesis protocols minimizing waste generation and adhere to sustainable industrial chemistry practices.",
    syllabusPdfUrl: "/documents/naac/crosscutting/CHEM_DSE401_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-04",
    courseCode: "PHY-GE301",
    courseTitle: "Renewable Energy Technologies, Photovoltaics & Clean Power",
    programmeName: "B.Sc. Physics (Honours) / Generic Elective for All Science Streams",
    department: "Department of Physics",
    courseType: "Generic Elective (GE)",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit III: Solar Photovoltaics, Grid Synchronization & Clean Energy Policies",
    unitTitle: "Semiconductor Bandgap Engineering, Solar Cell Efficiencies & National Solar Mission",
    syllabusExcerpt:
      "Physics of p-n junction solar cells, quantum dot photovoltaics, maximum power point tracking (MPPT), rooftop solar net-metering. Policy study of India's Panchamrit climate goals (500 GW non-fossil capacity by 2030) and the PM-Surya Ghar Muft Bijli Yojana.",
    highlightedKeywords: [
      "Solar Photovoltaics",
      "Net-Metering",
      "Panchamrit Climate Goals",
      "Clean Energy Transition",
      "Non-Fossil Capacity",
    ],
    contactHoursDevoted: 15,
    learningOutcomes:
      "Students calculate solar energy yields, understand grid-tied micro-inverters, and align technical skills with India's national energy transition.",
    syllabusPdfUrl: "/documents/naac/crosscutting/PHY_GE301_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-05",
    courseCode: "ZOO-CC402",
    courseTitle: "Conservation Biology, Wildlife Protection & Biodiversity Laws",
    programmeName: "B.Sc. Zoology (Honours)",
    department: "Department of Zoology",
    courseType: "Core Course",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit IV: Wildlife Protection Act 1972, CITES & Man-Animal Conflict Mitigation",
    unitTitle: "Endangered Fauna of Eastern Ghats, Olive Ridley Protection & Elephant Corridors",
    syllabusExcerpt:
      "Wildlife Protection Act 1972 (amended 2022), CITES conventions, Red Data Book IUCN categories. Case studies on mass nesting (Arribada) of Olive Ridley turtles along Gahirmatha and Rushikulya coasts, Asian elephant corridors in Mayurbhanj, and community eco-tourism models.",
    highlightedKeywords: [
      "Wildlife Protection Act 1972",
      "Olive Ridley Conservation",
      "Elephant Corridors",
      "IUCN Red List",
      "Man-Animal Conflict Mitigation",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Enables students to participate in scientific wildlife census, assess habitat fragmentation, and apply environmental laws.",
    syllabusPdfUrl: "/documents/naac/crosscutting/ZOO_CC402_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-06",
    courseCode: "ECO-GE202",
    courseTitle: "Environmental Economics, Natural Resource Accounting & Valuation",
    programmeName: "B.A. Economics (Honours) / Generic Elective for Commerce & Arts",
    department: "Department of Economics",
    courseType: "Generic Elective (GE)",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit II: Market Failures, Pigouvian Taxes & Carbon Trading Mechanisms",
    unitTitle: "Tragedy of the Commons, Externalities, Cap-and-Trade & Green GDP",
    syllabusExcerpt:
      "Economic analysis of environmental externalities, public goods, Coase theorem, carbon credit markets, and European Carbon Border Adjustment Mechanism (CBAM). Methodologies for computing Green National Product and valuing ecosystem services via contingent valuation.",
    highlightedKeywords: [
      "Carbon Credit Markets",
      "Pigouvian Taxes",
      "Green GDP",
      "Cap-and-Trade",
      "Ecosystem Service Valuation",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Students apply economic modeling to natural resource conservation, carbon taxation, and sustainable development trade-offs.",
    syllabusPdfUrl: "/documents/naac/crosscutting/ECO_GE202_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-07",
    courseCode: "CS-SEC301",
    courseTitle: "Green Computing, Data Center Energy Efficiency & E-Waste Laws",
    programmeName: "B.Sc. Computer Science & BCA",
    department: "Department of Computer Science & Applications",
    courseType: "Skill Enhancement (SEC)",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit III: Algorithmic Efficiency, Power Usage Effectiveness (PUE) & E-Waste Recycling",
    unitTitle: "Serverless Optimization, Sustainable AI Compute & E-Waste Management Rules 2022",
    syllabusExcerpt:
      "Measures to reduce carbon footprints of AI models and cloud data centers. Metrics: Power Usage Effectiveness (PUE) and Carbon Usage Effectiveness (CUE). Compliance with E-Waste (Management) Rules 2022, Extended Producer Responsibility (EPR), and circular economy in IT hardware.",
    highlightedKeywords: [
      "Power Usage Effectiveness (PUE)",
      "Sustainable AI Compute",
      "E-Waste Rules 2022",
      "Extended Producer Responsibility (EPR)",
      "Green Computing",
    ],
    contactHoursDevoted: 12,
    learningOutcomes:
      "Equips computer science graduates with sustainable software engineering practices and compliance knowledge for electronic waste management.",
    syllabusPdfUrl: "/documents/naac/crosscutting/CS_SEC301_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-env-08",
    courseCode: "COM-VAC202",
    courseTitle: "Corporate Environmental Responsibility & ESG Reporting Standards",
    programmeName: "B.Com. & BBA Programmes",
    department: "Department of Commerce",
    courseType: "Discipline Specific (DSE)",
    theme: "Environment & Sustainability",
    highlightedUnit: "Unit IV: SEBI Business Responsibility and Sustainability Reporting (BRSR)",
    unitTitle: "Scope 1, 2, 3 Emissions, Circular Economy Metrics & Greenwashing Audits",
    syllabusExcerpt:
      "SEBI circular on mandatory BRSR reporting for top 1000 listed entities. Measurement of Scope 1, 2, and 3 greenhouse gas emissions, water stewardship, circular economy index, GRI standards, and identifying fraudulent greenwashing in corporate disclosures.",
    highlightedKeywords: [
      "SEBI BRSR Standards",
      "Scope 1, 2, 3 Emissions",
      "Greenwashing Audits",
      "Water Stewardship",
      "Circular Economy",
    ],
    contactHoursDevoted: 12,
    learningOutcomes:
      "Commerce and management students gain hands-on proficiency in corporate ESG auditing, sustainability metrics, and non-financial reporting.",
    syllabusPdfUrl: "/documents/naac/crosscutting/COM_VAC202_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },

  // ---------------------------------------------------------
  // THEME 3: HUMAN VALUES & CONSTITUTIONAL RIGHTS (7 Courses)
  // ---------------------------------------------------------
  {
    id: "cc-val-01",
    courseCode: "AECC-VAL101",
    courseTitle: "Universal Human Values, Ethics and Social Harmony",
    programmeName: "All Undergraduate Programmes (Common Foundation)",
    department: "College IQAC & Department of Philosophy",
    courseType: "Ability Enhancement (AECC)",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit I & II: Self-Exploration, Harmony in Self, Family, Society and Nature",
    unitTitle: "Right Understanding, Trust, Respect, Co-existence & Humanistic Worldview",
    syllabusExcerpt:
      "Systematic study of human aspirational values based on AICTE/UGC guidelines: distinction between prosperity and wealth, self-regulation, building trust and respect in interpersonal relationships, social harmony, and mutual fulfillment in nature (Sarvodaya).",
    highlightedKeywords: [
      "Right Understanding",
      "Harmony in Society",
      "Universal Human Values",
      "Sarvodaya",
      "Co-existence in Nature",
    ],
    contactHoursDevoted: 20,
    learningOutcomes:
      "Nurtures ethical sensitivity, conflict-resolution capacity, and humanistic worldview among entering undergraduate students.",
    syllabusPdfUrl: "/documents/naac/crosscutting/AECC_VAL101_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-val-02",
    courseCode: "POL-CC101",
    courseTitle: "Indian Constitution, Fundamental Rights & Democratic Governance",
    programmeName: "B.A. Political Science (Honours) / Core Course",
    department: "Department of Political Science",
    courseType: "Core Course",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit II: Preamble, Fundamental Rights, Directive Principles & Fundamental Duties",
    unitTitle: "Justice, Liberty, Equality, Fraternity & Constitutional Morality",
    syllabusExcerpt:
      "Deep dive into the philosophy of the Preamble as articulated by Dr. B.R. Ambedkar. Analysis of Part III (Fundamental Rights: Freedom of Speech, Right to Life and Personal Liberty Art 21, Right to Education Art 21A), Directive Principles of State Policy, and Part IVA (Fundamental Duties Art 51A).",
    highlightedKeywords: [
      "Constitutional Morality",
      "Right to Life (Art 21)",
      "Directive Principles",
      "Fundamental Duties (Art 51A)",
      "Fraternity and Equality",
    ],
    contactHoursDevoted: 16,
    learningOutcomes:
      "Instills deep constitutional morality, respect for democratic institutions, and a lifelong commitment to civic duty and social justice.",
    syllabusPdfUrl: "/documents/naac/crosscutting/POL_CC101_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-val-03",
    courseCode: "ENG-CC102",
    courseTitle: "Human Rights Literature, Subaltern Voices & Postcolonial Ethics",
    programmeName: "B.A. English (Honours)",
    department: "Department of English",
    courseType: "Core Course",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit III: Universal Declaration of Human Rights & Post-Holocaust Literature",
    unitTitle: "Human Dignity, Inherent Rights, Refugee Crises & Testimony Narratives",
    syllabusExcerpt:
      "Readings on the Universal Declaration of Human Rights (UDHR 1948) alongside Elie Wiesel's 'Night', Primo Levi's reflections on human dignity, and contemporary narratives of migrant displacements. Examination of the ethical obligation to bear witness and uphold human compassion.",
    highlightedKeywords: [
      "Universal Declaration of Human Rights",
      "Human Dignity",
      "Bearing Witness",
      "Ethical Compassion",
      "Subaltern Voices",
    ],
    contactHoursDevoted: 15,
    learningOutcomes:
      "Develops empathy for marginalized and displaced populations and articulates humanitarian principles across cultural contexts.",
    syllabusPdfUrl: "/documents/naac/crosscutting/ENG_CC102_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-val-04",
    courseCode: "PHIL-GE201",
    courseTitle: "Peace Studies, Gandhian Philosophy & Non-Violent Conflict Resolution",
    programmeName: "B.A. All Disciplines (Generic Elective)",
    department: "Department of Philosophy",
    courseType: "Generic Elective (GE)",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit II: Ahimsa, Satyagraha and Swaraj in Contemporary Society",
    unitTitle: "Non-Violence as Moral Force, Constructive Programme & Inter-Faith Dialogue",
    syllabusExcerpt:
      "Philosophical examination of Mahatma Gandhi's concept of Ahimsa (non-violence) as an active moral force, Satyagraha (holding onto truth), and Swaraj (self-mastery). Relevance of non-violent resistance in environmental conservation (Chipko, Narmada Bachao) and inter-faith dialogue.",
    highlightedKeywords: [
      "Ahimsa (Non-Violence)",
      "Satyagraha",
      "Swaraj",
      "Inter-Faith Dialogue",
      "Constructive Programme",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Students learn non-adversarial conflict negotiation techniques and practice empathy and peaceful coexistence in diverse community settings.",
    syllabusPdfUrl: "/documents/naac/crosscutting/PHIL_GE201_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-val-05",
    courseCode: "BCA-VAL102",
    courseTitle: "Digital Civics, Social Responsibility & Online Empathy",
    programmeName: "Bachelor of Computer Applications (BCA)",
    department: "Department of Computer Science & Applications",
    courseType: "Skill Enhancement (SEC)",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit III: Cyber Bullying Prevention, Digital Footprints & Human Empathy Online",
    unitTitle: "Digital Hygiene, Misinformation Literacy & Humane Technology Design",
    syllabusExcerpt:
      "Psychological impacts of algorithmic echo chambers, toxic online behaviors, and cyber harassment. Design of humane technology systems that prioritize human emotional well-being, fact-checking methodologies to counter hate speech, and ethical responsibility of digital citizens.",
    highlightedKeywords: [
      "Humane Technology",
      "Cyber Bullying Prevention",
      "Misinformation Literacy",
      "Digital Civics",
      "Online Empathy",
    ],
    contactHoursDevoted: 12,
    learningOutcomes:
      "Graduates develop conscious digital citizenship habits, advocate for respectful online engagement, and design technology with human welfare at its center.",
    syllabusPdfUrl: "/documents/naac/crosscutting/BCA_VAL102_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-val-06",
    courseCode: "YRC-VAC101",
    courseTitle: "Community Health, First Aid, Humanitarian Service & Disaster Response",
    programmeName: "Youth Red Cross & NSS Unit (College Wide)",
    department: "Youth Red Cross Cell & NSS Unit",
    courseType: "Skill Enhancement (SEC)",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit II: Humanitarian Principles, Voluntary Blood Donation & Disaster Triage",
    unitTitle: "Red Cross Fundamental Principles: Humanity, Impartiality & Voluntary Service",
    syllabusExcerpt:
      "Seven Fundamental Principles of the International Red Cross Movement. Practical training in life-saving Cardiopulmonary Resuscitation (CPR), trauma triage during floods and road accidents, motivating voluntary blood donation, and empathetic care for elderly and differently-abled citizens.",
    highlightedKeywords: [
      "Principle of Humanity",
      "Voluntary Blood Donation",
      "Disaster Triage",
      "Empathetic Care",
      "First Aid Protocols",
    ],
    contactHoursDevoted: 30,
    learningOutcomes:
      "Instills a dedicated spirit of selfless public service, emergency civic readiness, and compassionate engagement with vulnerable groups.",
    syllabusPdfUrl: "/documents/naac/crosscutting/YRC_VAC101_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-val-07",
    courseCode: "HIS-CC201",
    courseTitle: "Social Reform Movements, Human Dignity & Democratic Thought in India",
    programmeName: "B.A. History (Honours)",
    department: "Department of History",
    courseType: "Core Course",
    theme: "Human Values & Constitutional Rights",
    highlightedUnit: "Unit III: Anti-Caste Movements, Jyotirao Phule, Periyar & Dr. Ambedkar",
    unitTitle: "Abolition of Untouchability, Human Dignity & Equal Rights Mobilizations",
    syllabusExcerpt:
      "Historical critique of caste hierarchy and social injustice. Examination of Jyotirao Phule's Satyashodhak Samaj, Savitribai Phule's pioneering girls' education, Periyar's Self-Respect Movement, and Dr. B.R. Ambedkar's Annihilation of Caste leading to Article 17 of the Constitution.",
    highlightedKeywords: [
      "Article 17 (Abolition of Untouchability)",
      "Human Dignity",
      "Self-Respect Movement",
      "Social Justice Pioneers",
      "Democratic Equality",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Deepens understanding of historic struggles for equal dignity and reinforces constitutional commitments against caste discrimination.",
    syllabusPdfUrl: "/documents/naac/crosscutting/HIS_CC201_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },

  // ---------------------------------------------------------
  // THEME 4: PROFESSIONAL ETHICS & INTEGRITY (7 Courses)
  // ---------------------------------------------------------
  {
    id: "cc-eth-01",
    courseCode: "CS-CC402",
    courseTitle: "Cyber Ethics, Intellectual Property Rights & Data Privacy Laws",
    programmeName: "B.Sc. Computer Science & MCA",
    department: "Department of Computer Science & Applications",
    courseType: "Core Course",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit IV: IT Act 2000, Digital Personal Data Protection Act 2023 & ACM Code of Ethics",
    unitTitle: "Software Licensing, Data Fiduciaries, Responsible AI & Ethical Hacking Protocols",
    syllabusExcerpt:
      "Legal obligations under the Digital Personal Data Protection (DPDP) Act 2023. Compliance for data fiduciaries, consent management, penalties for privacy breaches. ACM/IEEE Code of Professional Conduct: confidentiality, fair attribution in open-source software, whistleblowing, and ethical vulnerability disclosure.",
    highlightedKeywords: [
      "DPDP Act 2023",
      "ACM Code of Ethics",
      "Data Fiduciary Obligations",
      "Intellectual Property Rights",
      "Responsible AI Conduct",
    ],
    contactHoursDevoted: 16,
    learningOutcomes:
      "Equips computer science graduates to navigate complex digital privacy statutes, respect software copyright, and uphold professional integrity in software engineering.",
    syllabusPdfUrl: "/documents/naac/crosscutting/CS_CC402_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-eth-02",
    courseCode: "COM-CC303",
    courseTitle: "Corporate Governance, Business Ethics & Auditing Standards",
    programmeName: "Bachelor of Commerce (B.Com. Honours)",
    department: "Department of Commerce",
    courseType: "Core Course",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit III: Whistleblower Policies, Insider Trading & Independent Directors",
    unitTitle: "Satyam & Enron Case Analyses, SEBI LODR Regulations & Ethical Auditing",
    syllabusExcerpt:
      "Critical case analysis of corporate frauds (Enron, Satyam Computers, Wirecard). Role of Independent Directors, Audit Committees, and statutory auditors under Companies Act 2013. Implementation of vigil mechanisms, whistleblower protections, and adherence to ICAI Code of Ethics.",
    highlightedKeywords: [
      "Whistleblower Protection",
      "SEBI LODR Regulations",
      "ICAI Code of Ethics",
      "Corporate Governance",
      "Audit Independence",
    ],
    contactHoursDevoted: 16,
    learningOutcomes:
      "Instills unyielding commitment to transparency in financial reporting and prepares future accountants to resist commercial pressures.",
    syllabusPdfUrl: "/documents/naac/crosscutting/COM_CC303_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-eth-03",
    courseCode: "MGT-CC401",
    courseTitle: "Managerial Ethics, Corporate Stakeholder Responsibility & Fair Trade",
    programmeName: "Bachelor of Business Administration (BBA)",
    department: "Department of Management Studies",
    courseType: "Core Course",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit II: Ethical Decision-Making Models & Anti-Corruption Standards",
    unitTitle: "Conflict of Interest, Bribery Prevention, Supply Chain Transparency & Fair Trade",
    syllabusExcerpt:
      "Frameworks for resolving ethical dilemmas in competitive business environments. Examination of the Prevention of Corruption Act, Foreign Corrupt Practices Act principles, combating modern slavery in global supply chains, fair producer compensation, and honesty in marketing disclosures.",
    highlightedKeywords: [
      "Conflict of Interest",
      "Bribery Prevention",
      "Supply Chain Transparency",
      "Fair Trade Standards",
      "Ethical Decision-Making",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Equips business managers with principles-based leadership tools to conduct commerce with accountability, fairness, and stakeholder trust.",
    syllabusPdfUrl: "/documents/naac/crosscutting/MGT_CC401_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-eth-04",
    courseCode: "RES-VAC501",
    courseTitle: "Research Methodology, Publication Ethics & Anti-Plagiarism Standards",
    programmeName: "All Postgraduate Programmes (M.Sc., MCA, M.Com.)",
    department: "College IQAC & Research Committee",
    courseType: "Core Course",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit III: UGC Academic Integrity Regulations 2018 & Plagiarism Prevention",
    unitTitle: "Turnitin/Urkund Verification, Fabrication, Falsification, Authorship & COPE Guidelines",
    syllabusExcerpt:
      "UGC (Promotion of Academic Integrity and Prevention of Plagiarism in Higher Educational Institutions) Regulations, 2018. Definition and severity levels (Level 0 to 3 penalties) of plagiarism. Ethical guidelines on data fabrication, falsification (FFP), ghost authorship, predatory journal avoidance, and Committee on Publication Ethics (COPE) standards.",
    highlightedKeywords: [
      "UGC Plagiarism Regulations 2018",
      "Turnitin Verification",
      "COPE Guidelines",
      "Fabrication & Falsification (FFP)",
      "Predatory Journals Avoidance",
    ],
    contactHoursDevoted: 15,
    learningOutcomes:
      "Mandatory for all postgraduate dissertation candidates; ensures rigorous adherence to academic honesty and intellectual property conventions.",
    syllabusPdfUrl: "/documents/naac/crosscutting/RES_VAC501_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-eth-05",
    courseCode: "BCA-CC305",
    courseTitle: "Software Engineering & Professional Codes of Conduct",
    programmeName: "Bachelor of Computer Applications (BCA)",
    department: "Department of Computer Science & Applications",
    courseType: "Core Course",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit IV: Professional Responsibility in Software Deployment & Safety-Critical Systems",
    unitTitle: "Therac-25 Case Study, Algorithmic Bias & Developer Liability",
    syllabusExcerpt:
      "Historical case studies of safety-critical software failures (Therac-25 radiation accidents, Boeing 737 MAX MCAS). Ethical obligations of software architects regarding test coverage, refusing to ship buggy code under executive pressure, and eliminating demographic bias from automated scoring models.",
    highlightedKeywords: [
      "Therac-25 Case Study",
      "Safety-Critical Systems",
      "Algorithmic Bias",
      "Developer Whistleblowing",
      "Software Liability",
    ],
    contactHoursDevoted: 12,
    learningOutcomes:
      "Software engineers understand the life-and-death consequences of computational code and uphold non-negotiable software testing ethics.",
    syllabusPdfUrl: "/documents/naac/crosscutting/BCA_CC305_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-eth-06",
    courseCode: "CHEM-LAB302",
    courseTitle: "Laboratory Chemical Safety, Hazardous Waste Handling & Scientific Integrity",
    programmeName: "B.Sc. Chemistry & Industrial Chemistry",
    department: "Department of Chemistry",
    courseType: "Core Course",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit II: MSDS Sheets, Toxic Chemical Storage & Zero-Accident Protocols",
    unitTitle: "Material Safety Data Sheets (MSDS), Bio-Hazard Containment & Waste Neutralization",
    syllabusExcerpt:
      "Comprehensive laboratory ethics: reading and enforcing Material Safety Data Sheets (MSDS), chemical incompatibilities, emergency spill management, neutralisation of carcinogenic compounds prior to drainage, and maintaining honest, unaltered laboratory notebooks.",
    highlightedKeywords: [
      "MSDS Compliance",
      "Hazardous Waste Neutralization",
      "Zero-Accident Protocols",
      "Unaltered Laboratory Records",
      "Chemical Safety Ethics",
    ],
    contactHoursDevoted: 12,
    learningOutcomes:
      "Instills strict scientific discipline, zero-tolerance for unsafe chemical disposal, and uncompromised integrity in empirical data recording.",
    syllabusPdfUrl: "/documents/naac/crosscutting/CHEM_LAB302_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
  {
    id: "cc-eth-07",
    courseCode: "BOT-DSE402",
    courseTitle: "Bioethics, Genetic Engineering Regulations & Plant Patent Rights",
    programmeName: "B.Sc. Botany & Biotechnology",
    department: "Department of Botany",
    courseType: "Discipline Specific (DSE)",
    theme: "Professional Ethics & Integrity",
    highlightedUnit: "Unit IV: Genetically Modified Organisms (GMOs), Biopiracy & Traditional Knowledge",
    unitTitle: "Cartagena Protocol on Biosafety, Neem/Turmeric Patent Battles & TKDL",
    syllabusExcerpt:
      "Ethical dilemmas in genetic modification (Bt Cotton, Golden Rice), bio-safety clearance procedures through GEAC. International battles against biopiracy (Neem and Turmeric patent revocations), Protection of Plant Varieties and Farmers' Rights (PPVFR) Act, and the Traditional Knowledge Digital Library (TKDL).",
    highlightedKeywords: [
      "Cartagena Protocol on Biosafety",
      "Biopiracy Prevention",
      "Traditional Knowledge Digital Library",
      "Farmers' Rights Act",
      "Bioethics in Biotechnology",
    ],
    contactHoursDevoted: 14,
    learningOutcomes:
      "Prepares life science researchers to conduct genetic research responsibly, respect indigenous community knowledge, and prevent exploitative patenting.",
    syllabusPdfUrl: "/documents/naac/crosscutting/BOT_DSE402_Syllabus.pdf",
    evidenceId: "evi-131-mapping-01",
  },
];

export const initialCrosscuttingActivities: CrosscuttingCoCurricularActivity[] = [
  {
    id: "act-icc-01",
    title: "Annual Gender Equity Symposium & Workshop on POSH Act Compliance",
    theme: "Gender Sensitization & Equity",
    organizingCell: "Internal Complaints Committee (ICC) & Gender Sensitization Cell",
    eventDate: "2026-03-08",
    academicYear: "2025-26",
    participantsCount: 420,
    outcomeSummary:
      "Interactive legal workshop addressed by Advocate Reeta Mohapatra (High Court of Odisha) on student rights, cyber stalking prevention, and internal ICC reporting channels.",
    reportUrl: "/documents/naac/evidence/ICC_Gender_Equity_Symposium_Report_2026.pdf",
    evidenceId: "evi-131-reports-01",
  },
  {
    id: "act-eco-01",
    title: "Campus Carbon Footprint Assessment & Miyawaki Micro-Forest Afforestation Drive",
    theme: "Environment & Sustainability",
    organizingCell: "Eco Club & Green Campus Monitoring Cell",
    eventDate: "2025-09-16",
    academicYear: "2025-26",
    participantsCount: 380,
    outcomeSummary:
      "Planted 850 native saplings in a dense Miyawaki micro-forest patch. Audited campus single-use plastic eradication with student green volunteers.",
    reportUrl: "/documents/naac/evidence/Green_Audit_Miyawaki_Drive_Report_2025.pdf",
    evidenceId: "evi-131-reports-01",
  },
  {
    id: "act-val-01",
    title: "National Constitution Day Colloquium on Democratic Morality & Citizen Duties",
    theme: "Human Values & Constitutional Rights",
    organizingCell: "Department of Political Science & Electoral Literacy Club",
    eventDate: "2025-11-26",
    academicYear: "2025-26",
    participantsCount: 510,
    outcomeSummary:
      "Collective reading of the Preamble, youth voter pledge, and inter-collegiate debate on 'Fundamental Rights and Citizen Responsibilities in Digital India'.",
    reportUrl: "/documents/naac/evidence/Constitution_Day_Colloquium_2025.pdf",
    evidenceId: "evi-131-reports-01",
  },
  {
    id: "act-eth-01",
    title: "Academic Integrity, Anti-Plagiarism Software & Research Ethics Workshop",
    theme: "Professional Ethics & Integrity",
    organizingCell: "College IQAC & Research Ethics Board",
    eventDate: "2025-12-14",
    academicYear: "2025-26",
    participantsCount: 290,
    outcomeSummary:
      "Hands-on training for PG and final year UG dissertation students on Turnitin similarity index, citation ethics, and avoiding predatory publishers.",
    reportUrl: "/documents/naac/evidence/Research_Ethics_Workshop_Report_2025.pdf",
    evidenceId: "evi-131-reports-01",
  },
  {
    id: "act-yrc-01",
    title: "Mega Voluntary Blood Donation Camp & Disaster First-Aid Simulation",
    theme: "Human Values & Constitutional Rights",
    organizingCell: "Youth Red Cross (YRC) & NSS Unit",
    eventDate: "2026-01-20",
    academicYear: "2025-26",
    participantsCount: 460,
    outcomeSummary:
      "Collected 214 units of voluntary blood in collaboration with Capital Hospital Red Cross Blood Centre; certified 150 student first-responders.",
    reportUrl: "/documents/naac/evidence/YRC_Blood_Donation_Report_2026.pdf",
    evidenceId: "evi-131-reports-01",
  },
  {
    id: "act-cyber-01",
    title: "Digital Safety, IPR Awareness & Cyber Ethics Training Camp",
    theme: "Professional Ethics & Integrity",
    organizingCell: "Department of Computer Science & Cyber Security Cell",
    eventDate: "2026-02-18",
    academicYear: "2025-26",
    participantsCount: 400,
    outcomeSummary:
      "Live demonstrations by Odisha Cyber Crime Police Unit on preventing phishing scams, protecting financial OTPs, and ethical software utilization.",
    reportUrl: "/documents/naac/evidence/Cyber_Ethics_Training_Report_2026.pdf",
    evidenceId: "evi-131-reports-01",
  },
];

export const getCrosscuttingSummaryData = (): CrosscuttingSummaryData => {
  const totalMappedCourses = initialCrosscuttingCourseMappings.length; // 28
  const gender = initialCrosscuttingCourseMappings.filter(
    (c) => c.theme === "Gender Sensitization & Equity"
  ).length; // 6
  const environment = initialCrosscuttingCourseMappings.filter(
    (c) => c.theme === "Environment & Sustainability"
  ).length; // 8
  const humanValues = initialCrosscuttingCourseMappings.filter(
    (c) => c.theme === "Human Values & Constitutional Rights"
  ).length; // 7
  const professionalEthics = initialCrosscuttingCourseMappings.filter(
    (c) => c.theme === "Professional Ethics & Integrity"
  ).length; // 7

  const totalActivities = initialCrosscuttingActivities.length;
  const totalParticipants = initialCrosscuttingActivities.reduce(
    (acc, a) => acc + a.participantsCount,
    0
  );

  return {
    totalMappedCourses,
    programmesCoveredPercentage: 100.0,
    coursesByTheme: {
      gender,
      environment,
      humanValues,
      professionalEthics,
    },
    totalActivities,
    totalParticipants,
    courseMappings: initialCrosscuttingCourseMappings,
    activities: initialCrosscuttingActivities,
  };
};
