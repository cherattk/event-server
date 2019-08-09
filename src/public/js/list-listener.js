import React from 'react';
import ElementListener from './element-listener';
import DataManager from './module/data-manager';

export default class ListListener extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_listener : []
    }
  }

  componentDidMount(){
    this.setState(function(){
      return { list_listener : DataManager.getListenerList() }
    });
  }

  renderList() {
    var list = this.state.list_listener.map(function (listener, idx) {
      return (<ElementListener key={idx + 'listener-list'} data={listener}/>)
    }, this);

    return list;
  }

  render() {
    return (
        <ul className="list-listener">
          {this.renderList()}
        </ul>
    );
  }
}