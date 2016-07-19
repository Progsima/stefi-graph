import React from 'react';
import Baobab from "baobab";

import {root} from 'baobab-react/higher-order';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import CypherEditor from '../cyphereditor';


function mountWithtree(Component, tree) {
    const application = React.createClass({ render() { return <div></div>; } });
    const RootedApp = root(new Baobab(tree, {asynchronous: false}), application);
    return mount(<RootedApp><Component/></RootedApp>);
}

describe('cyphereditor', function () {

    it('renders without problems', function () {
        const wrapper = mountWithtree(CypherEditor, {});
        expect(wrapper).to.exist;
    });
});
