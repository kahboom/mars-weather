import React from "react";
import "./App.css";
import AirTemperature from "./AirTemperature";

class App extends React.Component {
  state = {
    people: [],
    types: {},
    type: "temp",
    range: [] // time range for brush
  };

  componentDidMount() {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL || ""}/temp.json`),
      fetch(`${process.env.PUBLIC_URL || ""}/pressure.json`)
    ])
      .then(responses => Promise.all(responses.map(resp => resp.json())))
      .then(([temp, pressure]) => {
        console.log("temp: " + JSON.stringify(temp));
        const newTemp = Object.values(temp);
        const newPressure = Object.values(pressure);
        console.log("newTemp: " + JSON.stringify(newTemp));
        this.setState({ types: { temp, pressure } });
        //this.setState({ types: { temp, pressure } });
      });
  }

  loadData = async () => {
    const response = await fetch("https://randomuser.me/api/?results=5");
    const data = await response.json();
    this.setState({
      people: data.results
    });
  };

  updateType = e => {
    this.setState({ type: e.target.value });
  };

  updateRange = range => {
    this.setState({ range });
  };

  render() {
    const data = this.state.types[this.state.type];
    const { people } = this.state;

    return (
      <div className="App">
        <h1>
          2019 Mars
          <select name="type" onChange={this.updateType}>
            {[
              { label: "Air Temperature", value: "temp" },
              { label: "Wind Pressure", value: "pressure" }
            ].map(option => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </h1>
        <AirTemperature data={data} range={this.state.range} />

        <p>
          (Mars weather data from{" "}
          <a href="nasa.gov" target="_new">
            nasa.gov
          </a>
          )
        </p>

        <div>
          <button onClick={this.loadData}>load data</button>
          {people.map(x => (
            <div key={x.name.first}>{x.name.first}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
