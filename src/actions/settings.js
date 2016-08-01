
/**
 * Saving server settings in state.
 */
export function saveSettingsServer(tree, conf) {
    tree.select('settings', 'server').set(conf);
}

/**
 * Saving advanced settings in state.
 */
export function saveSettingsAdvanced(tree, conf) {
    tree.select('settings', 'advanced').set(conf);
}

/**
 * Saving sigma settings in state.
 */
export function saveSettingsSigma(tree, conf) {
    tree.select('settings', 'sigma').deepMerge(conf);
}

