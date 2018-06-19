import React, { Component } from 'react';
import './App.css';

class InputFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterValue: ''
    }
    this.changeHandler = this.changeHandler.bind(this)
  }

  changeHandler(e) {
    this.setState({filterValue: e.target.value})
    this.props.filterFunction(e.target.value);
  }

  render() {
    return (
      <div>
        <input value={this.state.filterValue} onChange={this.changeHandler} />
        <select id="select_categoria" className="select-options form-control">
          {this.props.categorias.map(item =>
            <option key={item} value="{item}">{item}</option>
            )}
        </select>
        <select id="select_distancia" className="select-options form-control">
          {this.props.distancia.map(item =>
            <option key={item} value="{item}">{item}</option>
            )}
        </select>
      </div>
      )
  }
}

const ShowData = ({data}) => {
  let html = data.map((item) => {
    return <tr key={item.Num}>
      <td>{item.Num}</td>
      <td>{item.Nombres}</td>
      <td>{item.Apellidos}</td>
      <td>{item.Categoria}</td>
      <td>{item.Dist}</td>
      <td>{item.Time}</td></tr>
  })
  return (
    <table>
      <thead>
        <tr>
          <th>Num</th>
          <th>Firstname</th>
          <th>Lastname</th> 
          <th>Categoria</th>
          <th>Distancia</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {html}
      </tbody>
    </table>
    )
}

class Results extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      filterValue: ''
    }
    this.getFilterValue = this.getFilterValue.bind(this)
  }

  componentWillMount() {
    this.loadData(this.props.endpoint);
  }

  loadData(endpoint) {
    fetch(endpoint, {method: 'get'})
    .then((response) => response.json())
    .then((data) => {this.setState({data:data})})
    .catch((err) => console.log(err))
  }

  getFilterValue(filterValue) {
    this.setState({filterValue: filterValue});
  }

  getUniqueList(list, key) {
    return Array.from(new Set(list.map(item => item[key]))).sort()
  }

  render() {
      let filteredList = this.state.data
        .filter((item) => item.Nombres.indexOf(this.state.filterValue) >= 0)
        .slice(0, 100)

    return (
      <div>
        <h1>Race Example</h1>
        <InputFilter 
          filterFunction={this.getFilterValue} 
          categorias={this.getUniqueList(this.state.data, 'Categoria')}
          distancia={this.getUniqueList(this.state.data, 'Dist')}
        />
        <ShowData data={filteredList} />
      </div>
      )
  }

}

class App extends Component {

  render() {
    const filename = 'race-all.json'

    return (
      <div>
        <div className="right">
          <Results endpoint={filename} />
        </div>
      </div>
      )
  }

}

export default App;