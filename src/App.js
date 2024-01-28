import { useState } from 'react';
import './App.css';
import { Flex, Button, Tabs, InputNumber } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';

function App() {
  const [inputMass, setInputMass] = useState(0);
  const [convertedMass, setConvertedMass] = useState(0);
  const [unit, setUnit] = useState("N/A");
  const [revolverChargesUberti] = useState({
    ".31": "9 - 15",
    ".36": "15 - 25",
    ".36c": "12 - 15",
    ".44": "22 - 30",
    ".44c": "19 - 25"
  });
  const [chargeUberti, setChargeUberti] = useState("N/A");
  const [avereageLastSeries, setAverageLastSeries] = useState(0);
  const [deviationLastSeries, setDeviationLastSeries] = useState(0);
  const [seriesGroup, setSeriesGroup] = useState([]);
  const [currentSeries, setCurrentSeries] = useState({ scores: [], seriesNo: 0 });
  const [serieNo, setSerieNo] = useState(0);
  const [scoreAdded,setScoreAdded] = useState("N/A");


  function unitConversion() {
    return (
      <section>
        <h2>Unit conversion</h2>
        <Flex gap="small" vertical style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} name="unitInput" defaultValue={0} onChange={massChange} />

          <Button block type="primary" name="grainToGram" onClick={toGramClick}>Grain to gram</Button>
          <Button block type="primary" name="gramToGrain" onClick={toGrainClick}>Gram to grain</Button>

        </Flex>
        <p id="conversionResult">{convertedMass.toFixed(2)} <span>{unit}</span></p>
      </section>
    );
  }

  function ubertiCharges() {
    return (
      <section>
        <Flex vertical gap="small" style={{ width: '100%' }}>
          <h2>Black Powder Charges for Uberti Revolvers</h2>
          <p>{chargeUberti} [Grain]</p>
          <Button block type='default' onClick={() => setChargeUberti(revolverChargesUberti['.31'])}>.31</Button>
          <Button block type='default' onClick={() => setChargeUberti(revolverChargesUberti['.36'])}>.36</Button>
          <Button block type='default' onClick={() => setChargeUberti(revolverChargesUberti['.36c'])}>.36 Conical</Button>
          <Button block type='default' onClick={() => setChargeUberti(revolverChargesUberti['.44'])}>.44</Button>
          <Button block type='default' onClick={() => setChargeUberti(revolverChargesUberti['.44c'])}>.44 Conical</Button>
        </Flex>
      </section>
    )
  }

  function grainToGram(grains) {
    return grains * 0.06479891;
  }
  function gramToGrain(grams) {
    return grams / 0.06479891;
  }

  function massChange(e) {
    setInputMass(e);
  }

  function toGrainClick() {
    setConvertedMass(gramToGrain(inputMass));
    setUnit("Grain");
  }
  function toGramClick() {
    setConvertedMass(grainToGram(inputMass));
    setUnit("Gram");
  }



  function addScore(i) {
    let cs = currentSeries.scores;
    cs.push(i);
    setScoreAdded(i.toString());
    setCurrentSeries({ scores: cs, seriesNo: serieNo });

  }

  function getAverage(data) {
    if (data.length == 0) return 0;
    let ret = 0;
    data.forEach(element => {
      ret += element;
    });
    return ret / data.length;
  }

  const scoreButtons = [];
  for (let i = 0; i <= 10; i++) {
    scoreButtons.push(<Button type='default' size="large" onClick={() => addScore(i)}>{i}</Button>);
  }

  function getDeviation(data) {
    const avg = getAverage(data);
    return Math.sqrt(data.reduce((p, e) => p + Math.pow(e - avg, 2), 0) / data.length);
  }

  function createNewSeries() {
    if (currentSeries.scores.length == 0) return;
    setAverageLastSeries(getAverage(currentSeries.scores));
    setDeviationLastSeries(getDeviation(currentSeries.scores));
    seriesGroup.push(currentSeries);
    setSerieNo(serieNo + 1);
    setCurrentSeries({ scores: [], seriesNo: serieNo });

  }

  function showSeriesLog() {
    let ret = [];
    seriesGroup.forEach(i => {
      ret.push(
        <p>
          <span>Series #{i.seriesNo}: </span>

          {i.scores.join(" | ")}
          <span> Avg:{getAverage(i.scores).toFixed(2)}</span>
        </p>
      )
    });
    return (<div>
      {ret}
    </div>);
  }


  function series(){
    return(<section>
      <h2>Shooting log</h2>
      <Button type='default' onClick={createNewSeries}>New series</Button>
      <Button type='default'>Clear series</Button>
      <p>Series {serieNo}</p>
      <p>Last series average {avereageLastSeries.toFixed(2)}</p>
      <p>Last series deviation {deviationLastSeries.toFixed(2)}</p>
      <h2>Score</h2>
      <p>{scoreAdded}</p>
      <Flex wrap="wrap" gap="middle">
        {scoreButtons}
      </Flex>
      {showSeriesLog()}
    </section>);
  }

  
    const tabItems = [
      {
        key: '1',
        label: 'Unit Conversion',
        children: unitConversion(),
      },
      {
        key: '2',
        label: 'Uberti charges',
        children: ubertiCharges(),
      },
      {
        key: '3',
        label: 'Shooting Log',
        children: series(),
      },
    ];
  



  return (
    <div className="App">
      <header>
        <h1>Range assistant</h1>

      </header>
      <Tabs defaultActiveKey="1" items={tabItems}>

      </Tabs>

    </div>
  );
}

export default App;
