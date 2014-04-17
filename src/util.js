import config from './config';
module handlers from './handlers';

export var fix = function (cmd, requester, data) {
    if (Object.keys(data).length === 1) {
        var key = Object.keys(data)[0];
        if (cmd.party === undefined && ['join', 'part', 'list', 'clear'].indexOf(cmd.command) !== -1) {
            cmd.party = key;
        }
    }

    if (cmd.who && (cmd.who.toUpperCase() === 'I' || cmd.who.toLowerCase() === 'me')) {
        cmd.who = requester;
    }

    if (cmd.command === 'replace' && cmd.to && cmd.to.toUpperCase() === 'I') {
        cmd.to = requester;
    }

    if (cmd.command === 'cook' && cmd.party && cmd.party.toUpperCase() === 'I') {
        cmd.party = requester;
    }

    if (cmd.party && cmd.party.toLowerCase() === 'me' && ['join', 'part', 'list', 'clear'].indexOf(cmd.command) !== -1) {
        cmd.party = requester;
    }

    if (cmd.command === 'replace' && cmd.from && cmd.from.toLowerCase() === 'me') {
        cmd.from = requester;
    }
    return cmd;
};

export var processUpdates = function (cmd, data, reply) {
    if (cmd.command === false) {
        reply(config.messages.unknown_command);
    } else {
        if (handlers[cmd.command] === undefined) {
            reply(config.messages.undefined_handler);
        } else {
            handlers[cmd.command](cmd, data, reply);
        }
    }
};

export var escapeRegExp = function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
