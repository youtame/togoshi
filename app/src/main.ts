import { createApp } from 'vue'
import App from './App.vue'

// mdi
import '@mdi/font/css/materialdesignicons.css'
import { mdi } from 'vuetify/iconsets/mdi'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
        light: {
            colors: {
                primary: '#cc4e45',
                secondary: '#03DAC6',
                error: '#ff0000'
            },
        },
        dark: {
            colors: {
                primary: '#ec6e65',
                secondary: '#03DAC6',
                error: '#ff0000'
            },
        },
        },
    },
    icons: {
        defaultSet: 'mdi',
        sets: {
        mdi,
        },
    },
})

createApp(App)
    .use(vuetify)
    .mount('#app')