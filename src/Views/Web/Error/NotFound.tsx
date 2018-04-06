import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<{}> {}

@observer
export class ErrorNotFound extends React.Component<IProps, {}> {
    public render() {
        return <div>
            <h1>
                Error
            </h1>

            Page not found.
        </div>;
    }
}
