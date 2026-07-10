export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  purchasePrice: number;
  monthlyRent: number;
  monthlyExpenses: number;
  downPayment: number;
  mortgageRate: number;
  loanTermYears: number;
  vacancyRate: number;
  status: "owned" | "evaluating" | "under-contract";
  acquiredDate: string;
  tenant: string;
  sqft: number;
  beds: number;
  baths: number;
}

export interface CompRent {
  address: string;
  distance: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  source: string;
  listedDate: string;
}

export interface ActivityItem {
  id: string;
  type: "report" | "scenario" | "memo" | "comp" | "alert";
  message: string;
  timestamp: string;
  property?: string;
}

export interface PortfolioProperty extends Property {
  monthlyCashFlow: number;
  capRate: number;
  cashOnCash: number;
  annualNOI: number;
}

export const DEMO_PROPERTY: Property = {
  id: "prop-001",
  address: "1847 Maple Ridge Dr",
  city: "Austin",
  state: "TX",
  purchasePrice: 385000,
  monthlyRent: 2450,
  monthlyExpenses: 1180,
  downPayment: 77000,
  mortgageRate: 6.75,
  loanTermYears: 30,
  vacancyRate: 5,
  status: "evaluating",
  acquiredDate: "2026-03-15",
  tenant: "Vacant — showing scheduled",
  sqft: 1840,
  beds: 3,
  baths: 2,
};

export const PORTFOLIO_PROPERTIES: PortfolioProperty[] = [
  {
    id: "prop-101",
    address: "742 Evergreen Terrace",
    city: "Round Rock",
    state: "TX",
    purchasePrice: 312000,
    monthlyRent: 2100,
    monthlyExpenses: 890,
    downPayment: 62400,
    mortgageRate: 6.25,
    loanTermYears: 30,
    vacancyRate: 3,
    status: "owned",
    acquiredDate: "2023-08-12",
    tenant: "Chen Family (lease thru Dec 2026)",
    sqft: 1620,
    beds: 3,
    baths: 2,
    monthlyCashFlow: 412,
    capRate: 4.65,
    cashOnCash: 7.92,
    annualNOI: 14520,
  },
  {
    id: "prop-102",
    address: "2201 Riverside Blvd #4B",
    city: "Austin",
    state: "TX",
    purchasePrice: 265000,
    monthlyRent: 1850,
    monthlyExpenses: 1020,
    downPayment: 53000,
    mortgageRate: 5.875,
    loanTermYears: 30,
    vacancyRate: 8,
    status: "owned",
    acquiredDate: "2022-04-03",
    tenant: "Martinez & Patel (month-to-month)",
    sqft: 1180,
    beds: 2,
    baths: 2,
    monthlyCashFlow: 186,
    capRate: 3.76,
    cashOnCash: 4.21,
    annualNOI: 9960,
  },
  {
    id: "prop-103",
    address: "915 Oak Hollow Ln",
    city: "Pflugerville",
    state: "TX",
    purchasePrice: 428000,
    monthlyRent: 2890,
    monthlyExpenses: 1340,
    downPayment: 85600,
    mortgageRate: 6.5,
    loanTermYears: 30,
    vacancyRate: 4,
    status: "owned",
    acquiredDate: "2024-01-22",
    tenant: "Williams Trust (2-yr lease)",
    sqft: 2100,
    beds: 4,
    baths: 2.5,
    monthlyCashFlow: 528,
    capRate: 4.35,
    cashOnCash: 7.41,
    annualNOI: 18600,
  },
  {
    id: "prop-104",
    address: "1847 Maple Ridge Dr",
    city: "Austin",
    state: "TX",
    purchasePrice: 385000,
    monthlyRent: 2450,
    monthlyExpenses: 1180,
    downPayment: 77000,
    mortgageRate: 6.75,
    loanTermYears: 30,
    vacancyRate: 5,
    status: "evaluating",
    acquiredDate: "2026-03-15",
    tenant: "Vacant — showing scheduled",
    sqft: 1840,
    beds: 3,
    baths: 2,
    monthlyCashFlow: 340,
    capRate: 3.95,
    cashOnCash: 5.29,
    annualNOI: 15240,
  },
  {
    id: "prop-105",
    address: "3308 Cedar Park Way",
    city: "Cedar Park",
    state: "TX",
    purchasePrice: 298000,
    monthlyRent: 1925,
    monthlyExpenses: 960,
    downPayment: 59600,
    mortgageRate: 6.125,
    loanTermYears: 30,
    vacancyRate: 6,
    status: "under-contract",
    acquiredDate: "2026-04-01",
    tenant: "Pending close — est. May 15",
    sqft: 1540,
    beds: 3,
    baths: 2,
    monthlyCashFlow: 278,
    capRate: 3.89,
    cashOnCash: 5.59,
    annualNOI: 11580,
  },
];

export const COMP_RENTS: CompRent[] = [
  {
    address: "1822 Maple Ridge Dr",
    distance: "0.1 mi",
    rent: 2395,
    beds: 3,
    baths: 2,
    sqft: 1780,
    source: "Zillow Rent Zestimate",
    listedDate: "2026-02-28",
  },
  {
    address: "1860 Maple Ridge Dr",
    distance: "0.2 mi",
    rent: 2525,
    beds: 3,
    baths: 2,
    sqft: 1900,
    source: "Rentometer",
    listedDate: "2026-03-01",
  },
  {
    address: "910 Willow Creek Ct",
    distance: "0.4 mi",
    rent: 2280,
    beds: 3,
    baths: 2,
    sqft: 1720,
    source: "Craigslist (scraped)",
    listedDate: "2026-02-15",
  },
  {
    address: "1755 Ridgeview Ave",
    distance: "0.5 mi",
    rent: 2590,
    beds: 3,
    baths: 2.5,
    sqft: 1950,
    source: "Apartments.com",
    listedDate: "2026-01-20",
  },
  {
    address: "2010 Barton Springs Rd",
    distance: "0.7 mi",
    rent: 2410,
    beds: 3,
    baths: 2,
    sqft: 1800,
    source: "HUD FMR benchmark",
    listedDate: "2026-Q1",
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: "act-1",
    type: "report",
    message: "AI verdict generated for 1847 Maple Ridge Dr — below-market cap rate flagged",
    timestamp: "2026-03-14T09:32:00Z",
    property: "1847 Maple Ridge Dr",
  },
  {
    id: "act-2",
    type: "comp",
    message: "Fetched 5 rent comps within 0.7 mi — median $2,440/mo",
    timestamp: "2026-03-14T09:31:45Z",
    property: "1847 Maple Ridge Dr",
  },
  {
    id: "act-3",
    type: "scenario",
    message: "What-if run: +10% rent → cash flow rises to $585/mo",
    timestamp: "2026-03-13T16:18:00Z",
    property: "915 Oak Hollow Ln",
  },
  {
    id: "act-4",
    type: "memo",
    message: "PDF deal memo shared with Pacific Crest Lending (3 recipients)",
    timestamp: "2026-03-12T11:05:00Z",
    property: "3308 Cedar Park Way",
  },
  {
    id: "act-5",
    type: "alert",
    message: "742 Evergreen Terrace cap rate dropped 0.3% — insurance renewal impact",
    timestamp: "2026-03-11T08:44:00Z",
    property: "742 Evergreen Terrace",
  },
  {
    id: "act-6",
    type: "report",
    message: "Portfolio ranked: Oak Hollow leads at 7.41% cash-on-cash",
    timestamp: "2026-03-10T14:22:00Z",
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

export function calculateMetrics(property: Property) {
  const loanAmount = property.purchasePrice - property.downPayment;
  const mortgage = calculateMortgagePayment(
    loanAmount,
    property.mortgageRate,
    property.loanTermYears
  );
  const effectiveRent =
    property.monthlyRent * (1 - property.vacancyRate / 100);
  const monthlyCashFlow =
    effectiveRent - property.monthlyExpenses - mortgage;
  const annualNOI =
    (property.monthlyRent * 12 * (1 - property.vacancyRate / 100)) -
    property.monthlyExpenses * 12;
  const capRate = (annualNOI / property.purchasePrice) * 100;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCash = (annualCashFlow / property.downPayment) * 100;

  return {
    mortgage,
    monthlyCashFlow,
    annualNOI,
    capRate,
    cashOnCash,
    effectiveRent,
  };
}

export const AI_VERDICT = `**Verdict: Proceed with caution — positive cash flow, but cap rate trails the submarket.**

This property at 1847 Maple Ridge Dr cash flows **$340/mo** after debt service, vacancy allowance (5%), and your stated operating expenses. That's workable — but your **3.95% cap rate** sits **0.6 points below** the Austin 78745 submarket median of **4.55%** for similar 3/2 SFRs.

**Why the gap matters:** Your $1,180/mo expense line includes a conservative $320/mo maintenance reserve. Comps in the 0.5 mi radius rent for a median **$2,440/mo** — you're modeling $2,450, which is fair. The cap rate drag comes primarily from purchase price: at $385K you're paying **$209/sqft** vs. comp average of **$198/sqft**.

**Comparable rent check:** Five public listings within 0.7 mi support your rent assumption. The highest comp (1755 Ridgeview) at $2,590 has 2.5 baths — your 2-bath unit is appropriately discounted.

**Recommendation:** Negotiate toward **$372K** (4.2% cap at current rents) or confirm you can push rent to **$2,575/mo** post-light renovation ($8–12K cosmetic). At $2,575 rent, cash flow jumps to **$465/mo** and cap rate hits **4.35%** — in line with your Oak Hollow holding.

**Lender memo angle:** Debt coverage ratio is **1.28x** — acceptable for most DSCR products at 75% LTV.`;

export const DEAL_MEMO_CONTENT = {
  title: "Investment Deal Memo",
  property: "1847 Maple Ridge Dr, Austin, TX 78745",
  preparedFor: "Pacific Crest Capital Partners",
  preparedBy: "Marcus Delgado — Delgado Holdings LLC",
  date: "March 14, 2026",
  executiveSummary:
    "Single-family rental acquisition in established South Austin corridor. Property projects $340/mo net cash flow at 20% down, with rent supported by five nearby comps. Cap rate of 3.95% is below submarket median; price negotiation or rent upside required for institutional-grade returns.",
  keyMetrics: [
    { label: "Purchase Price", value: "$385,000" },
    { label: "Down Payment (20%)", value: "$77,000" },
    { label: "Monthly Rent", value: "$2,450" },
    { label: "Monthly Expenses", value: "$1,180" },
    { label: "Net Cash Flow", value: "$340/mo" },
    { label: "Cap Rate", value: "3.95%" },
    { label: "Cash-on-Cash Return", value: "5.29%" },
    { label: "DSCR", value: "1.28x" },
  ],
  risks: [
    "Cap rate 60 bps below submarket — limited appreciation cushion if rents soften",
    "6.75% rate environment increases refi risk in years 3–5",
    "Property vacant at acquisition — 30–45 day lease-up assumed",
  ],
  opportunities: [
    "Cosmetic refresh ($8–12K) could support $125/mo rent premium per comp analysis",
    "78745 submarket vacancy at 4.2% — below metro average",
    "Strong school district (Bowie HS) supports tenant quality and retention",
  ],
};
