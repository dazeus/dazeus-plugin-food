import config from './config';
module handlers from './handlers';

export var commandMatcher = function (command) {
    var result;
    if (result = /^(?:let )?(.+?) cooks? instead of (.+)$/igm.exec(command)) {
        return {
            command: 'replace',
            from: result[2].trim(),
            to: result[1].trim()
        };
    } else if(result = /^(?:let )?(.+? )?cooks?( .+?)?( tomorrow)?( at (.+?)( tomorrow)?)?$/igm.exec(command)) {
        return {
            command: 'cook',
            party: undefined === result[1] ? 'I' : result[1].trim(),
            dish: undefined === result[2] ? 'noms' : result[2].trim(),
            time: undefined === result[5] ? undefined : result[5].trim(),
            tomorrow: undefined !== result[6] || undefined !== result[3]
        };
    } else if (result = /^(.+? )?(?:joins?|eats?( at)?)( .+)?$/igm.exec(command)) {
        return {
            command: 'join',
            who: undefined === result[1] ? 'I' : result[1].trim(),
            party: undefined === result[3] ? undefined : result[3].trim()
        };
    } else if (result = /^(.+? )?(leaves?|parts?)( .+)?$/igm.exec(command)) {
        return {
            command: 'part',
            who: undefined === result[1] ? 'I' : result[1].trim(),
            party: undefined === result[3] ? undefined : result[3].trim()
        };
    } else if (result = /^(?:list|info|about)( with (?:hilight|highlight|hl))?( (.+?))?$/igm.exec(command)) {
        return {
            command: 'list',
            party: undefined === result[2] ? undefined : result[2].trim(),
            highlight: undefined !== result[1]
        };
    } else if (result = /^(clear|reset|forget)( .+)?$/igm.exec(command)) {
        return {
            command: 'clear',
            party: undefined === result[2] ? undefined : result[2].trim()
        };
    } else if (result = /^help$/igm.exec(command)) {
        return {
            command: 'help'
        };
    } else {
        return {
            command: false
        };
    }
};

export var fix = function (cmd, requester, data) {
    if (Object.keys(data).length === 1) {
        var key = Object.keys(data)[0];
        if (cmd.party === undefined && ['join', 'part', 'list', 'clear'].indexOf(cmd.command) !== -1) {
            cmd.party = key;
        }
    }

    if (cmd.who && cmd.who.toUpperCase() === 'I') {
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
