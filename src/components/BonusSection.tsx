import React from 'react';
import styled from 'styled-components';
import { Bonus } from '../types/salary';
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
  bonuses: Bonus[];
  onChange: (bonuses: Bonus[]) => void;
}

const BonusSection: React.FC<Props> = ({ bonuses, onChange }) => {
  const handleAddBonus = () => {
    const newBonus: Bonus = {
      id: uuidv4(),
      name: '',
      amount: 0,
      incomeTax: 0,
      secondGenerationNHI: 0
    };
    onChange([...bonuses, newBonus]);
  };

  const handleDeleteBonus = (id: string) => {
    onChange(bonuses.filter(bonus => bonus.id !== id));
  };

  const handleBonusChange = (id: string, field: keyof Bonus, value: string | number) => {
    onChange(
      bonuses.map(bonus =>
        bonus.id === id
          ? { ...bonus, [field]: field === 'name' ? value : parseFloat(value as string) || 0 }
          : bonus
      )
    );
  };

  return (
    <Section>
      <AddButton onClick={handleAddBonus}>新增獎金項目</AddButton>
      <TitleRow>
        <Cell>獎金名稱</Cell>
        <Cell>金額</Cell>
        <Cell>代扣所得稅</Cell>
        <Cell>二代健保</Cell>
        <Cell style={{flex: '0 0 60px'}}></Cell>
      </TitleRow>
      {bonuses.map(bonus => (
        <Row key={bonus.id}>
          <Cell>
            <Input
              type="text"
              value={bonus.name}
              onChange={e => handleBonusChange(bonus.id, 'name', e.target.value)}
              placeholder="例：年終獎金"
            />
          </Cell>
          <Cell>
            <Input
              type="number"
              value={bonus.amount || ''}
              onChange={e => handleBonusChange(bonus.id, 'amount', e.target.value)}
            />
          </Cell>
          <Cell>
            <Input
              type="number"
              value={bonus.incomeTax || ''}
              onChange={e => handleBonusChange(bonus.id, 'incomeTax', e.target.value)}
            />
          </Cell>
          <Cell>
            <Input
              type="number"
              value={bonus.secondGenerationNHI || ''}
              onChange={e => handleBonusChange(bonus.id, 'secondGenerationNHI', e.target.value)}
            />
          </Cell>
          <Cell style={{flex: '0 0 60px'}}>
            <DeleteButton onClick={() => handleDeleteBonus(bonus.id)}>刪除</DeleteButton>
          </Cell>
        </Row>
      ))}
    </Section>
  );
};

export default BonusSection; 