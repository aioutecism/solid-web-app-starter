declare module 'mobx-react-devtools';

declare module '*.css' {
    const content: any;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare const process: {
    env: {
        NODE_ENV: 'development' | 'production',
    },
};
