/**
 * Function that permit to navigate into application pages.
 *
 * @param tree The baobab tree
 * @param view Identifier of the view
 */
export function navigateTo(tree, view) {
    // Setting key view into baobab tree
    tree.set('view', view);
    // Change the windows location
    window.location.hash = view;
}
