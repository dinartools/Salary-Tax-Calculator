import React from 'react';
import styled from 'styled-components';
import { TotalCalculation } from '../types/salary';

const Section = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ResultItem = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ResultLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ResultValue = styled.div<{ isHighlight?: boolean }>`
  color: ${props => props.isHighlight ? '#2980b9' : '#2c3e50'};
  font-size: ${props => props.isHighlight ? '1.5rem' : '1.2rem'};
  font-weight: bold;
`;

const Percentage = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

interface Props {
  calculations: TotalCalculation;
}

const SummarySection: React.FC<Props> = ({ calculations }) => {
  return (
    <Section>
      <Title>計算總結</Title>
      
      <ResultGrid>
        <ResultItem>
          <ResultLabel>福利-課稅</ResultLabel>
          <ResultValue>{calculations.taxableBenefits.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>福利-免稅</ResultLabel>
          <ResultValue>{calculations.nonTaxableBenefits.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>整年伙食費(免稅)</ResultLabel>
          <ResultValue>{calculations.yearlyMealAllowance.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>薪資所得總額</ResultLabel>
          <ResultValue>{calculations.totalSalaryIncome.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>自提退休金總額</ResultLabel>
          <ResultValue>{calculations.totalVoluntaryPension.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>稅單收入給付總額</ResultLabel>
          <ResultValue isHighlight>{calculations.taxableIncome.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>稅單扣繳稅額總額</ResultLabel>
          <ResultValue>{calculations.totalTaxWithheld.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>給付淨額</ResultLabel>
          <ResultValue isHighlight>{calculations.netPayment.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>二代健保總額</ResultLabel>
          <ResultValue>{calculations.totalSecondGenerationNHI.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>年薪</ResultLabel>
          <ResultValue isHighlight>{calculations.annualSalary.toLocaleString()} 元</ResultValue>
        </ResultItem>

        <ResultItem>
          <ResultLabel>福利金額(福利佔年薪比例)</ResultLabel>
          <ResultValue>
            {calculations.totalBenefits.toLocaleString()} 元
            {' '}
            <span style={{color:'#7f8c8d', fontSize:'0.95rem'}}>
              ({calculations.benefitsToSalaryRatio.toFixed(1)}%)
            </span>
          </ResultValue>
        </ResultItem>
      </ResultGrid>
    </Section>
  );
};

export default SummarySection; 