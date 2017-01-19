import Log from "~/services/log";
import {pushNotification}from "~/components/notifications/actions";
/**
 * Module logger.
 */
const log = new Log("Actions.settings");

/**
 * Saving server settings in state.
 */
export function saveSettingsServer(tree, conf) {
    tree.select('settings', 'server').set(conf);
    pushNotification(tree, {
        title: "Success: ",
        message: "Server configuration has been successfully updated",
        type : "success"
    });
}

/**
 * Saving application settings in state.
 */
export function saveSettingsApplication(tree, conf) {
    tree.select('settings', 'application').set(conf);
    pushNotification(tree, {
        title: "Success: ",
        message: "Application configuration has been successfully updated",
        type : "success"
    });
}

/**
 * Saving chart-sigma settings in state.
 */
export function saveSettingsSigma(tree, conf) {
    tree.select('settings', 'sigma').deepMerge(conf);
    pushNotification(tree, {
        title: "Success: ",
        message: "Sigma configuration has been successfully updated",
        type : "success"
    });
}

/**
 * Saving chart-sigma settings in state.
 */
export function saveSettingsLayout(tree, conf) {
    tree.select('settings', 'layout').deepMerge(conf);
    pushNotification(tree, {
        title: "Success: ",
        message: "Layout configuration has been successfully updated",
        type : "success"
    });
}

/**
 * Saving setting graph style
 */
export function saveSettingsStyle(tree, conf) {
    tree.select('settings','style').set(conf);
    pushNotification(tree, {
        title: "Success: ",
        message: "Graph style has been successfully updated",
        type : "success"
    });
}
