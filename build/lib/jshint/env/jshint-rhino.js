/*jshint boss: true */
load("jshint.js");
(function (args) {
    var name   = args[0].split(" "),
        nameIndex = 0,
        nameLen = name.length,
        optstr = args[1], // arg1=val1,arg2=val2,...
        predef = args[2], // global1=override,global2,global3,...
        opts   = { rhino: true },
        input;

    if (!name.length) {
        print('Usage: jshint.js file.js');
        quit(1);
    }

    if (optstr) {
        optstr.split(',').forEach(function (arg) {
            var o = arg.split('=');
            opts[o[0]] = (function (ov) {
                switch (ov) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return ov;
                }
            })(o[1]);
        });
    }

    if (predef) {
        opts.predef = {};
        predef.split(',').forEach(function (arg) {
            var global = arg.split('=');
            opts.predef[global[0]] = (function (override) {
                return (override === 'false') ? false : true;
            })(global[1]);
        });
    }

    for(nameIndex = 0; nameIndex < nameLen; ++nameIndex) {
        print(name[nameIndex] + "\r");
        input = readFile(name[nameIndex]);

        if (!input) {
            print('jshint: Couldn\'t open file ' + name);
            quit(1);
        }

        if (!JSHINT(input, opts)) {
            for (var i = 0, err; err = JSHINT.errors[i]; i++) {
                print(name[nameIndex] + ':' + err.line + ':' + err.character + ': ' + err.reason);
                print('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                print('');
            }
            quit(1);
        }
    }

    quit(0);
}(arguments));