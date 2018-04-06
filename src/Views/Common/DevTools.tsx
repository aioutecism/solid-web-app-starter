import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface IProps {}

@observer
export class DevTools extends React.Component<IProps, {}> {
    @observable private MobxReactDevtools: any = null;

    public componentDidMount() {
        if (process.env.NODE_ENV === 'development') {
            this.load();
        }
    }

    public render() {
        return <div>
            {this.MobxReactDevtools && <this.MobxReactDevtools />}
        </div>;
    }

    private load = async () => {
        this.MobxReactDevtools = (await import(/* webpackChunkName: 'devtools' */ 'mobx-react-devtools')).default;
    }
}
