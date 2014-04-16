import config from "./config";
var moment = require('moment');

export var parties = function (data) {
    return Object.keys(data);
};

export var partyList = function (data) {
    return parties(data).join(', ');
};

export var party_exists = function (party, data, reply) {
    if (undefined === data[party]) {
        if (parties(data).length === 0) {
            reply(config.messages.no_such_party_and_no_existing.replace('$party', party));
        } else {
            reply(config.messages.no_such_party.replace('$party', party).replace('$parties', partyList(data)));
        }
        return false;
    }
    return true;
};

export var nohl = function (str) {
    if (str.length < 1) {
        return str;
    }
    return str[0] + config.no_highlight_char + str.slice(1);
};

export var list_party_no_hl = function (party, details, reply, force_history = false) {
    var clone = JSON.parse(JSON.stringify(details));
    clone.people = [for (p of details.people) nohl(p)];
    list_party(nohl(party), clone, reply, force_history);
};

export var list_party = function (party, details, reply, force_history = false, no_hl_on_history = false) {
    var goers, takes_place, history, str;

    goers = details.people.join(', ');
    if (goers.length === 0) {
        goers = 'nobody';
    }

    takes_place = moment(details.created);
    if (details.tomorrow) {
        takes_place = takes_place.add(1, 'days');
    }


    history = false;
    if (takes_place.isBefore(moment().subtract(1, 'days'), 'day')) {
        takes_place = 'long ago';
        history = true;
    } else if (takes_place.isSame(moment().subtract(1, 'days'), 'day')) {
        takes_place = 'yesterday';
        history = true;
    } else if (takes_place.isSame(moment(), 'day')) {
        takes_place = 'today';
    } else if (takes_place.isAfter(moment(), 'day')) {
        takes_place = 'tomorrow';
    }

    if (force_history === true) {
        history = true;
    }

    if (history && no_hl_on_history) {
        list_party_no_hl(party, details, reply, force_history);
    } else {
        if (false !== details.time) {
            if (history) {
                str = config.messages.party_history_with_time;
            } else {
                str = config.messages.party_with_time;
            }
            str = str.replace('$time', details.time);
        } else {
            if (history) {
                str = config.messages.party_history;
            } else {
                str = config.messages.party;
            }
        }

        reply(str
            .replace('$when', takes_place)
            .replace('$cook', party)
            .replace('$people', goers)
            .replace('$dish', details.dish)
            .replace('$ago', moment(details.edited).fromNow())
        );
    }
};
