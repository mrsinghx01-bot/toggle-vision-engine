// Central configuration. Replace placeholders as real details become available.

export const site = {
  name: "Toggle",
  domain: "toggle.com",
  tagline: "Ideas → Intelligence → Hardware",
  description:
    "Toggle is building an AI-powered platform that helps transform ideas into electronic designs, circuits, and PCBs.",
  contactEmail: "[CONTACT_EMAIL]",
  joinUrl: "[JOIN_URL]",
} as const;

export const nav = [
  { label: "Vision", href: "#vision" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Technology", href: "#technology" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "About", href: "#about" },
] as const;

export const socials: { label: string; url: string | null }[] = [
  { label: "GitHub", url: null },
  { label: "LinkedIn", url: null },
  { label: "X", url: null },
];

export const problemChain = [
  "Idea",
  "Requirements",
  "Component Research",
  "Circuit Design",
  "Schematic",
  "PCB Layout",
  "Routing",
  "Validation",
  "Prototype",
  "Manufacturing",
] as const;

export const workflowSteps = [
  {
    id: 1,
    title: "Understanding Requirements",
    detail: "Parsing intent into structured specifications.",
    items: [
      "sensing: temperature, humidity",
      "connectivity: wi-fi 2.4GHz",
      "power: usb-c + li-ion",
      "form factor: compact",
    ],
  },
  {
    id: 2,
    title: "Selecting Components",
    detail: "Matching specifications to candidate parts.",
    items: [
      "MCU — wireless SoC",
      "Sensor — temp / humidity",
      "Wi-Fi module",
      "USB-C connector",
      "Battery management",
      "Capacitors",
      "Resistors",
    ],
  },
  {
    id: 3,
    title: "Generating Circuit",
    detail: "Building nets, power rails and interfaces.",
    items: ["3V3 rail", "I²C bus", "USB D+/D−", "battery charge path", "decoupling network"],
  },
  {
    id: 4,
    title: "Creating Schematic",
    detail: "Placing symbols, labelling nets, annotating references.",
    items: ["U1 · U2 · U3", "J1 USB-C", "C1–C9", "R1–R6", "net labels assigned"],
  },
  {
    id: 5,
    title: "Laying Out PCB",
    detail: "Placement, layer assignment and routing.",
    items: ["4-layer stackup", "component placement", "copper routing", "ground plane"],
  },
  {
    id: 6,
    title: "Validating Design",
    detail: "Checking the design against rules and constraints.",
    items: [
      "Connections verified",
      "Design rules checked",
      "Power requirements analyzed",
      "Component compatibility checked",
    ],
  },
  {
    id: 7,
    title: "Ready for the next step.",
    detail: "A design a human engineer can review, edit and own.",
    items: [],
  },
] as const;

export const capabilities = [
  {
    index: "01",
    title: "AI-Native",
    body: "AI is not an add-on. It is built into the design workflow from the first sentence.",
  },
  {
    index: "02",
    title: "Requirement → Circuit",
    body: "Translate human requirements into structured electronic design decisions.",
  },
  {
    index: "03",
    title: "Intelligent Design",
    body: "Assistance across component selection, connectivity, layout, optimization and validation.",
  },
  {
    index: "04",
    title: "Human + AI",
    body: "AI handles complexity. Humans make the decisions that matter.",
  },
] as const;

export const techLayers = [
  { title: "Natural Language", sub: "Human intent" },
  { title: "Requirement Understanding", sub: "Structured specifications" },
  { title: "Circuit Intelligence", sub: "Components + connectivity" },
  { title: "Design Generation", sub: "Schematic + topology" },
  { title: "PCB Intelligence", sub: "Placement + routing" },
  { title: "Validation", sub: "Rules + constraints" },
  { title: "Optimization", sub: "Size + cost + performance" },
] as const;

export const horizon = [
  { when: "Today", what: "AI-assisted PCB design" },
  { when: "Next", what: "Simulation & intelligent validation" },
  { when: "Then", what: "Automated optimization" },
  { when: "Future", what: "Prototype workflows" },
  { when: "Eventually", what: "Manufacturing integration" },
  { when: "Vision", what: "A complete AI-native hardware creation platform" },
] as const;

export const roadmap = [
  {
    phase: "Phase 01",
    title: "Foundation",
    items: [
      "Product concept",
      "AI design workflow",
      "Interactive prototype",
      "PCB visualization",
    ],
  },
  {
    phase: "Phase 02",
    title: "Intelligence",
    items: [
      "Requirement understanding",
      "Component intelligence",
      "Circuit generation",
      "Design assistance",
    ],
  },
  {
    phase: "Phase 03",
    title: "Engineering",
    items: ["Simulation", "Validation", "Optimization", "Manufacturing constraints"],
  },
  {
    phase: "Phase 04",
    title: "Ecosystem",
    items: ["Prototyping", "Manufacturing", "Collaboration", "Hardware lifecycle"],
  },
] as const;

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  github: string | null;
  linkedin: string | null;
};

export const team: TeamMember[] = [
  {
    name: "[FOUNDER_NAME]",
    role: "Founder / Product & Engineering",
    bio: "Started Toggle after one too many nights redrawing the same power supply by hand.",
    github: null,
    linkedin: null,
  },
  {
    name: "[TEAM_MEMBER_NAME]",
    role: "[TEAM_MEMBER_ROLE]",
    bio: "Works on how requirements become circuits — the part where language turns into nets.",
    github: null,
    linkedin: null,
  },
  {
    name: "[TEAM_MEMBER_NAME]",
    role: "[TEAM_MEMBER_ROLE]",
    bio: "Focused on layout intelligence: placement, routing and the geometry of real boards.",
    github: null,
    linkedin: null,
  },
];

export const pcbComponents = [
  {
    id: "U1",
    label: "MCU",
    name: "Wireless MCU",
    spec: ["Type: SoC + Wi-Fi", "Power: 3.3V", "Bus: I²C / SPI / UART"],
    x: 40,
    y: 38,
    w: 26,
    h: 22,
    kind: "ic" as const,
  },
  {
    id: "U2",
    label: "SENS",
    name: "Temp / Humidity Sensor",
    spec: ["Interface: I²C", "Power: 3.3V", "Addr: 0x44"],
    x: 76,
    y: 26,
    w: 12,
    h: 10,
    kind: "ic" as const,
  },
  {
    id: "U3",
    label: "PMIC",
    name: "Battery Management",
    spec: ["Charge: Li-ion 1-cell", "Input: 5V USB", "Output: 3.3V"],
    x: 16,
    y: 66,
    w: 16,
    h: 12,
    kind: "ic" as const,
  },
  {
    id: "J1",
    label: "USB-C",
    name: "USB-C Receptacle",
    spec: ["Power: 5V / 1.5A", "Data: USB 2.0", "Orientation: reversible"],
    x: 6,
    y: 40,
    w: 10,
    h: 18,
    kind: "connector" as const,
  },
  {
    id: "ANT1",
    label: "ANT",
    name: "2.4GHz PCB Antenna",
    spec: ["Type: inverted-F", "Band: 2.4GHz", "Keepout: required"],
    x: 78,
    y: 62,
    w: 18,
    h: 8,
    kind: "antenna" as const,
  },
  {
    id: "D1",
    label: "LED",
    name: "Status Indicator",
    spec: ["Color: green", "If: 5mA", "Net: STATUS"],
    x: 60,
    y: 74,
    w: 6,
    h: 5,
    kind: "passive" as const,
  },
  {
    id: "C1",
    label: "C1",
    name: "Decoupling Capacitor",
    spec: ["Value: 100nF", "Package: 0402", "Net: 3V3"],
    x: 34,
    y: 24,
    w: 5,
    h: 4,
    kind: "passive" as const,
  },
  {
    id: "R3",
    label: "R3",
    name: "Pull-up Resistor",
    spec: ["Value: 4.7kΩ", "Package: 0402", "Net: SDA"],
    x: 68,
    y: 44,
    w: 5,
    h: 4,
    kind: "passive" as const,
  },
  {
    id: "BT1",
    label: "BATT",
    name: "Battery Connector",
    spec: ["Cell: Li-ion 3.7V", "Pins: 2", "Net: VBAT"],
    x: 20,
    y: 22,
    w: 14,
    h: 8,
    kind: "connector" as const,
  },
];
