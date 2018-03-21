import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Filters extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchName: ''
    }
  }

  updateSearchName(event) {
    console.log(event.target.value);
    this.setState({searchName: event.target.value});
  }

  render() {
    return (
    <div>
      <input type="text" name="name"
        value={this.state.searchName}
        onChange={this.updateSearchName.bind(this)}
      />
    </div>
    )
  }
}


function Results({data}) {
  console.log(data);
  var html = data.map(function(item){
    console.log(item);
    return <div>
        {item.NOMBRES}
      </div>
  });
  return html;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    const raceDataFileLocation = '/race-example.json';
    this.loadFile(raceDataFileLocation);
  }

  loadFile(endpointFeed) {
    fetch(endpointFeed, {
      method: 'get'
    })
    .then((response) => response.json())
    .then(function(data) {
        this.setState({data: data});
        console.log(data);
      }.bind(this))
    .catch(function(err) {
        console.log(err);
      });    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Maratón Virgen de la Candelaria 2018</h1>
        </header>
        <Filters />
        <Results data={this.state.data} />
      </div>
    );
  }
}

export default App;
