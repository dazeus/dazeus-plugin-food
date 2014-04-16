export default {
    commands: [
        'food',
        'f',
        'cook'
    ],
    store: 'dazeus-plugin-food.list',
    no_highlight_char: '~',
    messages: {
        unknown_command: "Sorry, I don't understand what you mean, use '^ help' to get help.",
        undefined_handler: "Whoops, a handler for this command was not defined.",
        no_such_party: "There is no cook $party, you can pick one of these: $parties",
        no_such_party_and_no_existing: "There is no cook $party, create a new event using '^ I cook noms'",
        party: "$cook is cooking $dish for $people $when (last edited $ago)",
        party_with_time: "$cook is cooking $dish for $people $when at $time (last edited $ago)",
        party_history: "$cook was cooking $dish for $people $when (last edited $ago)",
        party_history_with_time: "$cook was cooking $dish for $people $when at $time (last edited $ago)",
        parties: "Use '^ info [party]' to get info about a single party, these are available: $parties",
        sending_help: "Allright, sending you the help.",
        which_party_over: "Which one do you want me to remove? Active: $parties",
        no_parties: "There is nothing going on.",
        party_removed: "$cook no longer cooks",
        created: "$cook is now cooking $dish",
        replaced: "Allright, $to is now cooking instead of $from",
        joined: "$who is now eating at $party",
        already_joined: "$who already eats at $party",
        parted: "$who no longer eats at $party",
        not_joined: "$who does not eat at $party",
        part_multiple_which: "Where would $who no longer like to eat: $parties",
        join_multiple_which: "There is so much food to choose from: $parties"
    }
};
