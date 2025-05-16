import React from 'react';
import styled from 'styled-components';
import { BaseSalary } from '../types/salary';
import { pensionTiers } from '../data/pensionTiers';

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

const DownloadButton = styled.button`
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 1rem;
  &:hover {
    background-color: #3498db;
  }
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

  // 勞退級距選單選擇時自動帶出對應欄位
  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tierValue = parseInt(e.target.value, 10);
    const tier = pensionTiers.find(t => t.tier === tierValue);
    if (tier) {
      onChange('laborPensionTier', tier.tier);
      onChange('laborInsurance', tier.laborInsurance);
      onChange('healthInsurance', tier.healthInsurance);
    }
  };

  // 目前選擇的級距對象
  const selectedTier = pensionTiers.find(t => t.tier === salaryData.laborPensionTier);

  // 下載 .md 檔案
  const handleDownload = () => {
    const content = `# 薪資計算結果

## 基本薪資
- 底薪 (應稅): ${salaryData.basePay?.toLocaleString() || 0} 元
- 交通/加班/津貼等 (應稅): ${salaryData.allowances?.toLocaleString() || 0} 元
- 伙食費 (免稅): ${salaryData.mealAllowance?.toLocaleString() || 0} 元
- 全薪: ${calculations.totalSalary.toLocaleString()} 元

## 勞退相關
- 勞退級距: ${salaryData.laborPensionTier?.toLocaleString() || 0} 元
- 自主勞退提撥比率: ${salaryData.voluntaryPensionRate || 0}%
- 雇主勞退提撥: ${selectedTier ? selectedTier.employerPension.toLocaleString() : 0} 元

## 扣除與實領
- 勞保: ${salaryData.laborInsurance?.toLocaleString() || 0} 元
- 團保: ${salaryData.groupInsurance?.toLocaleString() || 0} 元
- 健保: ${salaryData.healthInsurance?.toLocaleString() || 0} 元
- 福利金: ${salaryData.welfareFund?.toLocaleString() || 0} 元
- 自主勞退提撥: ${calculations.voluntaryPension.toLocaleString()} 元
- 實領: ${calculations.actualSalary.toLocaleString()} 元
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '薪資計算結果.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Section>
      <Title>薪資資訊</Title>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <DownloadButton onClick={handleDownload}>下載結果</DownloadButton>
      </div>
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
            <select value={salaryData.laborPensionTier} onChange={handleTierChange} style={{width:'100%',padding:'0.5rem',fontSize:'1.1rem',borderRadius:'4px',border:'1px solid #ddd'}}>
              <option value="">請選擇</option>
              {pensionTiers.map(tier => (
                <option key={tier.tier} value={tier.tier}>
                  {tier.tier.toLocaleString()} 元
                </option>
              ))}
            </select>
          </Card>
          <Card>
            <Label>自主勞退提撥比率 (%)</Label>
            <Input type="number" value={salaryData.voluntaryPensionRate || ''} onChange={handleChange('voluntaryPensionRate')} min="0" max="6" step="0.5" />
          </Card>
          <Card highlight>
            <Label>雇主勞退提撥</Label>
            <Value highlight>{selectedTier ? selectedTier.employerPension.toLocaleString() : 0} 元</Value>
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