import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Alert from '../alert';

describe('alert', function () {

    it('renders without problems', function () {
        var component = mount(<Alert title="Oups!" message="An error appears in the apllication" type="danger" />);
        expect(component).to.exist;
    });
});
