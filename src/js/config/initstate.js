import configApplication from "~/config/application";
import configNeo4j from "~/config/neo4j";
import configSigma from "~/config/sigma";
import configSigmaLayout from "~/config/sigma-layout";
import sigmaGraphStyle from "~/config/sigma-graph-style";

/**
 * Configuration object for the initialisation fo the state
 */
const configInitState = {
	view: 'home',
	data: {
       graph: {
            nodes: [],
            edges: []
        },
        row:{},
        over: null,
        selected: [],
        hidden: [],
        runLayout: true // do we need to run the layout on refresh ?
    },
    queries: {
        current: 'MATCH (n) RETURN n LIMIT 25',
        history: [],
        favory: []
    },
	notifications: [],
	settings: {
		wizard:true,
		application: configApplication,
		neo4j: configNeo4j,
		sigma: configSigma,
		layout: configSigmaLayout,
    style: sigmaGraphStyle
	}
}

export default configInitState;
