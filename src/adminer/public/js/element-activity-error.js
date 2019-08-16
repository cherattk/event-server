import React from 'react';

export default function ElementActivityError(props) {
  return (
    <div>
      <label>event id : </label> {activity.event_id} <br />
      <label>name : </label>{activity.name} <br />
      <label>service id : </label> {activity.service_id} <br />
      <label>description : </label>
      <pre>
        {JSON.stringify(props.activity.content)}
      </pre>
    </div>
  )
}