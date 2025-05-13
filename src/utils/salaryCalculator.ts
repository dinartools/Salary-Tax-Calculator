import { BaseSalary, Bonus, Benefit, SalaryCalculation, TotalCalculation } from '../types/salary';

export const calculateSalaryDetails = (
  baseSalary: BaseSalary,
  bonuses: Bonus[],
  benefits: Benefit[]
): { salaryCalc: SalaryCalculation; totalCalc: TotalCalculation } => {
  // 確保所有欄位都是 number 型別
  const safeNumber = (v: any) => typeof v === 'number' && !isNaN(v) ? v : 0;
  const basePay = safeNumber(baseSalary.basePay);
  const allowances = safeNumber(baseSalary.allowances);
  const mealAllowance = safeNumber(baseSalary.mealAllowance);
  const laborInsurance = safeNumber(baseSalary.laborInsurance);
  const groupInsurance = safeNumber(baseSalary.groupInsurance);
  const healthInsurance = safeNumber(baseSalary.healthInsurance);
  const welfareFund = safeNumber(baseSalary.welfareFund);
  const laborPensionTier = safeNumber(baseSalary.laborPensionTier);
  const voluntaryPensionRate = safeNumber(baseSalary.voluntaryPensionRate);

  // 計算全薪 = 底薪(應稅) + 交通/加班/津貼等(應稅) + 伙食費(免稅)
  const totalSalary = basePay + allowances + mealAllowance;

  // 自主勞退提撥
  const voluntaryPension = laborPensionTier * (voluntaryPensionRate / 100);

  // 實領 = 全薪 - 勞保 - 團保 - 健保 - 福利金 - 自主勞退提撥
  const actualSalary = totalSalary - laborInsurance - groupInsurance - healthInsurance - welfareFund - voluntaryPension;

  // 雇主勞退提撥
  const employerPension = laborPensionTier * 0.06;

  // 福利
  const taxableBenefits = benefits.filter(b => b.isTaxable).reduce((sum, b) => sum + safeNumber(b.amount), 0);
  const nonTaxableBenefits = benefits.filter(b => !b.isTaxable).reduce((sum, b) => sum + safeNumber(b.amount), 0);

  // 年度薪資相關
  const yearlyMealAllowance = mealAllowance * 12;
  const yearlyBaseSalary = (basePay + allowances) * 12;
  const totalBonusAmount = bonuses.reduce((sum, b) => sum + safeNumber(b.amount), 0);

  // 薪資所得總額(含交通與獎金+福利課稅)
  const totalSalaryIncome = yearlyBaseSalary + totalBonusAmount + taxableBenefits;
  // 自提退休金總額
  const totalVoluntaryPension = voluntaryPension * 12;
  // 稅單收入給付總額
  const taxableIncome = totalSalaryIncome - totalVoluntaryPension;
  // 稅單扣繳稅額總額
  const totalTaxWithheld = bonuses.reduce((sum, b) => sum + safeNumber(b.incomeTax), 0);
  // 二代健保總額
  const totalSecondGenNHI = bonuses.reduce((sum, b) => sum + safeNumber(b.secondGenerationNHI), 0);
  // 給付淨額
  const netPayment = taxableIncome - totalTaxWithheld;
  // 年薪(含薪資、伙食、自提、福利)
  const annualSalary = taxableBenefits + nonTaxableBenefits + yearlyMealAllowance + totalSalaryIncome + totalVoluntaryPension;
  // 福利金額
  const totalBenefits = taxableBenefits + nonTaxableBenefits;
  // 福利佔年薪比例
  const benefitsToSalaryRatio = annualSalary === 0 ? 0 : (totalBenefits / annualSalary) * 100;

  const salaryCalc: SalaryCalculation = {
    totalSalary,
    actualSalary,
    voluntaryPension,
    employerPension
  };

  const totalCalc: TotalCalculation = {
    taxableBenefits,
    nonTaxableBenefits,
    yearlyMealAllowance,
    totalSalaryIncome,
    totalVoluntaryPension,
    taxableIncome,
    totalTaxWithheld,
    netPayment,
    totalSecondGenerationNHI: totalSecondGenNHI,
    annualSalary,
    totalBenefits,
    benefitsToSalaryRatio
  };

  return { salaryCalc, totalCalc };
}; 