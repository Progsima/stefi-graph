import React, {Component, PropTypes} from "react";
import {branch} from 'baobab-react/higher-order';
import fontawesome from "~/config/fontawesome.js";
import Log from "~/services/log";
import _ from "lodash";

const log = new Log("Field.fontawesome");

class FontawesomeInput extends Component {

  constructor(props) {
    super(props);
    this.id =  _.uniqueId('list');
    let selectedIcon = null;
    if(this.props.value) {
      selectedIcon = fontawesome.icons.filter((e) => e.unicode == this.props.value)[0];
    }
    this.state = {
      suggest:[],
      displaySuggest: false,
      value: null,
      selectedIcon: selectedIcon
    };
    this.documentClickHandler = this.documentClickHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentClickHandler);
  }

  documentClickHandler() {
      this.setState({
        displaySuggest: false
      });
  }

  _eventOnChange(data) {
    let suggest = fontawesome.icons.filter((e) => e.name.toLowerCase().includes(data.toLowerCase()));
    this.setState({
      suggest: suggest,
      value: data
    });
    this.props.onChange(data);
  }

  _eventOnFocus(e) {
    this.setState({ displaySuggest: true });
    e.nativeEvent.stopImmediatePropagation();
  }

  _eventOnItemClick(item) {
    this.setState( {
      value:item.name,
      selectedIcon:item,
      displaySuggest:false
    });
    this.props.onChange(item.unicode);
  }

  _clear() {
    this.setState( {
      value:'',
      selectedIcon:null,
      displaySuggest:false
    });
    this.props.onChange();
  }

  _renderSelected() {
    if(this.state.selectedIcon){
      return (
        <div className="col-md-3 preview">
          <i className={'fa fa-' + this.state.selectedIcon.id}></i>
          <a  onClick={(event) => this._clear()}> <i className={'fa fa-times'}></i></a>
        </div>
      )
    }
    else {
      return null;
    }
  }

  _renderSuggest() {
    if(this.state.displaySuggest){
      return (
        <ul className="list-unstyled autocomplete">
          {this.state.suggest.map((row, index) => {
            return (
              <li key={index} onClick={ e => this._eventOnItemClick(row) }>
                <i className={'fa fa-' + row.id}></i>
                <span className="pull-right">{row.name}</span>
              </li>

            )
          })}
        </ul>
      )
    }
    else {
      return null;
    }
  }

  render() {
    return (
      <div className="form-control-wrapper">
        <div className="col-md-9">
          <input
            className="form-control"
            type="text"
            readOnly={this.props.readonly}
            autoFocus={this.props.autofocus}
            onFocus={(event) => this._eventOnFocus(event)}
            onClick={(event) => this._eventOnFocus(event)}
            value={this.state.value ? this.state.value : ""}
            onChange={(event) => this._eventOnChange(event.target.value)} />
          {this._renderSuggest()}
        </div>
        {this._renderSelected()}
      </div>
    )
  }

}

export default FontawesomeInput;
