import React from 'react';
import styled from 'styled-components';
import { Benefit } from '../types/salary';
import { v4 as uuidv4 } from 'uuid';

const Section = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  font-weight: bold;
  background: #e6eaf0;
  border-radius: 4px 4px 0 0;
  padding: 0.5rem 0.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0.5rem;
  &:last-child { border-bottom: none; }
`;

const Cell = styled.div`
  flex: 1;
  padding: 0 0.5rem;
  min-width: 100px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.3rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Checkbox = styled.input`
  margin-left: 0.5rem;
`;

const AddButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  &:hover { background-color: #219a52; }
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  font-size: 0.95rem;
  margin-left: 0.5rem;
  &:hover { background-color: #c0392b; }
`;

interface Props {
  benefits: Benefit[];
  onChange: (benefits: Benefit[]) => void;
}

const BenefitsSection: React.FC<Props> = ({ benefits, onChange }) => {
  const handleAddBenefit = () => {
    const newBenefit: Benefit = {
      id: uuidv4(),
      name: '',
      amount: 0,
      isTaxable: true
    };
    onChange([...benefits, newBenefit]);
  };

  const handleDeleteBenefit = (id: string) => {
    onChange(benefits.filter(benefit => benefit.id !== id));
  };

  const handleBenefitChange = (id: string, field: keyof Benefit, value: string | number | boolean) => {
    onChange(
      benefits.map(benefit =>
        benefit.id === id
          ? {
              ...benefit,
              [field]:
                field === 'isTaxable'
                  ? Boolean(value)
                  : field === 'name'
                  ? value
                  : parseFloat(value as string) || 0
            }
          : benefit
      )
    );
  };

  return (
    <Section>
      <AddButton onClick={handleAddBenefit}>新增福利項目</AddButton>
      <TitleRow>
        <Cell>福利名稱</Cell>
        <Cell>金額</Cell>
        <Cell>課稅</Cell>
        <Cell style={{flex: '0 0 60px'}}></Cell>
      </TitleRow>
      {benefits.map(benefit => (
        <Row key={benefit.id}>
          <Cell>
            <Input
              type="text"
              value={benefit.name}
              onChange={e => handleBenefitChange(benefit.id, 'name', e.target.value)}
              placeholder="例：股票分紅"
            />
          </Cell>
          <Cell>
            <Input
              type="number"
              value={benefit.amount || ''}
              onChange={e => handleBenefitChange(benefit.id, 'amount', e.target.value)}
            />
          </Cell>
          <Cell>
            <label>
              <Checkbox
                type="checkbox"
                checked={benefit.isTaxable}
                onChange={e => handleBenefitChange(benefit.id, 'isTaxable', e.target.checked)}
              />
              {benefit.isTaxable ? '課稅' : '免稅'}
            </label>
          </Cell>
          <Cell style={{flex: '0 0 60px'}}>
            <DeleteButton onClick={() => handleDeleteBenefit(benefit.id)}>刪除</DeleteButton>
          </Cell>
        </Row>
      ))}
    </Section>
  );
};

export default BenefitsSection; 