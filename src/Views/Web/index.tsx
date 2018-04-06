import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import { WebRoot } from './Root';

const $container = document.createElement('div');
document.body.appendChild($container);

render(
    <BrowserRouter basename={`/`}>
        <Route component={WebRoot} />
    </BrowserRouter>,
    $container,
);
