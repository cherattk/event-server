import React from 'react';
import ElementListener from './element-listener';
import EventMapManager from './module/event-map-manager';

export default class ListListener extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_listener : []
    }
  }

  componentDidMount(){
    this.setState(function(){
      return { list_listener : EventMapManager.getDataList('listener') }
    });
  }

  renderList() {
    var list = [];
    this.state.list_listener.forEach(function (listener, idx) {
      list.push(<ElementListener key={idx + 'listener-list'} data={listener}/>);
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