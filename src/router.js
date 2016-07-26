import Router from "baobab-router";
import tree from "~/store";
import config from "~/config";
import log from '~/services/log';

/**
 * Function that convert the sitemap object to a router configuration object.
 */
function sitemapToRoutes(sitemap) {
    var result = [];

    sitemap.forEach((page) => {
        var routerItem = {};

        if (page.hasOwnProperty('path')) {
            routerItem['path'] = page['path'];
        }
        if (page.hasOwnProperty('state')) {
            routerItem['state'] = page['state'];
        }
        if (page.hasOwnProperty('defaultRoute')) {
            routerItem['defaultRoute'] = page['defaultRoute'];
        }
        if (page.hasOwnProperty('pages')) {
            routerItem['routes'] = sitemapToRoutes(page.pages);
        }

        result.push(routerItem);
    });

    return result;
}

// Adding the default route
var routerConfig = {
    defaultRoute : config.defaultRoute,
    routes: sitemapToRoutes(config.sitemap)
};

log.debug("[ROUTER]: Config is " + JSON.stringify(routerConfig));

// Configure the router
const router = new Router(tree, routerConfig);

export default router;
