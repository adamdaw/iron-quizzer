import lwc from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

const dev = process.env.BUILD !== 'production';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'esm',
    },
    plugins: [
        lwc(),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
        }),
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
                { src: 'src/resources', dest: 'dist' },
            ],
            hook: 'writeBundle',
        }),
    ],
};
