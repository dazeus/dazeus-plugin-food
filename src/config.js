export default {
    commands: [
        'food',
        'f',
        'cook'
    ],
    store: 'dazeus-plugin-food.list',
    no_highlight_char: '~',
    command_replace: '%%',
    regexes: {
        replace: /^(?:let )?(.+?) cooks? instead of (.+)$/im,
        cook: /^(?:let )?(.+? )?cooks?( .+?)?( tomorrow)?( at (.+?)( tomorrow)?)?$/im,
        join: /^(?:let )?(.+? )?(?:joins?|eats?( at)?)( .+)?$/im,
        part: /^(?:let )?(.+? )?(leaves?|parts?)( .+)?$/im,
        list: /^(?:list|info|about)( with (?:hilight|highlight|hl)s?)?( (.+?))?$/im,
        clear: /^(clear|reset|forget)( .+)?$/im,
        help: /^help((?: in)? regex(es)?)?$/im
    },
    messages: {
        unknown_command: "Sorry, I don't understand what you mean, use '%% help' to get help.",
        undefined_handler: "Whoops, a handler for this command was not defined.",
        no_such_party: "There is no cook $party, you can pick one of these: $parties",
        no_such_party_and_no_existing: "There is no cook $party, create a new event using '%% I cook noms'",
        party: "$cook is cooking $dish for $people $when (last edited $ago)",
        party_with_time: "$cook is cooking $dish for $people $when at $time (last edited $ago)",
        party_history: "$cook was cooking $dish for $people $when (last edited $ago)",
        party_history_with_time: "$cook was cooking $dish for $people $when at $time (last edited $ago)",
        parties: "Use '%% info [party]' to get info about a single party, these are available: $parties",
        sending_help: "Alright, sending you the help.",
        sending_help_regex: "Alright, sending you the help for haxxors.",
        which_party_over: "Which one do you want me to remove? Active: $parties",
        no_parties: "There is nothing going on.",
        party_removed: "$cook no longer cooks",
        created: "$cook is now cooking $dish",
        replaced: "Alright, $to is now cooking instead of $from",
        joined: "$who is now eating at $party",
        already_joined: "$who already eats at $party",
        parted: "$who no longer eats at $party",
        not_joined: "$who does not eat at $party",
        part_multiple_which: "Where would $who no longer like to eat: $parties",
        join_multiple_which: "There is so much food to choose from: $parties",
        help: [
            "Creating a new cooking party is done using '%% cook'.",
            "Other elaborate forms include: '%% cook dish', '%% I cook noms at place and time', '%% John cooks veggies tomorrow at 18:00' and similar",
            "You can join an existing party using '%% join'. Also allowed: '%% John joins Jane', '%% I eat at Jane' and similar",
            "You can leave a party using: '%% leave'. Also allowed: '%% John parts Jane', '%% I leave John' and similar",
            "An existing cooking party is disbanded using '%% clear'. Also allowed: '%% forget Jane', '%% reset John'",
            "To get a list of the current parties use '%% list', or if you want the details of a single party: '%% list John'",
            "Use '%% list with highlights John' for getting the details of a single party without anti-highlighting",
            "You can replace the cook for a party using: '%% X cooks instead of Y'",
            "Finally, this help message is shown using '%% help'"
        ]
    }
};
