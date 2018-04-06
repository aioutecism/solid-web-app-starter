import UIStore from '@Stores/UI';

import { createState } from './Helper';

const appState = createState({
    ui: new UIStore(),
});

export default appState;
