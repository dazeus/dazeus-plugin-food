import config from './config';

export default function (command) {
    var result;
    if (result = config.regexes.replace.exec(command)) {
        return {
            command: 'replace',
            from: result[2].trim(),
            to: result[1].trim()
        };
    } else if(result = config.regexes.cook.exec(command)) {
        return {
            command: 'cook',
            party: undefined === result[1] ? 'I' : result[1].trim(),
            dish: undefined === result[2] ? 'noms' : result[2].trim(),
            time: undefined === result[5] ? undefined : result[5].trim(),
            tomorrow: undefined !== result[6] || undefined !== result[3]
        };
    } else if (result = config.regexes.join.exec(command)) {
        return {
            command: 'join',
            who: undefined === result[1] ? 'I' : result[1].trim(),
            party: undefined === result[3] ? undefined : result[3].trim()
        };
    } else if (result = config.regexes.part.exec(command)) {
        return {
            command: 'part',
            who: undefined === result[1] ? 'I' : result[1].trim(),
            party: undefined === result[3] ? undefined : result[3].trim()
        };
    } else if (result = config.regexes.list.exec(command)) {
        return {
            command: 'list',
            party: undefined === result[2] ? undefined : result[2].trim(),
            highlight: undefined !== result[1]
        };
    } else if (result = config.regexes.clear.exec(command)) {
        return {
            command: 'clear',
            party: undefined === result[2] ? undefined : result[2].trim()
        };
    } else if (result = config.regexes.help.exec(command)) {
        return {
            command: 'help',
            regex: result[1] !== undefined
        };
    } else {
        return {
            command: false
        };
    }
};
