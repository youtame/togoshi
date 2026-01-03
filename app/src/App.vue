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
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            elevation="0"
                            size="large"
                            width="auto"
                            to="/line/asakusa"
                        >
                            <v-img
                                src="/retration2/Asakusa-symbole.png"
                                max-height="30"
                                max-width="30"
                                contain
                                class="icon-press"
                            />
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            elevation="0"
                            size="large"
                            width="auto"
                            to="/line/oedo"
                        >
                            <v-img
                                src="/retration2/Oedo-symbole.png"
                                max-height="30"
                                max-width="30"
                                contain
                                class="icon-press"
                            />
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            elevation="0"
                            size="large"
                            width="auto"
                            to="/line/shinjuku"
                        >
                            <v-img
                                src="/retration2/Shinjuku-symbole.png"
                                max-height="30"
                                max-width="30"
                                contain
                                class="icon-press"
                            />
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            elevation="0"
                            size="large"
                            width="auto"
                            to="/line/mita"
                        >
                            <v-img
                                src="/retration2/Mita-symbole.png"
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

const LINE_MAP = {
    home: { name: 'Retration', icon: '/retration2/retration-icon.png' },
    asakusa: {
        name: '浅草線列車走行位置',
        icon: '/retration2/Asakusa-symbole.png',
    },
    mita: { name: '三田線列車走行位置', icon: '/retration2/Mita-symbole.png' },
    shinjuku: {
        name: '新宿線列車走行位置',
        icon: '/retration2/Shinjuku-symbole.png',
    },
    oedo: {
        name: '大江戸線列車走行位置',
        icon: '/retration2/Oedo-symbole.png',
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
    { immediate: true }
);

function toggleTheme() {
    theme.global.current.value.dark
        ? theme.change('light')
        : theme.change('dark');
}

onMounted(() => {
    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
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
