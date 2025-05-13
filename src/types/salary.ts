export interface BaseSalary {
  basePay: number;          // 底薪(應稅)
  allowances: number;       // 交通/加班/津貼等(應稅)
  mealAllowance: number;    // 伙食費(免稅)
  laborInsurance: number;   // 勞保
  groupInsurance: number;   // 團保
  healthInsurance: number;  // 健保
  welfareFund: number;      // 福利金
  laborPensionTier: number; // 勞退級距
  voluntaryPensionRate: number; // 自主勞退提撥比率
}

export interface Bonus {
  id: string;
  name: string;
  amount: number;           // 獎金金額
  incomeTax: number;       // 代扣所得稅
  secondGenerationNHI: number; // 二代健保
}

export interface Benefit {
  id: string;
  name: string;
  amount: number;
  isTaxable: boolean;
}

export interface SalaryCalculation {
  totalSalary: number;      // 全薪
  actualSalary: number;     // 實領
  voluntaryPension: number; // 自主勞退提撥
  employerPension: number;  // 雇主勞退提撥
}

export interface TotalCalculation {
  taxableBenefits: number;    // 福利-課稅
  nonTaxableBenefits: number; // 福利-免稅
  yearlyMealAllowance: number; // 整年伙食費(免稅)
  totalSalaryIncome: number;   // 薪資所得總額
  totalVoluntaryPension: number; // 自提退休金總額
  taxableIncome: number;        // 稅單收入給付總額
  totalTaxWithheld: number;     // 稅單扣繳稅額總額
  netPayment: number;           // 給付淨額
  totalSecondGenerationNHI: number; // 二代健保總額
  annualSalary: number;         // 年薪
  totalBenefits: number;        // 福利金額
  benefitsToSalaryRatio: number; // 福利佔年薪比例
} 