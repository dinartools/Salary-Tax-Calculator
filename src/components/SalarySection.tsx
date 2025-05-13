import React from 'react';
import styled from 'styled-components';
import { BaseSalary } from '../types/salary';

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

const GroupBox = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  padding: 1.2rem 1.5rem 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
`;

const GroupTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #357abd;
  margin-bottom: 0.7rem;
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Card = styled.div<{highlight?: boolean}>`
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1rem 1.2rem;
  min-width: 180px;
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  border-left: ${({highlight})=>highlight?'4px solid #2980b9':'4px solid #e0e0e0'};
`;

const Label = styled.div`
  color: #34495e;
  font-size: 1rem;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Value = styled.div<{highlight?: boolean}>`
  color: ${({highlight})=>highlight?'#2980b9':'#2c3e50'};
  font-weight: ${({highlight})=>highlight?'bold':'normal'};
  font-size: ${({highlight})=>highlight?'1.3rem':'1.1rem'};
`;

interface Props {
  salaryData: BaseSalary;
  onChange: (field: keyof BaseSalary, value: number) => void;
  calculations: {
    totalSalary: number;
    actualSalary: number;
    voluntaryPension: number;
    employerPension: number;
  };
}

const SalarySection: React.FC<Props> = ({ salaryData, onChange, calculations }) => {
  const handleChange = (field: keyof BaseSalary) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange(field, value);
  };

  return (
    <Section>
      <Title>薪資資訊</Title>
      <GroupBox>
        <GroupTitle>基本薪資</GroupTitle>
        <CardList>
          <Card>
            <Label>底薪 (應稅)</Label>
            <Input type="number" value={salaryData.basePay || ''} onChange={handleChange('basePay')} />
          </Card>
          <Card>
            <Label>交通/加班/津貼等 (應稅)</Label>
            <Input type="number" value={salaryData.allowances || ''} onChange={handleChange('allowances')} />
          </Card>
          <Card>
            <Label>伙食費 (免稅)</Label>
            <Input type="number" value={salaryData.mealAllowance || ''} onChange={handleChange('mealAllowance')} />
          </Card>
          <Card highlight>
            <Label>全薪</Label>
            <Value highlight>{calculations.totalSalary.toLocaleString()} 元</Value>
          </Card>
        </CardList>
      </GroupBox>
      <GroupBox>
        <GroupTitle>勞退相關</GroupTitle>
        <CardList>
          <Card>
            <Label>勞退級距</Label>
            <Input type="number" value={salaryData.laborPensionTier || ''} onChange={handleChange('laborPensionTier')} />
          </Card>
          <Card>
            <Label>自主勞退提撥比率 (%)</Label>
            <Input type="number" value={salaryData.voluntaryPensionRate || ''} onChange={handleChange('voluntaryPensionRate')} min="0" max="6" step="0.5" />
          </Card>
          <Card highlight>
            <Label>雇主勞退提撥</Label>
            <Value highlight>{calculations.employerPension.toLocaleString()} 元</Value>
          </Card>
        </CardList>
      </GroupBox>
      <GroupBox>
        <GroupTitle>扣除與實領</GroupTitle>
        <CardList>
          <Card>
            <Label>勞保</Label>
            <Input type="number" value={salaryData.laborInsurance || ''} onChange={handleChange('laborInsurance')} />
          </Card>
          <Card>
            <Label>團保</Label>
            <Input type="number" value={salaryData.groupInsurance || ''} onChange={handleChange('groupInsurance')} />
          </Card>
          <Card>
            <Label>健保</Label>
            <Input type="number" value={salaryData.healthInsurance || ''} onChange={handleChange('healthInsurance')} />
          </Card>
          <Card>
            <Label>福利金</Label>
            <Input type="number" value={salaryData.welfareFund || ''} onChange={handleChange('welfareFund')} />
          </Card>
          <Card highlight>
            <Label>自主勞退提撥</Label>
            <Value highlight>{calculations.voluntaryPension.toLocaleString()} 元</Value>
          </Card>
          <Card highlight>
            <Label>實領</Label>
            <Value highlight>{calculations.actualSalary.toLocaleString()} 元</Value>
          </Card>
        </CardList>
      </GroupBox>
    </Section>
  );
};

export default SalarySection; 