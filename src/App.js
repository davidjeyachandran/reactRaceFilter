import React, { Component } from 'react';
import './App.css';

class InputFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      distValue: '',
      categoriaValue: '',
      sexoValue: ''
    }
    this.changeHandlerInput = this.changeHandlerInput.bind(this)
    this.changeHandlerDist = this.changeHandlerDist.bind(this)
    this.changeHandlerCategoria = this.changeHandlerCategoria.bind(this)
    this.changeHandlerSexo = this.changeHandlerSexo.bind(this)
    this.clickHandler = this.clickHandler.bind(this)
  }

  changeHandlerInput(event) { 
    this.setState({inputValue: event.target.value})
    this.props.filterFunction({inputValue: event.target.value});
  }

  changeHandlerDist(event) {
    this.setState({distValue: event.target.value})
    this.props.filterFunction({distValue: event.target.value});
  }

  changeHandlerCategoria(event) {
    this.setState({categoriaValue: event.target.value})
    this.props.filterFunction({categoriaValue: event.target.value});
  }

  changeHandlerSexo(event) {
    this.setState({sexoValue: event.target.value})
    this.props.filterFunction({sexoValue: event.target.value});
  }

  clickHandler() {
    this.setState({inputValue: '', distValue: '', categoriaValue: ''})
    this.props.filterFunction({inputValue: '', distValue: '', categoriaValue: ''});
  }

  render() {
    return (
      <div>
        <select id="select_distancia" className="select-options form-control" onChange={this.changeHandlerDist}>
            <option key="0" value="">--Elegir la Distancia --</option>
          {this.props.distancia.map(item =>
            <option key={item} value={item}>{item}</option>
            )}
        </select>
        <select id="select_categoria" className="select-options form-control" onChange={this.changeHandlerCategoria}>
            <option key="0" value="">--Elegir la Categoría --</option>
          {this.props.categorias.map(item =>
            <option key={item} value={item}>{item}</option>
            )}
        </select>
        <select id="select_sexo" className="select-options form-control" onChange={this.changeHandlerSexo}>
            <option key="0" value="">--Elegir el Sexo --</option>
          {this.props.sexos.map(item =>
            <option key={item} value={item}>{item}</option>
            )}
        </select>
        <input value={this.state.inputValue} onChange={this.changeHandlerInput} placeholder="Search number or name..." />
        <button onClick={this.clickHandler}>Reset</button>
      </div>
      )
  }
}

const ShowData = ({data}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Num</th>
          <th>Firstname</th>
          <th>Lastname</th> 
          <th>Distancia</th>
          <th>Categoria</th>
          <th>Sexo</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => 
          <tr key={item.Num}>
            <td>{item.Num}</td>
            <td>{item.Nombres}</td>
            <td>{item.Apellidos}</td>
            <td>{item.Dist}</td>
            <td>{item.Categoria}</td>
            <td>{item.Sexo}</td>
            <td>{item.Time}</td>
          </tr>
        )}
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
      distValue: '',
      categoriaValue: '',
      sexoValue: '',
      distList: [],
      categoriaList: []
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
    if (values.hasOwnProperty('categoriaValue')) this.setState({categoriaValue: values['categoriaValue']});
    if (values.hasOwnProperty('sexoValue')) this.setState({sexoValue: values['sexoValue']});
  }

  getUniqueList(list, key) {
    return Array.from(new Set(list.map(item => item[key]))).sort()
  }

  render() {

      let filteredList = this.state.data.filter(item => {
            let name = item.Num + ' ' + (item.Nombres + ' ' + item.Apellidos).toLowerCase()
            return (
              (item.Dist === this.state.distValue || this.state.distValue === '') &&
              (item.Categoria === this.state.categoriaValue || this.state.categoriaValue === '') &&
              (item.Sexo === this.state.sexoValue || this.state.sexoValue === '') &&
              (name.indexOf(this.state.inputValue.toLowerCase()) >= 0 || this.state.inputValue === '')
              )
            }
          )
          // .slice(0, 100)

    return (
      <div>
        <InputFilter 
          filterFunction={this.getFilterValue}
          distancia={this.getUniqueList(this.state.data, 'Dist')}
          categorias={this.getUniqueList(this.state.data, 'Categoria')}
          sexos={this.getUniqueList(this.state.data, 'Sexo')}
        />
        <p>Count: {filteredList.length}</p>
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
          <h1>Daddy's Race Tool</h1>
          <Results endpoint={filename} />
        </div>
      </div>
      )
  }

}

export default App;