import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Donut from '../donut';

describe('donut', function () {

    it('renders without problems', function () {
        var data = [
            {label: "Movie", value: 10, color: '#24DBFF'},
            {label: "Person", value: 30, color: '#006FE3'},
            {label: "Actor", value: 90, color: '#3FCBFF'}
        ];
        var donut = mount(<Donut title="ExampleAZ" data= {data}/>);
        expect(donut).to.exist;
    });
});
