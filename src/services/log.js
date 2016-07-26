import tree from "~/store";

class Log {

    info(msg) {
        var currentLevel = tree.get().logLevel;
        if (['info', 'error', 'debug'].indexOf(currentLevel) > -1) {
            console.info(msg);
        }
    }

    error(msg) {
        var currentLevel = tree.get().logLevel;
        if (['error', 'debug'].indexOf(currentLevel) > -1) {
            console.error(msg)
        }
    }

    debug(msg) {
        var currentLevel = tree.get().logLevel;
        if (['debug'].indexOf(currentLevel) > -1) {
            console.log(msg);
        }
    }
}

var log = new Log();

export default log;
