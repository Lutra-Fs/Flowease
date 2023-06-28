import {defineConfig as tsupDefineConfig, Options} from 'tsup';

export default function defineConfig({
                                 clean = true,
                                 bundle = true,
                                 dts = true,
                                 format = ['cjs', 'esm'],
                                 keepNames = true,
                                 minify = false,
                                 esbuildPlugins = [],
                                 entry = ['./index.ts'],
                                 skipNodeModulesBundle = true,
                                 sourcemap = true,
                                 target = 'es2020',
                                 silent = true,
                                 shims = true
                             }: Options) {
    return tsupDefineConfig({
        clean,
        bundle,
        dts,
        format,
        keepNames,
        minify,
        esbuildPlugins,
        entry,
        skipNodeModulesBundle,
        sourcemap,
        target,
        silent,
        shims
    });
}