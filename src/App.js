import React from "react";
import "./App.css";
import AirTemperature from "./AirTemperature";

class App extends React.Component {
  state = {
    people: [],
    types: {},
    type: "temp",
    range: [] // sol range for brush
  };

  loadData = async () => {
    const response = await fetch("https://randomuser.me/api/?results=5");
    const data = await response.json();
    this.setState({
      people: data.results
    });
  };

  async componentDidMount() {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ""}/temp.json`);
      const data = await response.json();
      const newTemp = Object.values(data.results);
      console.log("newTemp: " + JSON.stringify(newTemp));
      this.setState({
        types: {
          temp: newTemp
        }
      });
    } catch (error) {
      console.log(error);
    }
    /**
    Promise.all([
      fetch(`${process.env.PUBLIC_URL || ""}/temp.json`),
      fetch(`${process.env.PUBLIC_URL || ""}/pressure.json`)
    ])
      .then(responses => Promise.all(responses.map(resp => resp.json())))
      .then(([temp, pressure]) => {
        const newTemp = Object.values(temp);
        const newPressure = Object.values(pressure);
        this.setState({
          types: {
            temp: newTemp,
            pressure: newPressure
          }
        });
      });
      **/
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
          <a href="nasa.gov" target="_new">
            nasa.gov
          </a>
          )
        </p>
      </div>
    );
  }
}

export default App;
