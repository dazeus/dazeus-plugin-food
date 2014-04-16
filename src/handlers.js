import config from "./config";
import {parties, partyList, party_exists, list_party_no_hl, list_party, nohl} from './output_util';

// adding new parties or replacing the dish and or time of an existing party
export var cook = function (cmd, data, reply) {
    var oldParty = data[cmd.party];
    data[cmd.party] = {
        people: [],
        dish: cmd.dish,
        time: cmd.time === undefined ? false : cmd.time,
        tomorrow: cmd.tomorrow,
        edited: (new Date()).toISOString(),
        created: (new Date()).toISOString()
    };

    if (undefined !== oldParty) {
        data[cmd.party].people = oldParty.people;
    }
    reply(config.messages.created.replace('$cook', cmd.party).replace('$dish', cmd.dish));
};

// replace the cook of an existing party
export var replace = function (cmd, data, reply) {
    if (party_exists(cmd.from, data, reply)) {
        data[cmd.to] = data[cmd.from];
        delete data[cmd.from];
        reply(config.messages.replaced.replace('$from', cmd.from).replace('$to', cmd.to));
    }
};

// add a person to the party
export var join = function (cmd, data, reply) {
    if (undefined === cmd.party) {
        reply(config.messages.join_multiple_which.replace('$parties', partyList(data)))
    } else if (party_exists(cmd.party, data, reply)) {
        if (data[cmd.party].people.indexOf(cmd.who) !== -1) {
            reply(config.messages.already_joined.replace('$party', cmd.party).replace('$who', cmd.who));
        } else {
            data[cmd.party].people.push(cmd.who);
            reply(config.messages.joined.replace('$party', cmd.party).replace('$who', cmd.who));
        }
    }
};

// remove a person from the party
export var part = function (cmd, data, reply) {
    if (undefined === cmd.party) {
        reply(config.messages.part_multiple_which.replace('$parties', partyList(data)).replace('$who', cmd.who));
    } else if (party_exists(cmd.party, data, reply)) {
        if (data[cmd.party].people.indexOf(cmd.who) === -1) {
            reply(config.messages.not_joined.replace('$party', cmd.party).replace('$who', cmd.who));
        } else {
            data[cmd.party].people.splice(data[cmd.party].people.indexOf(cmd.who), 1);
            reply(config.messages.parted.replace('$party', cmd.party).replace('$who', cmd.who));
        }
    }
};

// list all parties or the info of a single party
export var list = function (cmd, data, reply) {
    var party, goers, message;

    if (cmd.party) {
        if (party_exists(cmd.party, data, reply)) {
            list_party(cmd.party, data[cmd.party], reply, false, true);
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
        } else if (party_exists(cmd.party, data, reply)) {
            party = data[cmd.party];
            delete data[cmd.party];
            list_party_no_hl(cmd.party, party, reply, true);
            reply(config.messages.party_removed.replace('$cook', nohl(cmd.party)));
        }
    }
};

// show help message
export var help = function (cmd, data, reply) {
    reply(config.messages.sending_help);

    reply("Creating a new cooking party is done using '^ cook'.", true);
    reply("Other elaborate forms include: '^ cook dish', '^ I cook noms at place and time', '^ John cooks veggies tomorrow at 18:00' and similar", true);
    reply("You can join an existing party using '^ join'. Also allowed: '^ John joins Jane', '^ I eat at Jane' and similar", true);
    reply("You can leave a party using: '^ leave'. Also allowed: '^ John parts Jane', '^ I leave John' and similar", true);
    reply("An existing cooking party is disbanded using '^ clear'. Also allowed: '^ forget Jane', '^ reset John'", true);
    reply("To get a list of the current parties use '^ list', or if you want the details of a single party: '^ list John'", true);
    reply("You can replace the cook for a party using: '^ X cooks instead of Y'", true);
    reply("Finally, this help message is shown using '^ help'", true);
};
