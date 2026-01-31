<template>
    <v-app>
        <!-- AppBar -->
        <v-app-bar app>
            <v-app-bar-title>
                <div class="d-flex align-center">
                    <v-img
                        :src="currentLine.icon"
                        max-height="40"
                        max-width="40"
                        contain
                        alt="site logo"
                        class="icon-press"
                    />
                    <span class="mr-2 pl-4 font-weight-bold">{{
                        currentLine.name
                    }}</span>
                </div>
            </v-app-bar-title>
            <v-app-bar-nav-icon @click="drawer = !drawer" />
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer
            v-model="drawer"
            location="right"
            app
            temporary
            width="111"
        >
            <v-list>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn elevation="0" size="large" width="auto" to="/">
                            <v-icon
                                icon="mdi-home-outline"
                                size="large"
                            ></v-icon>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            elevation="0"
                            size="large"
                            width="auto"
                            to="/comments"
                        >
                            <v-icon
                                icon="mdi-comment-alert-outline"
                                size="large"
                            ></v-icon>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            @click="toggleTheme"
                            elevation="0"
                            size="large"
                            width="auto"
                        >
                            <v-icon size="large">
                                {{
                                    theme.global.current.value.dark
                                        ? 'mdi-white-balance-sunny'
                                        : 'mdi-weather-night'
                                }}
                            </v-icon>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title class="ma-auto">
                        <v-dialog width="auto">
                            <template
                                v-slot:activator="{ props: activatorProps }"
                            >
                                <v-btn
                                    v-bind="activatorProps"
                                    elevation="0"
                                    size="large"
                                    class="info-btn"
                                >
                                    <v-icon
                                        icon="mdi-information-outline"
                                        size="large"
                                    ></v-icon>
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <v-card
                                    title="このページについて"
                                    max-width="650px"
                                >
                                    <v-card-text>
                                        このページが利用する公共交通データは、公共交通オープンデータセンターにおいて提供されるものです。
                                        公共交通事業者により提供されたデータを元にしていますが、必ずしも正確・完全なものとは限りません。このページの表示内容について、公共交通事業者への直接の問合せは行わないでください。
                                        　</v-card-text
                                    >
                                    <v-card-actions>
                                        <v-btn
                                            color="primary"
                                            text="Close"
                                            class="close-btn"
                                            @click="isActive.value = false"
                                        ></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </template>
                        </v-dialog>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item v-for="item in lineItems" :key="item.to">
                    <v-list-item-title>
                        <v-btn
                            elevation="0"
                            size="large"
                            width="auto"
                            :to="item.to"
                        >
                            <v-img
                                :src="item.img"
                                max-height="30"
                                max-width="30"
                                contain
                                class="icon-press"
                            />
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-main class="main-view">
            <router-view />
        </v-main>
        <v-footer class="text-center d-flex flex-column ga-2 py-4">
            <v-divider class="my-2" thickness="2" width="50"></v-divider>

            <div class="text-caption font-weight-regular opacity-60">
                当サイトは、掲載されている鉄道会社が運営しているものではなく、鉄道会社の個別の承認を受けたものではありません
            </div>

            <div class="text-caption font-weight-regular opacity-60">
                サイト利用前に、ライセンス及びアプリの使用に関するお願いをご覧ください
            </div>

            <v-divider></v-divider>

            <div>{{ new Date().getFullYear() }} — <strong>102℃</strong></div>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTheme } from 'vuetify';
import { useRoute } from 'vue-router';

const drawer = ref(false);
const theme = useTheme();
const route = useRoute();

const lineId = computed<LineKey>(() => {
    const v = route.params.lineId;
    if (Array.isArray(v)) return v[0] as LineKey;
    return (v as LineKey) ?? 'home';
});

type LineItem = {
    to: string;
    img: string;
};

const lineItems: LineItem[] = [
    {
        to: '/line/asakusa',
        img: '/retration2/symbole/Asakusa-symbole.png',
    },
    {
        to: '/line/oedo',
        img: '/retration2/symbole/Oedo-symbole.png',
    },
    {
        to: '/line/shinjuku',
        img: '/retration2/symbole/Shinjuku-symbole.png',
    },
    {
        to: '/line/mita',
        img: '/retration2/symbole/Mita-symbole.png',
    },
    {
        to: '/line/blueline',
        img: '/retration2/symbole/BlueLine-symbole.png',
    },
    {
        to: '/line/greenline',
        img: '/retration2/symbole/GreenLine-symbole.png',
    },
    {
        to: '/line/timelimited/utsunomiya',
        img: '/retration2/symbole/Utsunomiya-symbole.png',
    },
    {
        to: '/line/timelimited/keihintohokunegishi',
        img: '/retration2/symbole/Keihintohokunegishi-symbole.png',
    },
    {
        to: '/line/timelimited/keiyo',
        img: '/retration2/symbole/Keiyo-symbole.png',
    },
    {
        to: '/line/timelimited/saikyokawagoe',
        img: '/retration2/symbole/Saikyokawagoe-symbole.png',
    },
    {
        to: '/line/timelimited/soburapid',
        img: '/retration2/symbole/Soburapid-symbole.png',
    },
    {
        to: '/line/timelimited/shonanshinjuku',
        img: '/retration2/symbole/Shonanshinjuku-symbole.png',
    },
    {
        to: '/line/timelimited/takasaki',
        img: '/retration2/symbole/Takasaki-symbole.png',
    },
    {
        to: '/line/timelimited/musashino',
        img: '/retration2/symbole/Musashino-symbole.png',
    },
    {
        to: '/line/timelimited/yokosuka',
        img: '/retration2/symbole/Yokosuka-symbole.png',
    },
    {
        to: '/line/timelimited/yokohama',
        img: '/retration2/symbole/Yokohama-symbole.png',
    },
];

const LINE_MAP = {
    home: { name: 'Retration', icon: '/retration2/symbole/retration-icon.png' },
    asakusa: {
        name: '浅草線列車走行位置',
        icon: '/retration2/symbole/Asakusa-symbole.png',
    },
    mita: {
        name: '三田線列車走行位置',
        icon: '/retration2/symbole/Mita-symbole.png',
    },
    shinjuku: {
        name: '新宿線列車走行位置',
        icon: '/retration2/symbole/Shinjuku-symbole.png',
    },
    oedo: {
        name: '大江戸線列車走行位置',
        icon: '/retration2/symbole/Oedo-symbole.png',
    },
    blueline: {
        name: 'ブルーライン走行位置',
        icon: '/retration2/symbole/BlueLine-symbole.png',
    },
    greenline: {
        name: 'グリーンライン走行位置',
        icon: '/retration2/symbole/GreenLine-symbole.png',
    },
    musashino: {
        name: 'JR武蔵野線列車走行位置',
        icon: '/retration2/symbole/Musashino-symbole.png',
    },
    shonanshinjuku: {
        name: '湘南新宿ライン走行位置',
        icon: '/retration2/symbole/Shonanshinjuku-symbole.png',
    },
    keihintohokunegishi: {
        name: '京浜東北.根岸線走行位置',
        icon: '/retration2/symbole/Keihintohokunegishi-symbole.png',
    },
    yokosuka: {
        name: 'JR横須賀線列車走行位置',
        icon: '/retration2/symbole/Yokosuka-symbole.png',
    },
    soburapid: {
        name: 'JR総武快速線列車走行位置',
        icon: '/retration2/symbole/Soburapid-symbole.png',
    },
    yokohama: {
        name: 'JR横浜線列車走行位置',
        icon: '/retration2/symbole/Yokohama-symbole.png',
    },
    utsunomiya: {
        name: 'JR宇都宮線列車走行位置',
        icon: '/retration2/symbole/Utsunomiya-symbole.png',
    },
    takasaki: {
        name: 'JR高崎線列車走行位置',
        icon: '/retration2/symbole/Takasaki-symbole.png',
    },
    keiyo: {
        name: 'JR京葉線列車走行位置',
        icon: '/retration2/symbole/Keiyo-symbole.png',
    },
    saikyokawagoe: {
        name: '埼京.川越線列車走行位置',
        icon: '/retration2/symbole/Saikyokawagoe-symbole.png',
    },
    chuosobulocal: {
        name: '中央総武線各駅停車走行位置',
        icon: '/retration2/symbole/Chuosobulocal-symbole.png',
    },
} as const;

type LineKey = keyof typeof LINE_MAP;
type LineInfo = (typeof LINE_MAP)[LineKey];

const LINE_THEME_COLOR: Record<string, { primary: string; secondary: string }> =
    {
        asakusa: {
            primary: '#ec6e65',
            secondary: '#f4a09a',
        },
        mita: {
            primary: '#0079c2',
            secondary: '#5bb6e5',
        },
        shinjuku: {
            primary: '#b0bf1e',
            secondary: '#d7e36a',
        },
        oedo: {
            primary: '#b6007a',
            secondary: '#e066ad',
        },
        blueline: {
            primary: '#2f56a5',
            secondary: '#66b0e8',
        },
        greenline: {
            primary: '#048d58',
            secondary: '#66d18e',
        },
        musashino: {
            primary: '#eb5a28',
            secondary: '#ff8a50',
        },
        soburapid: {
            primary: '#0067c0',
            secondary: '#66b0e8',
        },
        shonanshinjuku: {
            primary: '#e31f26',
            secondary: '#f32f36',
        },
        yokosuka: {
            primary: '#0067c0',
            secondary: '#66b0e8',
        },
        keihintohokunegishi: {
            primary: '#00b2e5',
            secondary: '#66d1f0',
        },
        yokohama: {
            primary: '#9acd32',
            secondary: '#d7e36a',
        },
        utsunomiya: {
            primary: '#f68b1e',
            secondary: '#ffb366',
        },
        takasaki: {
            primary: '#f68b1e',
            secondary: '#ffb366',
        },
        keiyo: {
            primary: '#c9252f',
            secondary: '#f0666a',
        },
        chuorapid: {
            primary: '#f15a22',
            secondary: '#ff8a50',
        },
        saikyokawagoe: {
            primary: '##00ac9a',
            secondary: '#66d18e',
        },
        nambu: {
            primary: '#ffd400',
            secondary: '#ffec66',
        },
        chuosobulocal: {
            primary: '#ffd400',
            secondary: '#ffec66',
        },
    };

const currentLine = computed<LineInfo>(() => {
    return LINE_MAP[lineId.value] ?? LINE_MAP.home;
});

watch(
    () => lineId.value,
    (newLine) => {
        const colors = LINE_THEME_COLOR[newLine] ?? {
            primary: '#1976D2',
            secondary: '#424242',
        };

        if (theme.themes.value.light && theme.themes.value.dark) {
            theme.themes.value.light.colors.primary = colors.primary;
            theme.themes.value.light.colors.secondary = colors.secondary;
            theme.themes.value.dark.colors.primary = colors.primary;
            theme.themes.value.dark.colors.secondary = colors.secondary;
        }
    },
    { immediate: true },
);

function toggleTheme() {
    theme.global.current.value.dark
        ? theme.change('light')
        : theme.change('dark');
}

onMounted(() => {
    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
    ).matches;
    theme.change(prefersDark ? 'dark' : 'light');
});
</script>

<style lang="css" scoped>
.main-view {
    width: 90%;
    max-width: 900px;
    margin: auto;
}

.icon-press {
    width: 48px;
    height: 48px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
