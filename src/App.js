import React from "react";
import "./App.css";
import AirTemperature from "./AirTemperature";

class App extends React.Component {
  state = {
    types: {},
    type: "temp",
    range: [] // range for brush
  };

  componentDidMount() {
    Promise.all([
      //fetch('https://api.nasa.gov/insight_weather/?api_key=JZsVqaKDbQ0Z7YD9Qla4yKzWelaUjP2rbLAF4qTG&feedtype=json&ver=1.0')
      fetch(`${process.env.PUBLIC_URL || ""}/temp.json`)
    ])
      .then(responses => Promise.all(responses.map(resp => resp.json())))
      .then(([temp, pressure]) => {
        const newTemp = Object.values(temp);
        //const newPressure = Object.values(pressure);
        //newTemp.forEach(sol => (sol.AT ? (sol.AT.date = sol.Last_UTC) : ''));
        console.log("newTemp: " + JSON.stringify(newTemp))
        this.setState({
          types: {
            temp: newTemp,
            //pressure: newPressure
          }
        });
      });
  }

  updateType = e => {
    this.setState({ type: e.target.value });
  };

  updateRange = range => {
    this.setState({ range });
  };

  render() {
    const data = this.state.types[this.state.type];

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
          <a href="https://api.nasa.gov/" target="_new">
            nasa.gov
          </a>
          )
        </p>
      </div>
    );
  }
}

export default App;
