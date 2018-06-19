import React, { Component } from 'react';
import './App.css';

class InputFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      distValue: ''
    }
    this.changeHandlerInput = this.changeHandlerInput.bind(this)
    this.changeHandlerDist = this.changeHandlerDist.bind(this)
  }

  changeHandlerInput(event) {
    this.setState({inputValue: event.target.value})
    this.props.filterFunction({inputValue: event.target.value});
  }

  changeHandlerDist(event) {
    this.setState({distValue: event.target.value})
    this.props.filterFunction({distValue: event.target.value});
  }

  render() {
    return (
      <div>
        <input value={this.state.inputValue} onChange={this.changeHandlerInput} />
        <select id="select_distancia" className="select-options form-control" onChange={this.changeHandlerDist}>
            <option key="0" value="">--Elegir la Distancia --</option>
          {this.props.distancia.map(item =>
            <option key={item} value={item}>{item}</option>
            )}
        </select>
        <select id="select_categoria" className="select-options form-control">
          {this.props.categorias.map(item =>
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
      <td>{item.Dist}</td>
      <td>{item.Categoria}</td>
      <td>{item.Time}</td></tr>
  })
  return (
    <table>
      <thead>
        <tr>
          <th>Num</th>
          <th>Firstname</th>
          <th>Lastname</th> 
          <th>Distancia</th>
          <th>Categoria</th>
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
      inputValue: '',
      distValue: ''
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

  getFilterValue(values) {
    if (values.hasOwnProperty('inputValue')) this.setState({inputValue: values['inputValue']});
    if (values.hasOwnProperty('distValue')) this.setState({distValue: values['distValue']});
  }

  getUniqueList(list, key) {
    return Array.from(new Set(list.map(item => item[key]))).sort()
  }

  render() {
      console.log(this.state.distValue, this.state.inputValue)
      let filteredList = this.state.data.filter(item => {
            let name = (item.Nombres + ' ' + item.Apellidos).toLowerCase()
            return (item.Dist === this.state.distValue || this.state.distValue === '') &&
            (name.indexOf(this.state.inputValue.toLowerCase()) >= 0 || this.state.inputValue === '')
            }
          )
          .slice(0, 100)

    return (
      <div>
        <h1>Race Example</h1>
        <InputFilter 
          filterFunction={this.getFilterValue}
          distancia={this.getUniqueList(this.state.data, 'Dist')}
          categorias={this.getUniqueList(filteredList, 'Categoria')}
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