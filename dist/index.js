const path = require('path');
const fs = require('fs');

class ThreeEs6Plugin {
    constructor(srcList) {
        this.srcList = srcList;
    }
    apply(compiler) {
        const onCompile = (params) => {
            // console.log('\nthree-es6-plugin: //////// compile start');
            let root = path.resolve('./node_modules');
            // console.log('root:', root);
            const pathBuild = `${root}/three-es6-plugin/es6`;

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
                // save to ${root}/three-es6-plugin/es6/OBJLoader.js
                //======== ========
                let str, dest = `${pathBuild}/${fname}`;

                str = "import * as THREE from 'three';\n\n";
                fs.writeFileSync(dest, str, 'utf8')

                // https://stackoverflow.com/questions/33331603/append-one-large-file-to-other-large-file-in-nodejs
                let r = fs.createReadStream(fpath);
                let w = fs.createWriteStream(dest, {flags: 'a'});
                w.on('close', () => {
                    str = `\nexport default THREE.${fnameNoExt};\n`;
                    fs.appendFileSync(dest, str, 'utf8')
                    console.log(`three-es6-plugin: generated: ${dest}`);
                });
                r.pipe(w);
                //======== ========
            });

            // import OBJLoader from './OBJLoader';
            // import OBJLoader from './MTLLoader';
            // ...
            // export default { OBJLoader, MTLLoader, ... };
            //----
            // save to three-es6-plugin/es6/index.js
            //======== ========
            let str, dest = `${pathBuild}/index.js`;
            fs.writeFileSync(dest, "// generated file\n", 'utf8')

            let names = [];
            this.srcList.forEach((src) => {
                let fpath = `${root}/${src}`;
                let fnameNoExt = path.basename(fpath, path.extname(fpath)); // e.g. OBJLoader
                names.push(fnameNoExt);
                str = `import ${fnameNoExt} from './${fnameNoExt}';\n`;
                fs.appendFileSync(dest, str, 'utf8')
            });

            str = `export default { ${names.toString()} };\n`;
            fs.appendFileSync(dest, str, 'utf8')
            console.log(`three-es6-plugin: generated: ${dest}`);
            //======== ========
        };

	if (compiler.hooks) { // webpack 4+
            compiler.hooks.compile.tap('ThreeEs6Plugin', onCompile);
	} else {
            compiler.plugin('compile', onCompile);
	}

        // compiler.plugin('compilation', (compilation, params) => {
        //     compilation.plugin('optimize', () => {
        //         console.log('\nthree-es6-plugin: //////// optimize start');
        //     });
        // });
        // compiler.plugin('emit', (compilation, callback) => {
        //     console.log('\nthree-es6-plugin: //////// emit assets output start');
        //     callback();
        // });
    }
}
module.exports = ThreeEs6Plugin;
