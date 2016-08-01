import tree from "~/store";


class Log {

    constructor(name) {
        this.name = name;
    }

    _getCurrentLevel() {
        return tree.select('settings', 'advanced', 'logLevel').get();
    }

    _wrapMsg(msg) {
        var newMsg = "[" + this.name + "]: ";
        newMsg += msg;
        return newMsg;
    }

    error(msg) {
        if (["Error", "Warning", "Info", "Debug"].indexOf(this._getCurrentLevel()) > -1) {
            console.log("%c" + this._wrapMsg(msg), "color:Red");
        }
    }

    warn(msg) {
        if (["Warning", "Info", "Debug"].indexOf(this._getCurrentLevel()) > -1) {
            console.log("%c" + this._wrapMsg(msg), "color:Tomato");
        }
    }

    info(msg) {
        if (["Info", "Debug"].indexOf(this._getCurrentLevel()) > -1) {
            console.log("%c" + this._wrapMsg(msg), "color:DodgerBlue");
        }
    }

    debug(msg) {
        if (["Debug"].indexOf(this._getCurrentLevel()) > -1) {
            console.log("%c" + this._wrapMsg(msg), "color:Orchid");
        }
    }

}

export default Log;
