import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';

import appState from '@States/App';
import { DevTools } from '@Views/Common/DevTools';
import { RootRoute } from '@Views/Common/RootRoute';
import { ErrorNotFound } from '@Views/Web/Error/NotFound';
import { Top } from '@Views/Web/Top';

import './Root.css';

interface IProps extends RouteComponentProps<{}> {}

@observer
export class WebRoot extends React.Component<IProps, {}> {
    public componentWillReceiveProps(nextProps: Readonly<IProps>) {
        if (nextProps.location !== this.props.location) {
            appState.ui.lastLocation = this.props.location;
        }
    }

    public render() {
        if (!appState.ready) {
            return 'Loading…';
        }

        return <div>
            <Switch>
                <RootRoute exact path="/" component={Top} />

                <RootRoute component={ErrorNotFound} />
            </Switch>

            <DevTools />
        </div>;
    }
}
