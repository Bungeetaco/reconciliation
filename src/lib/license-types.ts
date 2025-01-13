// src/lib/license-types.ts

export interface SKUPricing {
  monthlyPrice: number;
  annualPrice: number;
  description: string;
}

export interface SKUMapping {
  [key: string]: string;
}

export const SKU_PRICING: { [key: string]: SKUPricing } = {
  '639dec6b-bb19-468b-871c-c5c441c4b0cb': { monthlyPrice: 34.60, annualPrice: 415.20, description: 'M365 Copilot Sub Add-on' },
  '06ebc4ee-1bb5-47dd-8120-11324bc54e06': { monthlyPrice: 30.94, annualPrice: 371.28, description: 'M365 E5 Unified Existing Customer Sub Per User' },
  '4b585984-651b-448a-9e53-3b10f069cf7f': { monthlyPrice: 0.00, annualPrice: 0.00, description: 'M365 F3 FUSL Sub Per User' },
  '18181a46-0d4e-45cd-891e-60aabd171b4e': { monthlyPrice: 0.00, annualPrice: 0.00, description: 'O365 E1 Existing Customer Sub Per User' },
  '440eaaa8-b3e0-484b-a8be-62870b9ba70a': { monthlyPrice: 0.00, annualPrice: 0.00, description: 'Phone Resource Account Sub Phone System Virtual User' },
  '5b631642-bd26-49fe-bd20-1daaa972ef80': { monthlyPrice: 3.39, annualPrice: 40.68, description: 'Power Apps Per App Sub 1 App or Website' },
  'eda1941c-3c4f-4995-b5eb-e85a42175ab9': { monthlyPrice: 5.09, annualPrice: 61.08, description: 'Power Automate Premium Sub Per User' },
  '53818b1b-4a27-454b-8896-0dba576410e6': { monthlyPrice: 13.84, annualPrice: 166.08, description: 'Project P3 Sub Per User' },
  '11dee6af-eca8-419f-8061-6864517c1875': { monthlyPrice: 8.13, annualPrice: 97.56, description: 'Teams Domestic Calling Plan Sub (120 Min Per User)' },
  '52ea0e27-ae73-4983-a08f-13561ebdb823': { monthlyPrice: 3.80, annualPrice: 45.60, description: 'Teams Premium Introductory Pricing Sub Per User' },
  '6070a4c8-34c6-4937-8dfb-39bbc6397a60': { monthlyPrice: 13.57, annualPrice: 162.84, description: 'Teams Rooms Pro Sub Per Device' },
  '295a8eb0-f78d-45c7-8b5b-1eed5ed02dff': { monthlyPrice: 3.69, annualPrice: 44.28, description: 'Teams Shared Devices Sub Per Device' },
  '4b244418-9658-4451-a2b8-b5e2b364e9bd': { monthlyPrice: 2.31, annualPrice: 27.72, description: 'Visio P1 Sub Per User' },
  'c5928f49-12ba-48f7-ada3-0d743a3601d5': { monthlyPrice: 6.92, annualPrice: 83.04, description: 'Visio P2 Sub Per User' },
  '2880026b-2b0c-4251-8656-5d41ff11e3aa': { monthlyPrice: 120.00, annualPrice: 1440.00, description: 'SR365 Full' },
  '7ac9fe77-66b7-4e5e-9e46-10eed1cff547': { monthlyPrice: 3.00, annualPrice: 36.00, description: 'SR365 Teams' },
  '9a1e33ed-9697-43f3-b84c-1b0959dbb1d4': { monthlyPrice: 15.42, annualPrice: 185.00, description: 'SR365 Manager' }
};

export const SKU_MAPPING: SKUMapping = {
  'e43b5b99-8dfb-405f-9987-dc307f34bcbd': 'MICROSOFT 365 PHONE SYSTEM',
  '9a1e33ed-9697-43f3-b84c-1b0959dbb1d4': 'SR365 Manager',
  '06ebc4ee-1bb5-47dd-8120-11324bc54e06': 'Microsoft 365 E5',
  '1e1a282c-9c54-43a2-9310-98ef728faace': 'DYNAMICS 365 FOR SALES ENTERPRISE EDITION',
  '11dee6af-eca8-419f-8061-6864517c1875': 'MICROSOFT 365 DOMESTIC CALLING PLAN (120 Minutes)',
  'f30db892-07e9-47e9-837c-80727f46fd3d': 'MICROSOFT FLOW FREE',
  '2880026b-2b0c-4251-8656-5d41ff11e3aa': 'SR365 Full',
  '2e3c4023-80f6-4711-aa5d-29e0ecb46835': 'AZURE ACTIVE DIRECTORY PREMIUM P1',
  'a403ebcc-fae0-4ca2-8c8c-7a907fd6c235': 'Power BI (free)',
  '53818b1b-4a27-454b-8896-0dba576410e6': 'Project Plan 3',
  '639dec6b-bb19-468b-871c-c5c441c4b0cb': 'Copilot for Microsoft 365',
  '18181a46-0d4e-45cd-891e-60aabd171b4e': 'OFFICE 365 E1',
  '4b585984-651b-448a-9e53-3b10f069cf7f': 'OFFICE 365 F3',
  '5b631642-bd26-49fe-bd20-1daaa972ef80': 'Microsoft Power Apps for Developer',
  '4b244418-9658-4451-a2b8-b5e2b364e9bd': 'VISIO ONLINE PLAN 1',
  'c5928f49-12ba-48f7-ada3-0d743a3601d5': 'VISIO ONLINE PLAN 2',
  '47794cd0-f0e5-45c5-9033-2eb6b5fc84e0': 'COMMUNICATIONS CREDITS',
  '440eaaa8-b3e0-484b-a8be-62870b9ba70a': 'Microsoft Teams Phone Resource Account',
  'eda1941c-3c4f-4995-b5eb-e85a42175ab9': 'Power Automate Premium',
  '3f9f06f5-3c31-472c-985f-62d9c10ec167': 'Power Pages vTrial for Makers',
  '606b54a9-78d8-4298-ad8b-df6ef4481c80': 'Power Virtual Agents Viral Trial',
  '238e2f8d-e429-4035-94db-6926be4ffe7b': 'Dynamics 365 for Marketing Business Edition',
  '52ea0e27-ae73-4983-a08f-13561ebdb823': 'Teams Premium (for Departments)',
  '295a8eb0-f78d-45c7-8b5b-1eed5ed02dff': 'Microsoft Teams Shared Devices',
  '6070a4c8-34c6-4937-8dfb-39bbc6397a60': 'Microsoft Teams Rooms Standard',
  '7ac9fe77-66b7-4e5e-9e46-10eed1cff547': 'SR365 Teams'
};