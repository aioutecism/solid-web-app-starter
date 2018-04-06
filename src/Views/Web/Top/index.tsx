import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<{}> {}

@observer
export class Top extends React.Component<IProps, {}> {
    public render() {
        return <div>
            <h1>
                Top
            </h1>

            Hello!
        </div>;
    }
}
