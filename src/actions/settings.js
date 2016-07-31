
/**
 * Saving server settings in state.
 */
export function saveSettingsServer(tree, conf) {
    tree.select('settings').set('server', conf);
}

/**
 * Saving advanced settings in state.
 */
export function saveSettingsAdvanced(tree, conf) {
    tree.select('settings').set('advanced', conf);
}

