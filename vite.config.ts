import {fileURLToPath, URL} from 'node:url'

import {defineConfig, PluginOption} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({command}) => {
    const plugins: PluginOption[] = [vue()]
    if (command === 'serve') {
        plugins.push(vueDevTools())
    }

    return {
        plugins,
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: process.env.VITE_API_TARGET || 'http://localhost:8080',
                    changeOrigin: true
                }
            }
        }
    }
})
