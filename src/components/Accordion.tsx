import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  background: #fff;
`;

const Header = styled.div<{open:boolean}>`
  cursor: pointer;
  padding: 1rem 1.5rem;
  background: #f0f2f5;
  border-radius: 8px 8px 0 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
  &:hover {
    background: #e6eaf0;
  }
`;

const Content = styled.div<{open:boolean}>`
  max-height: ${({open})=>open?'2000px':'0'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
  padding: ${({open})=>open?'1rem 1.5rem':'0 1.5rem'};
`;

const Icon = styled.span`
  font-size: 1.2rem;
  margin-left: 0.5rem;
`;

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

const Accordion: React.FC<Props> = ({ title, children, defaultOpen=false, open: controlledOpen, onToggle }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const handleToggle = () => {
    if (isControlled) {
      onToggle && onToggle(!controlledOpen);
    } else {
      setInternalOpen(o => !o);
      onToggle && onToggle(!internalOpen);
    }
  };
  return (
    <Wrapper>
      <Header open={open} onClick={handleToggle}>
        {title}
        <Icon>{open ? '▲' : '▼'}</Icon>
      </Header>
      <Content open={open}>{children}</Content>
    </Wrapper>
  );
};

export default Accordion; 