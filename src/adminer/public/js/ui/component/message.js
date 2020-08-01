import React from 'react';

export function Spinner(props) {
  return (
    <div className="list-status-panel text-primary">
      <p>{props.text}</p>
      <span className="spinner-border"></span>
    </div>
  );
}

export function EmptyState(props) {
  return (
    <div className="list-status-panel text-primary">
      <h3>{props.text}</h3>
    </div>
  );
}
