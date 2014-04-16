import config from "./config";
module dazeus from "dazeus";
module util from "./util";

// lets parse command line args
var argv = dazeus.optimist().argv;
dazeus.help(argv);
var options = dazeus.optionsFromArgv(argv);

var client = dazeus.connect(options, () => {
    var runner = (network, user, channel, execCmd, args, ...rest) => {
        client.getProperty(config.store, [network], (result) => {
            var data = typeof result.value !== 'undefined' ? JSON.parse(result.value) : {};
            var command = util.fix(util.commandMatcher(args), user, data);

            util.processUpdates(command, data, (msg, notice = false) => {
                client.highlightCharacter((char) => {
                    var cmdPrefix = char + execCmd;
                    msg = msg.replace(/\^/g, cmdPrefix);
                    if (notice) {
                        client.notice(network, user, msg);
                    } else {
                        client.reply(network, channel, user, msg, false);
                    }
                });
            });

            client.setProperty(config.store, JSON.stringify(data), [network]);
        });
    };

    for (var c of config.commands) {
        client.onCommand(c, runner);
    }
});
