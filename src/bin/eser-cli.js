/**
 * 
 */

const manager = require('../admin/cli-api');

const commandName = [
  'set-event', 'set-service', 'set-listener',
  'get-event', 'get-service', 'get-listener',
  'delete-event', 'delete-service', 'delete-listener'
];
const cmd = process.argv[2];

if (commandName.indexOf(cmd) < 0) {
  console.log('+-------------------+');
  console.log('| command not found |');
  console.log('+-------------------+');
  return;
}

// -----------------------------------------------------
if (cmd.match('^set-')) {
  let arg_pair = process.argv[3].split('=');
  if (arg_pair[0] !== 'id') {
    console.log('bad argument');
    console.log('Usage example : set-[entitytype] id=[entity-id]');
    return;
  }
  else {
    manager.setEntity(cmd.slice(4) /*entity type*/, arg_pair[1] /* entityID */);
  }
}

// -----------------------------------------------------
else if (cmd.match('^get-')) {
  let cmdArg = process.argv.slice(3).map((arg) => {
    return arg.split('=');
  });
  manager.getEntity(cmd.slice(4) /*entity type*/, cmdArg);
}

// -----------------------------------------------------
else if (cmd.match('^rm-')) {
  let arg_pair = process.argv[3].split('=');
  if (arg_pair[0] !== 'id') {
    console.log('bad argument');
    console.log('Usage example : rm-[entitytype] id=[entity-id]');
  }
  else {
    manager.removeEntity(cmd.slice(3) /*entity type*/, arg_pair[1] /* entityID */);
  }
}
