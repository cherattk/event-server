### Event Server
An HTTP PubSub Server with GUI.

:warning: This project is work in progress. See [project's todo List](https://github.com/cherattk/event-server/projects/1). Any contribution is welcomed.

### Requirement:
  - Nodejs
  - Couchdb
  - Interested about event-driven architecture.
  
### Usage:
```bash
$ git clone https://github.com/cherattk/event-server.git
$ cd event-server
$ npm install
$ npm start
```
  
### Configuration Files:
- **config/app.config.js**
  - The location of the couchdb's database used to log the dispatched events and errors. 
      - default value is **http://localhost:5984/event_db**
      
- **config/data-ath.json** : 
  - The password to log in the adminer GUI can be changed in this file. 
    - Default value is **admin**.
