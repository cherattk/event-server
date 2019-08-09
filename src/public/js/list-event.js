import React from 'react';
import ElementEvent from './element-event';
import DataManager from './module/data-manager';

export default class ListEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      list_event : []
    }
  }

  componentDidMount(){
    this.setState(function(){
      return { list_event : DataManager.getEventList() }
    });
  }

  renderList() {
    var list = this.state.list_event.map(function (event, idx) {
      return (<ElementEvent key={idx + 'event-list'} data={event}/>)
    }, this);

    return list;
  }

  render() {
    const list_event = this.renderList();
    let showClass = "list-event " + ( this.props.show ? 'show' : 'hide');
    return (
      <div className={showClass}>
        <ul>
          {list_event}
        </ul>
      </div>
    );
  }
}