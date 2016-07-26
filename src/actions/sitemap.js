import config from "./../config";
import log from './../services/log';

/**
 * Function that permit to navigate into application pages.
 *
 * @param page The page to navigate
 * @param tree The baobab tree
 */
export function navigateTo(tree, page) {
    log.debug("[SITEMAP]: Navigate to page " + JSON.stringify(page));

    // Setting key view into baobab tree
    tree.set('view', page.state.view);

    // Change the windows location
    window.location.hash = getPageHashFromView(page.state.view);
}

/**
 * Function that return the hash of a page, defined by its view.
 *
 * @param view The view of the page to find.
 * @param sitemapBranch If not defined, take the all sitemap
 * @returns String that represent the hash
 */
export function getPageHashFromView(view, sitemapBranch = config.sitemap) {
    log.debug("[SITEMAP]: view is : " + view + " \n branch is :" + JSON.stringify(sitemapBranch));

    var hash;
    sitemapBranch.forEach((item) => {
        if (item.state.view === view) {
            hash = item.path;
        }
        if (!hash && item.hasOwnProperty('pages')) {
            hash = item.path + getPageFromView(view, item.pages).path;
        }
    });

    log.debug("[SITEMAP]: Find hash " + hash + " for view " + view);
    return hash;
}

/**
 * Function that return the corresponding page of the view.
 *
 * @param view The view of the page to find.
 * @param sitemapBranch If not defined, take the all sitemap
 * @returns {Object} The page object.
 */
export function getPageFromView(view, sitemapBranch = config.sitemap) {
    var page;

    sitemapBranch.forEach((item) => {
        if (item.state.view === view) {
            page = item;
        }
        if (!page && item.hasOwnProperty('pages')) {
            page = getPageFromView(view, item.pages)
        }
    });
    log.debug("[SITEMAP]: Find page " + JSON.stringify(page) + " for view " + view);
    return page;
}


