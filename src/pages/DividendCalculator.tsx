import React, { useState, useEffect } from 'react';

interface StockInput {
  stockCode: string;
  shares: number;
  pledgedShares: number;
  pledgeRate: number;
  price: number;
  lastDividend: number;
  frequency: number;
  priceLoading?: boolean;
  priceError?: string;
  loading?: boolean;
  error?: string;
}

const defaultStock: StockInput = {
  stockCode: '',
  shares: 0,
  pledgedShares: 0,
  pledgeRate: 2.5,
  price: 0,
  lastDividend: 0,
  frequency: 1,
  priceLoading: false,
  priceError: '',
  loading: false,
  error: '',
};

const DividendCalculator: React.FC = () => {
  const [stocks, setStocks] = useState<StockInput[]>([{ ...defaultStock }]);

  // 股票代號變動時自動查詢現價與配息
  useEffect(() => {
    // 初始查詢
    stocks.forEach((s, idx) => {
      if (s.stockCode && !s.priceLoading && !s.loading) {
        fetchPriceAndDividend(idx, s.stockCode);
      }
    });

    // 定時更新股價與配息
    const interval = setInterval(() => {
      stocks.forEach((s, idx) => {
        if (s.stockCode) {
          fetchPriceAndDividend(idx, s.stockCode);
        }
      });
    }, 60000); // 每分鐘更新一次

    return () => clearInterval(interval);
  }, [stocks.map(s => s.stockCode).join(",")]);

  // 查詢現價與配息
  const fetchPriceAndDividend = async (idx: number, code: string, retryCount = 0) => {
    if (!code) return;

    // 檢查快取
    const cacheKey = `stock_${code}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { price, lastDividend, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      if (now - timestamp < 60000) { // 快取未過期（1分鐘）
        setStocks(stocks => stocks.map((s, i) => i === idx ? {
          ...s,
          price,
          lastDividend,
          priceLoading: false,
          loading: false,
          priceError: '',
          error: ''
        } : s));
        return;
      }
    }

    // 查詢現價與配息
    setStocks(stocks => stocks.map((s, i) => i === idx ? { ...s, priceLoading: true, loading: true, priceError: '', error: '' } : s));
    try {
      // 查現價
      const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_${code}.tw`;
      const resp = await fetch(url);
      const data = await resp.json();
      const arr = data.msgArray;
      let price = 0;
      let priceError = '';
      if (arr && arr.length > 0 && arr[0].z) {
        price = parseFloat(arr[0].z);
      } else {
        priceError = '查無現價';
      }

      // 查配息
      let lastDividend = 0, frequency = 1, error = '';
      try {
        const symbol = code + '.TW';
        const end = Math.floor(Date.now() / 1000);
        const start = end - 2 * 365 * 24 * 60 * 60;
        const divUrl = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${start}&period2=${end}&interval=1d&events=div&includeAdjustedClose=true`;
        const divResp = await fetch(divUrl);
        const text = await divResp.text();
        const lines = text.trim().split('\n');
        if (lines.length > 1) {
          const dividends = lines.slice(1).map(line => {
            const parts = line.split(',');
            return parseFloat(parts[1]);
          }).filter(n => !isNaN(n));
          if (dividends.length > 0) {
            lastDividend = dividends[dividends.length - 1];
            frequency = Math.round(dividends.length / 2);
          } else {
            error = '查無配息';
          }
        } else {
          error = '查無配息';
        }
      } catch {
        error = '查詢失敗';
      }

      // 更新快取
      localStorage.setItem(cacheKey, JSON.stringify({
        price,
        lastDividend,
        timestamp: Date.now()
      }));

      setStocks(stocks => stocks.map((s, i) => i === idx ? {
        ...s,
        price,
        priceLoading: false,
        priceError,
        lastDividend,
        frequency,
        loading: false,
        error
      } : s));
    } catch {
      if (retryCount < 3) { // 重試3次
        setTimeout(() => fetchPriceAndDividend(idx, code, retryCount + 1), 1000);
      } else {
        setStocks(stocks => stocks.map((s, i) => i === idx ? {
          ...s,
          price: 0,
          priceLoading: false,
          priceError: '查詢失敗',
          lastDividend: 0,
          frequency: 1,
          loading: false,
          error: '查詢失敗'
        } : s));
      }
    }
  };

  const handleChange = (idx: number, field: keyof StockInput, value: string | number) => {
    setStocks(stocks => stocks.map((s, i) => i === idx ? { ...s, [field]: typeof value === 'string' ? value : Number(value) } : s));
  };

  const handleAdd = () => {
    setStocks(stocks => [...stocks, { ...defaultStock }]);
  };

  const handleRemove = (idx: number) => {
    setStocks(stocks => stocks.length === 1 ? stocks : stocks.filter((_, i) => i !== idx));
  };

  // 計算每筆與總計
  const summary = stocks.reduce((acc, s) => {
    const marketValue = s.price * s.shares;
    const annualDividend = s.lastDividend * s.frequency * s.shares;
    const pledgeLoan = Math.floor(s.price * s.pledgedShares * 0.6 / 1000) * 1000;
    const pledgeInterest = pledgeLoan * (s.pledgeRate / 100);
    const netCashflow = annualDividend - pledgeInterest;
    acc.marketValue += marketValue;
    acc.annualDividend += annualDividend;
    acc.pledgeLoan += pledgeLoan;
    acc.pledgeInterest += pledgeInterest;
    acc.netCashflow += netCashflow;
    return acc;
  }, { marketValue: 0, annualDividend: 0, pledgeLoan: 0, pledgeInterest: 0, netCashflow: 0 });

  return (
    <div style={{maxWidth:1200,margin:'2rem auto',background:'#fff',borderRadius:12,padding:'2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
      <h2>質押存股配息計算機</h2>
      <div style={{marginBottom:'1.5rem',color:'#888',fontSize:'0.92rem'}}>
        股票代號輸入後自動查詢現價與配息，若查無請手動填入。資料每分鐘自動更新。
      </div>
      <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'1.5rem',fontSize:'0.95rem'}}>
        <thead>
          <tr style={{background:'#f4f6fa'}}>
            <th>股票代號</th>
            <th>持有股數</th>
            <th>質押股數</th>
            <th>質押利率(%)</th>
            <th>股價</th>
            <th>前次每股配息</th>
            <th>一年配息次數</th>
            <th>持股市值</th>
            <th>預期一年配息</th>
            <th>殖利率</th>
            <th>質押借款金額</th>
            <th>質押一年利息</th>
            <th>淨現金流</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, idx) => {
            const marketValue = s.price * s.shares;
            const annualDividend = s.lastDividend * s.frequency * s.shares;
            const yieldRate = marketValue > 0 ? (annualDividend / marketValue * 100) : 0;
            const pledgeLoan = Math.floor(s.price * s.pledgedShares * 0.6 / 1000) * 1000;
            const pledgeInterest = pledgeLoan * (s.pledgeRate / 100);
            const netCashflow = annualDividend - pledgeInterest;
            return (
              <tr key={idx} style={{background: idx%2===0?'#fff':'#f9fafb'}}>
                <td>
                  <input value={s.stockCode} onChange={e=>handleChange(idx,'stockCode',e.target.value)} style={{width:65,fontSize:'0.95em'}} />
                  {s.priceLoading || s.loading ? <div style={{color:'#888',fontSize:'0.9em'}}>查詢中...</div> : null}
                </td>
                <td><input type="number" value={s.shares||''} min={0} onChange={e=>handleChange(idx,'shares',e.target.value)} style={{width:60,fontSize:'0.95em'}} /></td>
                <td><input type="number" value={s.pledgedShares||''} min={0} onChange={e=>handleChange(idx,'pledgedShares',e.target.value)} style={{width:60,fontSize:'0.95em'}} /></td>
                <td><input type="number" value={s.pledgeRate||''} min={0} step={0.01} onChange={e=>handleChange(idx,'pledgeRate',e.target.value)} style={{width:60,fontSize:'0.95em'}} /></td>
                <td>
                  <input type="number" value={s.price||''} min={0} step={0.01} onChange={e=>handleChange(idx,'price',e.target.value)} style={{width:70,fontSize:'0.95em'}} />
                  {s.priceError && <div style={{color:'red',fontSize:'0.9em'}}>{s.priceError}</div>}
                </td>
                <td>
                  <input type="number" value={s.lastDividend||''} min={0} step={0.01} onChange={e=>handleChange(idx,'lastDividend',e.target.value)} style={{width:70,fontSize:'0.95em'}} />
                </td>
                <td>
                  <input type="number" value={s.frequency||''} min={1} max={12} onChange={e=>handleChange(idx,'frequency',e.target.value)} style={{width:55,fontSize:'0.95em'}} />
                  {s.error && <div style={{color:'red',fontSize:'0.9em'}}>{s.error}</div>}
                </td>
                <td style={{fontSize:'0.95em'}}>{marketValue.toLocaleString()}</td>
                <td style={{fontSize:'0.95em'}}>{annualDividend.toLocaleString()}</td>
                <td style={{fontSize:'0.95em'}}>{yieldRate.toFixed(2)}%</td>
                <td style={{fontSize:'0.95em'}}>{pledgeLoan.toLocaleString()}</td>
                <td style={{fontSize:'0.95em'}}>{pledgeInterest.toLocaleString()}</td>
                <td style={{fontSize:'0.95em'}}>{netCashflow.toLocaleString()}</td>
                <td>
                  <button onClick={()=>handleRemove(idx)} style={{background:'#eee',border:'none',borderRadius:4,padding:'0.3rem 0.7rem',cursor:'pointer',color:'#888',fontSize:'0.95em'}}>刪除</button>
                </td>
              </tr>
            );
          })}
          <tr style={{background:'#eaf3fa',fontWeight:'bold'}}>
            <td colSpan={7} style={{textAlign:'right',fontSize:'0.95em'}}>總計</td>
            <td style={{fontSize:'0.95em'}}>{summary.marketValue.toLocaleString()}</td>
            <td style={{fontSize:'0.95em'}}>{summary.annualDividend.toLocaleString()}</td>
            <td></td>
            <td style={{fontSize:'0.95em'}}>{summary.pledgeLoan.toLocaleString()}</td>
            <td style={{fontSize:'0.95em'}}>{summary.pledgeInterest.toLocaleString()}</td>
            <td style={{fontSize:'0.95em'}}>{summary.netCashflow.toLocaleString()}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleAdd} style={{background:'#2980b9',color:'#fff',border:'none',borderRadius:4,padding:'0.5rem 1.2rem',fontSize:'1rem',cursor:'pointer'}}>新增一筆</button>
    </div>
  );
};

export default DividendCalculator; 