import React, { useState } from 'react';
import styled from 'styled-components';
import SalarySection from './components/SalarySection';
import BonusSection from './components/BonusSection';
import BenefitsSection from './components/BenefitsSection';
import SummarySection from './components/SummarySection';
import Accordion from './components/Accordion';
import { BaseSalary, Bonus, Benefit } from './types/salary';
import { calculateSalaryDetails } from './utils/salaryCalculator';
import AdSenseBox from './components/AdSenseBox';

const PageLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f4f6fa;
`;

const AdColumn = styled.div`
  width: 160px;
  min-width: 120px;
  max-width: 200px;
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Adsense = () => (
  <div style={{width:'100%'}}>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7453295555493346" crossOrigin="anonymous"></script>
    <ins className="adsbygoogle"
      style={{display:'block'}}
      data-ad-client="ca-pub-7453295555493346"
      data-ad-slot="1583409901"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
    <script dangerouslySetInnerHTML={{__html:`(adsbygoogle = window.adsbygoogle || []).push({});`}} />
  </div>
);

function App() {
  const [salaryData, setSalaryData] = useState<BaseSalary>({
    basePay: 0,
    allowances: 0,
    mealAllowance: 0,
    laborInsurance: 0,
    groupInsurance: 0,
    healthInsurance: 0,
    welfareFund: 0,
    laborPensionTier: 0,
    voluntaryPensionRate: 0
  });

  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const handleSalaryChange = (field: keyof BaseSalary, value: number) => {
    setSalaryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { salaryCalc, totalCalc } = calculateSalaryDetails(salaryData, bonuses, benefits);

  return (
    <PageLayout>
      <AdColumn>
        <AdSenseBox />
      </AdColumn>
      <Container>
        <Title>薪資稅務計算器</Title>
        <Accordion title="薪資區" defaultOpen>
          <SalarySection
            salaryData={salaryData}
            onChange={handleSalaryChange}
            calculations={salaryCalc}
          />
        </Accordion>
        <Accordion title="獎金區">
          <BonusSection
            bonuses={bonuses}
            onChange={setBonuses}
          />
        </Accordion>
        <Accordion title="福利區">
          <BenefitsSection
            benefits={benefits}
            onChange={setBenefits}
          />
        </Accordion>
        <Accordion title="計算總結">
          <SummarySection
            calculations={totalCalc}
          />
        </Accordion>
      </Container>
      <AdColumn>
        <AdSenseBox />
      </AdColumn>
    </PageLayout>
  );
}

export default App; 