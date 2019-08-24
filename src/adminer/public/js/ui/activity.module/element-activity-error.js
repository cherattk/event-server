import React from 'react';

export default function ElementActivityError(props) {
  let activity = props.activity;
  return (
    <div>
      <label>Error type : </label>{activity.error_type} <br />
      <pre>
        {JSON.stringify(props.activity.content)}
      </pre>
    </div>
  )
}