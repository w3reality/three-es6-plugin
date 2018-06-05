const path = require('path');
const fs = require('fs');

class ThreeEs6Plugin {
    constructor(srcList) {
        this.srcList = srcList;
    }
    apply(compiler) {
        compiler.plugin('compile', (params) => {
            console.log('\n//////// compile start');
            let root = path.resolve('./node_modules');
            console.log('root:', root);
            const pathBuild = `${root}/three-es6-plugin/build`;
            fs.mkdirSync(pathBuild);
            fs.mkdirSync(`${pathBuild}/es6`);

            // .../node_modules/three/build/three.js -> .../node_modules/three/
            // let rootThree = require.resolve('three').replace('build/three.js', '');
            // console.log('rootThree:', rootThree);

            this.srcList.forEach((src) => {
                let fpath = `${root}/${src}`;
                let fname = path.basename(fpath);  // OBJLoader.js
                let fnameNoExt = path.basename(fpath, path.extname(fpath)); // OBJLoader
                // console.log(fpath, fname, fnameNoExt);

                // import * as THREE from 'three';
                // (body)
                // export default THREE.OBJLoader;
                //----
                // save to ${root}/three-es6-plugin/build/es6/OBJLoader.js
                //======== ========
                let str, dest = `${pathBuild}/es6/${fname}`;

                str = "import * as THREE from 'three';\n\n";
                fs.writeFileSync(dest, str, 'utf8')

                // https://stackoverflow.com/questions/33331603/append-one-large-file-to-other-large-file-in-nodejs
                let r = fs.createReadStream(fpath);
                let w = fs.createWriteStream(dest, {flags: 'a'});
                w.on('close', () => {
                    console.log(`\nwrote: ${dest}`);
                    str = `\nexport default THREE.${fnameNoExt};\n`;
                    fs.appendFileSync(dest, str, 'utf8')
                });
                r.pipe(w);
                //======== ========
            });

            // import OBJLoader from './es6/OBJLoader';
            // import OBJLoader from './es6/MTLLoader';
            // ...
            // export default { OBJLoader, MTLLoader, ... };
            //----
            // save to three-es6-plugin/build/index.js
            //======== ========
            this.srcList.forEach((src) => {
                let fpath = `${root}/${src}`;
                let fnameNoExt = path.basename(fpath, path.extname(fpath)); // OBJLoader
                let str, dest = `${pathBuild}/index.js`;
                str = `import ${fnameNoExt} from './es6/${fnameNoExt}'`;
                fs.writeFileSync(dest, str, 'utf8')
            });
            //======== ========
        });
        compiler.plugin('compilation', (compilation, params) => {
            compilation.plugin('optimize', () => {
                console.log('\n////////optimize start');
            });
        });
        compiler.plugin('emit', (compilation, callback) => {
            console.log('\n////////emit assets output start');
            callback();
        });
    }
}
module.exports = ThreeEs6Plugin;
