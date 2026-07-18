<template>
    <v-app>
        <v-dialog v-model="showFirstNotice" width="auto">
            <v-card title="最初にご確認ください" max-width="650px">
                <v-card-text>
                    このページで表示される公共交通データは、公共交通オープンデータセンターおよび各事業者から提供された情報を元にしています。
                    内容は必ずしも正確・完全ではありませんので、公共交通事業者への直接の問い合わせは行わないでください。
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        text
                        class="close-btn text-subtitle-1"
                        @click="closeNotice"
                    >
                        確認しました
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- AppBar -->
        <v-app-bar
            app
            elevation="0"
            :class="isScrolled ? 'app-bar-scrolled' : 'app-bar-top'"
        >
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
            :width="isExpanded ? 265 : 111"
            @mouseenter="!smAndDown && (isHovering = true)"
            @mouseleave="!smAndDown && (isHovering = false)"
        >
            <v-list>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            :class="
                                isExpanded
                                    ? 'd-flex align-center justify-start text-left'
                                    : 'd-flex align-center justify-center'
                            "
                            elevation="0"
                            size="large"
                            width="100%"
                            to="/"
                        >
                            <v-icon
                                icon="mdi-home-outline"
                                size="large"
                                class="d-flex align-center justify-start"
                            ></v-icon>
                            <span
                                v-if="isExpanded"
                                class="ml-3 text-subtitle-1 drawer-label"
                            >
                                <strong>ホーム</strong>
                            </span>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            :class="
                                isExpanded
                                    ? 'd-flex align-center justify-start text-left'
                                    : 'd-flex align-center justify-center'
                            "
                            elevation="0"
                            size="large"
                            width="100%"
                            to="/information/all"
                        >
                            <v-icon
                                icon="mdi-list-box-outline"
                                size="large"
                            ></v-icon>
                            <span
                                v-if="isExpanded"
                                class="ml-3 text-subtitle-1 drawer-label"
                            >
                                <strong>お知らせ</strong>
                            </span>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            :class="
                                isExpanded
                                    ? 'd-flex align-center justify-start text-left'
                                    : 'd-flex align-center justify-center'
                            "
                            elevation="0"
                            size="large"
                            width="100%"
                            to="/comments"
                        >
                            <v-icon
                                icon="mdi-comment-alert-outline"
                                size="large"
                            ></v-icon>
                            <span
                                v-if="isExpanded"
                                class="ml-3 text-subtitle-1 drawer-label"
                            >
                                <strong>お問い合わせ</strong>
                            </span>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            :class="
                                isExpanded
                                    ? 'd-flex align-center justify-start text-left'
                                    : 'd-flex align-center justify-center'
                            "
                            @click="toggleTheme"
                            elevation="0"
                            size="large"
                            width="100%"
                        >
                            <v-icon size="large">
                                {{
                                    theme.global.current.value.dark
                                        ? 'mdi-white-balance-sunny'
                                        : 'mdi-weather-night'
                                }}
                            </v-icon>
                            <span
                                v-if="isExpanded"
                                class="ml-3 text-subtitle-1 drawer-label"
                            >
                                <strong>表示切り替え</strong>
                            </span>
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
                                    :class="
                                        isExpanded
                                            ? 'd-flex align-center justify-start text-left'
                                            : 'd-flex align-center justify-center'
                                    "
                                    v-bind="activatorProps"
                                    elevation="0"
                                    size="large"
                                    width="100%"
                                    class="info-btn"
                                >
                                    <v-icon
                                        icon="mdi-information-outline"
                                        size="large"
                                    ></v-icon>
                                    <span
                                        v-if="isExpanded"
                                        class="ml-3 text-subtitle-1 drawer-label"
                                    >
                                        <strong>サイトに関して</strong>
                                    </span>
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
                            :class="
                                isExpanded
                                    ? 'd-flex align-center justify-start text-left'
                                    : 'd-flex align-center justify-center'
                            "
                            elevation="0"
                            size="large"
                            width="auto"
                            :to="item.to"
                            :disabled="item.status === 0"
                        >
                            <v-img
                                :src="item.img"
                                max-height="30"
                                max-width="30"
                                contain
                                class="icon-press"
                            />
                            <span
                                v-if="isExpanded"
                                class="ml-3 text-subtitle-1 drawer-label"
                            >
                                <strong>{{ item.label }}</strong>
                            </span>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useTheme, useDisplay } from 'vuetify';
import { useRoute } from 'vue-router';

const drawer = ref(false);
const showFirstNotice = ref(false);
const theme = useTheme();
const route = useRoute();
const isHovering = ref(false);
const isScrolled = ref(false);
const { smAndDown } = useDisplay();

const isExpanded = computed(() => {
    return smAndDown.value ? true : isHovering.value;
});

const handleScroll = () => {
    // isScrolled.value = window.scrollY == 0;
    isScrolled.value = 0 == 0;
};

const lineId = computed<LineKey>(() => {
    const v = route.params.lineId;
    if (Array.isArray(v)) return v[0] as LineKey;
    return (v as LineKey) ?? 'home';
});

type LineItem = {
    to: string;
    img: string;
    label?: string;
    status: number;
};

const lineItems: LineItem[] = [
    {
        to: '/line/asakusa',
        img: '/retration2/symbole/Asakusa-symbole.png',
        label: '浅草線',
        status: 1,
    },
    {
        to: '/line/oedo',
        img: '/retration2/symbole/Oedo-symbole.png',
        label: '大江戸線',
        status: 1,
    },
    {
        to: '/line/shinjuku',
        img: '/retration2/symbole/Shinjuku-symbole.png',
        label: '新宿線',
        status: 1,
    },
    {
        to: '/line/mita',
        img: '/retration2/symbole/Mita-symbole.png',
        label: '三田線',
        status: 1,
    },
    {
        to: '/line/blueline',
        img: '/retration2/symbole/BlueLine-symbole.png',
        label: 'ブルーライン',
        status: 1,
    },
    {
        to: '/line/greenline',
        img: '/retration2/symbole/GreenLine-symbole.png',
        label: 'グリーンライン',
        status: 1,
    },
    {
        to: '/line/timelimited/itsukaichi',
        img: '/retration2/symbole/Itsukaichi-symbole.png',
        label: '五日市線',
        status: 0,
    },
    {
        to: '/line/timelimited/ome',
        img: '/retration2/symbole/Ome-symbole.png',
        label: '青梅線',
        status: 0,
    },
    {
        to: '/line/timelimited/utsunomiya',
        img: '/retration2/symbole/Utsunomiya-symbole.png',
        label: '宇都宮線',
        status: 0,
    },
    {
        to: '/line/timelimited/kawagoe',
        img: '/retration2/symbole/Kawagoe-symbole.png',
        label: '川越線',
        status: 0,
    },
    {
        to: '/line/timelimited/keihintohokunegishi',
        img: '/retration2/symbole/Keihintohokunegishi-symbole.png',
        label: '京浜東北・根岸線',
        status: 0,
    },
    {
        to: '/line/timelimited/keiyo',
        img: '/retration2/symbole/Keiyo-symbole.png',
        label: '京葉線',
        status: 0,
    },
    {
        to: '/line/timelimited/saikyokawagoe',
        img: '/retration2/symbole/Saikyokawagoe-symbole.png',
        label: '埼京・川越線',
        status: 0,
    },
    {
        to: '/line/timelimited/jobanrapid',
        img: '/retration2/symbole/Jobanrapid-symbole.png',
        label: '常磐線快速',
        status: 0,
    },
    {
        to: '/line/timelimited/jobanlocal',
        img: '/retration2/symbole/Jobanlocal-symbole.png',
        label: '常磐線各駅停車',
        status: 0,
    },
    {
        to: '/line/timelimited/sotetsudirect',
        img: '/retration2/symbole/Sotetsudirect-symbole.png',
        label: 'JR・相鉄線直通',
        status: 0,
    },
    {
        to: '/line/timelimited/soburapid',
        img: '/retration2/symbole/Soburapid-symbole.png',
        label: '総武快速線',
        status: 0,
    },
    {
        to: '/line/timelimited/shonanshinjuku',
        img: '/retration2/symbole/Shonanshinjuku-symbole.png',
        label: '湘南新宿ライン',
        status: 0,
    },
    {
        to: '/line/timelimited/takasaki',
        img: '/retration2/symbole/Takasaki-symbole.png',
        label: '高崎線',
        status: 0,
    },
    {
        to: '/line/timelimited/tokaido',
        img: '/retration2/symbole/Tokaido-symbole.png',
        label: '東海道線',
        status: 0,
    },
    {
        to: '/line/timelimited/chuorapid',
        img: '/retration2/symbole/Chuorapid-symbole.png',
        label: '中央線快速',
        status: 0,
    },
    {
        to: '/line/timelimited/chuo',
        img: '/retration2/symbole/Chuo-symbole.png',
        label: '中央本線',
        status: 0,
    },
    {
        to: '/line/timelimited/chuosobulocal',
        img: '/retration2/symbole/Chuosobulocal-symbole.png',
        label: '中央・総武線各停',
        status: 0,
    },
    {
        to: '/line/timelimited/nambu',
        img: '/retration2/symbole/Nambu-symbole.png',
        label: '南武線',
        status: 0,
    },
    {
        to: '/line/timelimited/musashino',
        img: '/retration2/symbole/Musashino-symbole.png',
        label: '武蔵野線',
        status: 0,
    },
    {
        to: '/line/timelimited/yamanote',
        img: '/retration2/symbole/Yamanote-symbole.png',
        label: '山手線',
        status: 0,
    },
    {
        to: '/line/timelimited/yokosuka',
        img: '/retration2/symbole/Yokosuka-symbole.png',
        label: '横須賀線',
        status: 0,
    },
    {
        to: '/line/timelimited/yokohama',
        img: '/retration2/symbole/Yokohama-symbole.png',
        label: '横浜線',
        status: 0,
    },
    {
        to: '/line/timelimited/tobuurbanpark',
        img: '/retration2/symbole/Tobuurbanpark-symbole.png',
        label: 'アーバンパークライン',
        status: 0,
    },
    {
        to: '/line/timelimited/isesaki',
        img: '/retration2/symbole/Isesaki-symbole.png',
        label: '伊勢崎線',
        status: 0,
    },
    {
        to: '/line/timelimited/ogose',
        img: '/retration2/symbole/Ogose-symbole.png',
        label: '越生線',
        status: 0,
    },
    {
        to: '/line/timelimited/kameido',
        img: '/retration2/symbole/Kameido-symbole.png',
        label: '亀戸線',
        status: 0,
    },
    {
        to: '/line/timelimited/tobuskytree',
        img: '/retration2/symbole/Tobuskytree-symbole.png',
        label: 'スカイツリーライン',
        status: 0,
    },
    {
        to: '/line/timelimited/daishi',
        img: '/retration2/symbole/Daishi-symbole.png',
        label: '大師線',
        status: 0,
    },
    {
        to: '/line/timelimited/tojo',
        img: '/retration2/symbole/Tojo-symbole.png',
        label: '東上線',
        status: 0,
    },
    {
        to: '/line/timelimited/nikko',
        img: '/retration2/symbole/Nikko-symbole.png',
        label: '日光線',
        status: 0,
    },
];

const LINE_MAP = {
    home: { name: 'Retration', icon: '/retration2/symbole/retration-icon.png' },
    asakusa: {
        name: '浅草線走行位置',
        icon: '/retration2/symbole/Asakusa-symbole.png',
    },
    mita: {
        name: '三田線走行位置',
        icon: '/retration2/symbole/Mita-symbole.png',
    },
    shinjuku: {
        name: '新宿線走行位置',
        icon: '/retration2/symbole/Shinjuku-symbole.png',
    },
    oedo: {
        name: '大江戸線走行位置',
        icon: '/retration2/symbole/Oedo-symbole.png',
    },
    arakawa: {
        name: '都電荒川線走行位置',
        icon: '/retration2/symbole/Arakawa-symbole.png',
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
        name: '武蔵野線走行位置',
        icon: '/retration2/symbole/Musashino-symbole.png',
    },
    shonanshinjuku: {
        name: '湘南新宿ライン走行位置',
        icon: '/retration2/symbole/Shonanshinjuku-symbole.png',
    },
    keihintohokunegishi: {
        name: '京浜東北・根岸線走行位置',
        icon: '/retration2/symbole/Keihintohokunegishi-symbole.png',
    },
    yokosuka: {
        name: '横須賀線走行位置',
        icon: '/retration2/symbole/Yokosuka-symbole.png',
    },
    soburapid: {
        name: '総武快速線走行位置',
        icon: '/retration2/symbole/Soburapid-symbole.png',
    },
    yokohama: {
        name: '横浜線走行位置',
        icon: '/retration2/symbole/Yokohama-symbole.png',
    },
    utsunomiya: {
        name: '宇都宮線走行位置',
        icon: '/retration2/symbole/Utsunomiya-symbole.png',
    },
    takasaki: {
        name: '高崎線走行位置',
        icon: '/retration2/symbole/Takasaki-symbole.png',
    },
    keiyo: {
        name: '京葉線走行位置',
        icon: '/retration2/symbole/Keiyo-symbole.png',
    },
    saikyokawagoe: {
        name: '埼京・川越線走行位置',
        icon: '/retration2/symbole/Saikyokawagoe-symbole.png',
    },
    sotetsudirect: {
        name: 'JR・相鉄線直通走行位置',
        icon: '/retration2/symbole/Sotetsudirect-symbole.png',
    },
    chuosobulocal: {
        name: '中央総武線各停走行位置',
        icon: '/retration2/symbole/Chuosobulocal-symbole.png',
    },
    chuorapid: {
        name: '中央線快速走行位置',
        icon: '/retration2/symbole/Chuorapid-symbole.png',
    },
    itsukaichi: {
        name: '五日市線走行位置',
        icon: '/retration2/symbole/Itsukaichi-symbole.png',
    },
    tokaido: {
        name: '東海道走行位置',
        icon: '/retration2/symbole/Tokaido-symbole.png',
    },
    nambu: {
        name: '南武線走行位置',
        icon: '/retration2/symbole/Nambu-symbole.png',
    },
    jobanlocal: {
        name: '常磐線各駅停車走行位置',
        icon: '/retration2/symbole/Jobanlocal-symbole.png',
    },
    jobanrapid: {
        name: '常磐線快速走行位置',
        icon: '/retration2/symbole/Jobanrapid-symbole.png',
    },
    joban: {
        name: '常磐線走行位置',
        icon: '/retration2/symbole/Joban-symbole.png',
    },
    kawagoe: {
        name: '川越線走行位置',
        icon: '/retration2/symbole/Kawagoe-symbole.png',
    },
    yamanote: {
        name: '山手線走行位置',
        icon: '/retration2/symbole/Yamanote-symbole.png',
    },
    ome: {
        name: '青梅線走行位置',
        icon: '/retration2/symbole/Ome-symbole.png',
    },
    chuo: {
        name: '中央本線走行位置',
        icon: '/retration2/symbole/Chuo-symbole.png',
    },
    tojo: {
        name: '東上線走行位置',
        icon: '/retration2/symbole/Tojo-symbole.png',
    },
    tobuskytree: {
        name: 'スカイツリーライン位置',
        icon: '/retration2/symbole/Tobuskytree-symbole.png',
    },
    ogose: {
        name: '越生線走行位置',
        icon: '/retration2/symbole/Ogose-symbole.png',
    },
    tobuurbanpark: {
        name: 'アーバンパークライン位置',
        icon: '/retration2/symbole/Tobuurbanpark-symbole.png',
    },
    isesaki: {
        name: '伊勢崎線走行位置',
        icon: '/retration2/symbole/Isesaki-symbole.png',
    },
    nikko: {
        name: '日光線走行位置',
        icon: '/retration2/symbole/Nikko-symbole.png',
    },
    daishi: {
        name: '東武大師線走行位置',
        icon: '/retration2/symbole/Daishi-symbole.png',
    },
    kameido: {
        name: '亀戸線走行位置',
        icon: '/retration2/symbole/Kameido-symbole.png',
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
        arakawa: {
            primary: '#ee86a7',
            secondary: '#f4a09a',
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
        tokaido: {
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
        itsukaichi: {
            primary: '#f15a22',
            secondary: '#ff8a50',
        },
        saikyokawagoe: {
            primary: '#00ac9a',
            secondary: '#66d18e',
        },
        sotetsudirect: {
            primary: '#00ac9a',
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
        jobanlocal: {
            primary: '#808080',
            secondary: '#b3b3b3',
        },
        jobanrapid: {
            primary: '#00b261',
            secondary: '#66d18e',
        },
        joban: {
            primary: '#3355ff',
            secondary: '#8888ff',
        },
        kawagoe: {
            primary: '#a8a39d',
            secondary: '#d7d2c8',
        },
        yamanote: {
            primary: '#9acd32',
            secondary: '#d7e36a',
        },
        ome: {
            primary: '#f15a22',
            secondary: '#ff8a50',
        },
        chuo: {
            primary: '#0074be',
            secondary: '#66b0e8',
        },
        tojo: {
            primary: '#0050a8',
            secondary: '#66b0e8',
        },
        ogose: {
            primary: '#0050a8',
            secondary: '#66b0e8',
        },
        tobuskytree: {
            primary: '#1a7fd0',
            secondary: '#66b0e8',
        },
        tobuurbanpark: {
            primary: '#00bfff',
            secondary: '#66d1f0',
        },
        daishi: {
            primary: '#1a7fd0',
            secondary: '#66b0e8',
        },
        kameido: {
            primary: '#1a7fd0',
            secondary: '#66b0e8',
        },
        isesaki: {
            primary: '#ed1a3e',
            secondary: '#fd2a5a',
        },
        nikko: {
            primary: '#ffa500',
            secondary: '#ffb511',
        },
    };

const currentLine = computed<LineInfo>(() => {
    return LINE_MAP[lineId.value] ?? LINE_MAP.home;
});

watch(
    () => lineId.value,
    (newLine) => {
        const colors = LINE_THEME_COLOR[newLine] ?? {
            primary: '#00fa9a',
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

const closeNotice = () => {
    showFirstNotice.value = false;
    localStorage.setItem('retration_first_notice', '0');
};

onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    theme.change(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', (e) => {
        theme.change(e.matches ? 'dark' : 'light');
    });
    const seen = localStorage.getItem('retration_first_notice');
    if (!seen) {
        showFirstNotice.value = true;
    }
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="css" scoped>
.main-view {
    width: 90%;
    max-width: 900px;
    margin: auto;
}

.app-bar-top {
    background-color: transparent !important;
    transition: background-color 0.3s ease;
}

.app-bar-scrolled {
    backdrop-filter: blur(8px);
    transition: background-color 0.3s ease;
}

.icon-press {
    width: 48px;
    height: 48px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
