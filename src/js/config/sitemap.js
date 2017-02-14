import Home from '~/pages/home/page';
import SettingsNeo4j from '~/pages/settings/neo4j/page';
import SettingsSigmaLayout from '~/pages/settings/layout/page';
import SettingsSigma from '~/pages/settings/sigma/page';
import SettingsApplication from '~/pages/settings/application/page';
import SettingsGraphStyle from '~/pages/settings/style/page';
import QueryFavory from '~/components/query/favory/component';
import SimpleGraphDisplay from '~/pages/simple-graph-display/page';

/**
 * Configuration object for the sitemap
 */

/**
 * Sitemap of the application.
 *
 * Each object should have :
 *  - path : for the router
 *  - name : will be display in menu
 *  - title : will be the title of the page
 *  - hidden (true/false) : if the item should be display into main menu
 *  - component : component that will be loaded to display the page
 *  - expand (true/false) : if there is an array of sub-pages, do we display a list into the menu ?
 *  - state : the constraint on state for the router (it's bi-directional with the hash)
 *     - must have a view, and it must be unique across all page.
 *  - an array of sub-pages if needed
 *
 *  If an item has no path & no state, it's not a route, but an item to add to the menu
 */
const configSitemap = {
  defaultRoute: '/home',
  pages: [
    {
      path: '/home',
      name: 'Accueil',
      title: 'Accueil',
      component: Home,
      state: {
        view: 'home'
      }
    },
    {
      path: '/full-graph',
      name: 'Graph',
      title: 'Graph',
      component: SimpleGraphDisplay,
      state: {
        view: 'full-graph'
      }
    },
    {
      name: 'Favories',
      component: QueryFavory
    },
    {
      path: '/settings',
      name: 'Configuration',
      title: 'Configuration',
      defaultRoute: '/application',
      state: {
        view: 'settings'
      },
      expand : false,
      pages: [
        {
          path: '/application',
          name: 'Application',
          title: 'Application configuration',
          component: SettingsApplication,
          state: {
            view: 'settings.application'
          }
        },
        {
          path: '/server',
          name: 'Neo4j',
          title: 'Neo4j configuration',
          component: SettingsNeo4j,
          state: {
            view: 'settings.neo4j'
          }
        },
        {
          path: '/sigma',
          name: 'Sigma',
          title: 'Sigma configuration',
          component: SettingsSigma,
          state: {
            view: 'settings.sigma'
          }
        },
        {
          path: '/layout',
          name: 'Sigma layout',
          title: 'Sigma layout configuration',
          component: SettingsSigmaLayout,
          state: {
            view: 'settings.layout'
          }
        },
        {
          path: '/style',
          name: 'Graph style',
          title: 'Sigma style configuration',
          component: SettingsGraphStyle,
          state: {
            view: 'settings.graphStyle'
          }
        }
      ]
    }
  ]
}

export default configSitemap;
