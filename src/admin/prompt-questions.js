module.exports.entityField = {
  service: [
    {
      name: 'service_name',
      description: 'service name',
      // pattern: /^[a-zA-Z\s-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    },
    {
      name: 'service_domain',
      description: 'service domain',
      required: true
      // format: 'url',
      // message: 'Must be a valid url address'
    }
  ],

  event: [
    {
      name: 'service_id',
      description: 'service identifier (id)'
    },
    {
      name: 'event_name',
      description: 'event name',
      // pattern: /^[a-zA-Z-]+$/,
      message: 'Name must be only letters, or dashes',
      // required: true
    }
  ],
  listener: [
    {
      name: 'service_id',
      description: 'Service identifier to belong to',
      message: 'Name must be only letters, spaces, or dashes'
    },
    {
      name: 'event_id',
      description: 'event identifier to listen to',
      message: 'Name must be only letters, spaces, or dashes'
    },
    {
      name: 'listener_name',
      description: 'listener name',
      // pattern: /^[a-zA-Z\s-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      // required: true
    },
    {
      name: 'listener_path',
      description: 'listener path',
      // required: true
    }
  ]
};