import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import SalarySection from './components/SalarySection';
import BonusSection from './components/BonusSection';
import BenefitsSection from './components/BenefitsSection';
import SummarySection from './components/SummarySection';
import Accordion from './components/Accordion';
import { BaseSalary, Bonus, Benefit } from './types/salary';
import { calculateSalaryDetails } from './utils/salaryCalculator';
import AdSenseBox from './components/AdSenseBox';
import SideAds from './components/SideAds';
import About from './pages/About';
import Privacy from './pages/Privacy';
import DividendCalculator from './pages/DividendCalculator';

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

const Nav = styled.nav`
  background-color: #fff;
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: #007bff;
  text-decoration: none;
  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

const DownloadButton = styled.button`
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 0.5rem;
  &:hover {
    background-color: #3498db;
  }
`;

function CalculatorApp() {
  const [salaryData, setSalaryData] = React.useState<BaseSalary>({
    basePay: 42000,
    allowances: 2200,
    mealAllowance: 3000,
    laborInsurance: 550,
    groupInsurance: 0,
    healthInsurance: 622,
    welfareFund: 285,
    laborPensionTier: 46000,
    voluntaryPensionRate: 6,
  });
  const [bonuses, setBonuses] = React.useState<Bonus[]>([
    {
      id: '1',
      name: '年度年終績效獎金',
      amount: 200000,
      incomeTax: 0,
      secondGenerationNHI: 0
    },
    {
      id: '2',
      name: '獎金1',
      amount: 61000,
      incomeTax: 0,
      secondGenerationNHI: 1287
    }
  ]);
  const [benefits, setBenefits] = React.useState<Benefit[]>([
    {
      id: '1',
      name: '尾牙抽獎禮券',
      amount: 8000,
      isTaxable: true
    },
    {
      id: '2',
      name: '個人旅遊補助',
      amount: 20000,
      isTaxable: false
    }
  ]);

  // 展開/收合狀態
  const [allOpen, setAllOpen] = React.useState(false);
  const [salaryOpen, setSalaryOpen] = React.useState(false);
  const [bonusOpen, setBonusOpen] = React.useState(false);
  const [benefitOpen, setBenefitOpen] = React.useState(false);
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  // 一鍵展開/收合
  const handleExpandAll = () => {
    setAllOpen(o => !o);
    setSalaryOpen(!allOpen);
    setBonusOpen(!allOpen);
    setBenefitOpen(!allOpen);
    setSummaryOpen(!allOpen);
  };

  // 下載 .md 檔案
  const handleDownload = () => {
    const content = `# 薪資計算結果\n\n## 基本薪資\n- 底薪 (應稅): ${salaryData.basePay?.toLocaleString() || 0} 元\n- 交通/加班/津貼等 (應稅): ${salaryData.allowances?.toLocaleString() || 0} 元\n- 伙食費 (免稅): ${salaryData.mealAllowance?.toLocaleString() || 0} 元\n- 全薪: ${salaryCalc.totalSalary.toLocaleString()} 元\n\n## 勞退相關\n- 勞退級距: ${salaryData.laborPensionTier?.toLocaleString() || 0} 元\n- 自主勞退提撥比率: ${salaryData.voluntaryPensionRate || 0}%\n- 雇主勞退提撥: ${salaryCalc.employerPension?.toLocaleString() || 0} 元\n\n## 扣除與實領\n- 勞保: ${salaryData.laborInsurance?.toLocaleString() || 0} 元\n- 團保: ${salaryData.groupInsurance?.toLocaleString() || 0} 元\n- 健保: ${salaryData.healthInsurance?.toLocaleString() || 0} 元\n- 福利金: ${salaryData.welfareFund?.toLocaleString() || 0} 元\n- 自主勞退提撥: ${salaryCalc.voluntaryPension.toLocaleString()} 元\n- 實領: ${salaryCalc.actualSalary.toLocaleString()} 元\n\n## 獎金區\n${bonuses.map(b => `- ${b.name}: ${b.amount?.toLocaleString() || 0} 元 (所得稅: ${b.incomeTax || 0} 元, 二代健保: ${b.secondGenerationNHI || 0} 元)`).join('\n')}\n\n## 福利區\n${benefits.map(b => `- ${b.name}: ${b.amount?.toLocaleString() || 0} 元 (${b.isTaxable ? '課稅' : '免稅'})`).join('\n')}`;
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

  const { salaryCalc, totalCalc } = calculateSalaryDetails(salaryData, bonuses, benefits);

  return (
    <>
      <SideAds />
      <PageLayout>
        <AdColumn>
          <AdSenseBox />
        </AdColumn>
        <Container>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.5rem'}}>
            <Title>薪資稅務計算器</Title>
            <button style={{marginLeft:'1rem',padding:'0.5rem 1rem',fontSize:'1rem',cursor:'pointer'}} onClick={handleExpandAll}>
              {allOpen ? '全部收合' : '全部展開'}
            </button>
            <DownloadButton onClick={handleDownload}>下載結果</DownloadButton>
          </div>
          <Accordion title="薪資區" open={salaryOpen} onToggle={setSalaryOpen}>
            <SalarySection
              salaryData={salaryData}
              onChange={(field, value) => setSalaryData(prev => ({ ...prev, [field]: value }))}
              calculations={salaryCalc}
            />
          </Accordion>
          <Accordion title="獎金區" open={bonusOpen} onToggle={setBonusOpen}>
            <BonusSection
              bonuses={bonuses}
              onChange={setBonuses}
            />
          </Accordion>
          <Accordion title="福利區" open={benefitOpen} onToggle={setBenefitOpen}>
            <BenefitsSection
              benefits={benefits}
              onChange={setBenefits}
            />
          </Accordion>
          <Accordion title="計算總結" open={summaryOpen} onToggle={setSummaryOpen}>
            <SummarySection
              calculations={totalCalc}
            />
          </Accordion>
        </Container>
        <AdColumn>
          <AdSenseBox />
        </AdColumn>
      </PageLayout>
    </>
  );
}

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/Salary-Tax-Calculator' : '';

  return (
    <Router basename={basename}>
      <header style={{backgroundColor:'#f8f9fa',padding:'1rem',textAlign:'center',borderBottom:'1px solid #dee2e6'}}>
        <h1>DinarTools - 專業薪資稅務計算工具</h1>
      </header>
      <Nav>
        <NavLink to="/">首頁</NavLink>
        <NavLink to="/dividend-calc">質押存股配息計算機</NavLink>
        <NavLink to="/about">關於我們</NavLink>
        <NavLink to="/privacy">隱私政策</NavLink>
      </Nav>
      <Routes>
        <Route path="/" element={<CalculatorApp />} />
        <Route path="/dividend-calc" element={<DividendCalculator />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
}

export default App; 