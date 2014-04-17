import config from "./config";
import {parties, partyList, partyExists, listPartyNoHl, listParty, nohl, partyName} from './output_util';

// adding new parties or replacing the dish and or time of an existing party
export var cook = function (cmd, data, reply) {
    var oldParty = data[partyName(cmd)];
    data[partyName(cmd)] = {
        name: cmd.party,
        people: [],
        dish: cmd.dish,
        time: cmd.time === undefined ? false : cmd.time,
        tomorrow: cmd.tomorrow,
        edited: (new Date()).toISOString(),
        created: (new Date()).toISOString()
    };

    if (undefined !== oldParty) {
        data[partyName(cmd)].people = oldParty.people;
    }
    reply(config.messages.created.replace('$cook', data[partyName(cmd)].name).replace('$dish', cmd.dish));
};

// replace the cook of an existing party
export var replace = function (cmd, data, reply) {
    if (partyExists(cmd.from, data, reply)) {
        var oldname = data[partyName(cmd.from)].name;
        data[partyName(cmd.to)] = data[partyName(cmd.from)];
        data[partyName(cmd.to)].name = cmd.to;
        data[partyName(cmd.to)].edited = (new Date()).toISOString();
        if (partyName(cmd.to)) !== partyName(cmd.from)) {
            delete data[partyName(cmd.from)];
        }
        reply(config.messages.replaced.replace('$from', oldname).replace('$to', cmd.to));
    }
};

// add a person to the party
export var join = function (cmd, data, reply) {
    if (undefined === cmd.party) {
        reply(config.messages.join_multiple_which.replace('$parties', partyList(data)))
    } else if (partyExists(cmd.party, data, reply)) {
        if (data[partyName(cmd)].people.indexOf(cmd.who) !== -1) {
            reply(config.messages.already_joined.replace('$party', data[partyName(cmd)].name).replace('$who', cmd.who));
        } else {
            data[partyName(cmd)].people.push(cmd.who);
            data[partyName(cmd)].edited = (new Date()).toISOString();
            reply(config.messages.joined.replace('$party', data[partyName(cmd)].name).replace('$who', cmd.who));
        }
    }
};

// remove a person from the party
export var part = function (cmd, data, reply) {
    if (undefined === cmd.party) {
        reply(config.messages.part_multiple_which.replace('$parties', partyList(data)).replace('$who', cmd.who));
    } else if (partyExists(cmd.party, data, reply)) {
        if (data[partyName(cmd)].people.indexOf(cmd.who) === -1) {
            reply(config.messages.not_joined.replace('$party', data[partyName(cmd)].name).replace('$who', cmd.who));
        } else {
            data[partyName(cmd)].people.splice(data[partyName(cmd)].people.indexOf(cmd.who), 1);
            data[partyName(cmd)].edited = (new Date()).toISOString();
            reply(config.messages.parted.replace('$party', data[partyName(cmd)].name).replace('$who', cmd.who));
        }
    }
};

// list all parties or the info of a single party
export var list = function (cmd, data, reply) {
    var party, goers, message;

    if (cmd.party) {
        if (partyExists(cmd.party, data, reply)) {
            if (cmd.highlight) {
                listParty(data[partyName(cmd)], reply, false, true);
            } else {
                listPartyNoHl(data[partyName(cmd)], reply, false);
            }

        }
    } else if (parties(data).length === 0) {
        reply(config.messages.no_parties);
    } else {
        reply(config.messages.parties.replace('$parties', partyList(data)));
    }
};

// remove a party
export var clear = function (cmd, data, reply) {
    var party;

    if (parties(data).length === 0) {
        reply(config.messages.no_parties);
    } else {
        if (!cmd.party) {
            reply(config.messages.which_party_over.replace('$parties', partyList(data)));
        } else if (partyExists(cmd.party, data, reply)) {
            party = data[partyName(cmd)];
            delete data[partyName(cmd)];
            listPartyNoHl(party, reply, true);
            reply(config.messages.party_removed.replace('$cook', nohl(party.name)));
        }
    }
};

// show help message
export var help = function (cmd, data, reply) {
    if (cmd.regex) {
        reply(config.messages.sending_help_regex);
        for (var regex of Object.keys(config.regexes)) {
            var r = config.regexes[regex].toString();
            reply(regex[0].toUpperCase() + regex.slice(1) + ' matched by ' + r, true);
        }
    } else {
        reply(config.messages.sending_help);
        for (var msg of config.messages.help) {
            reply(msg, true);
        }
    }
};
