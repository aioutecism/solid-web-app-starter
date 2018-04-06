const path = require('path');

module.exports = {
    plugins: [
        require('stylelint')(),
        require('postcss-import')({
            path: [
                path.resolve(__dirname, ...'src/Views'.split('/')),
            ],
        }),
        require('postcss-cssnext')(),
        require('postcss-assets')({
            loadPaths: ['./src/Assets/'],
            relative: true,
        }),
    ]
};
