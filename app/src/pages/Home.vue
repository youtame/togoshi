<template>
    <v-container>
        <div class="hero">
            <v-img
                src="/retration2/symbole/retration-icon.png"
                alt="Main Visual"
                class="hero-image"
            />
            <div class="main-title">
                <h1>Retration</h1>
                <h2>Find train<br />locations fast</h2>
                <h3>今、大体列車がどこにいるのかがわかります</h3>
            </div>
        </div>

        <div class="main-visual">
            <div class="visual-wrapper">
                <Transition name="slide" mode="out-in">
                    <v-img
                        :key="currentImage"
                        :src="currentImage"
                        class="main-photo"
                        alt="Main Photo"
                        eager
                    />
                </Transition>
            </div>
        </div>

        <div class="warning-section">
            <v-alert
                type="warning"
                variant="tonal"
                class="warning-card mt-12 mb-3 rounded-lg"
            >
                データ引用元での公開が終了したため、JR線と東武線の列車走行位置は2026年3月13日をもって、いったん公開を終了しました<br /><br />このお知らせの詳細はこのページ一番下の「サイトからのお知らせ」をご覧ください
            </v-alert>
        </div>

        <div class="line-section">
            <h2 class="mb-3">路線一覧</h2>

            <div v-for="operator in operators" :key="operator.id" class="mb-4">
                <h3 class="mb-2 mt-12">{{ operator.name }}</h3>

                <div class="line-container d-flex">
                    <v-btn
                        v-for="line in operator.lines"
                        :key="line.id"
                        variant="flat"
                        rounded="lg"
                        class="line-button d-flex align-center font-weight-bold border-md"
                        color="surface"
                        elevation="0"
                        :to="operator.status === 1 ? line.to : undefined"
                        :disabled="operator.status === 0"
                    >
                        <v-img
                            :src="line.icon"
                            width="50"
                            height="50"
                            class="line-icon"
                            alt="Line icon"
                        />
                        <div class="d-block">
                            <div class="d-flex flex-column align-start">
                                <span class="line-text">{{ line.name }}</span>
                                <span class="line-tip">{{ line.tip }}</span>
                            </div>
                        </div>
                    </v-btn>
                </div>
            </div>
        </div>
        <div class="notice-section">
            <h2 class="mb-3">サイトからお知らせ</h2>

            <v-alert v-if="loading" type="info" variant="tonal">
                読み込み中…
            </v-alert>

            <v-alert v-else-if="error" type="error" variant="tonal">
                お知らせの取得に失敗しました
            </v-alert>

            <v-list class="rounded-lg pa-3 mb-2 border-md" v-else>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel
                        v-for="(item, index) in notices"
                        :key="index"
                        elevation="0"
                    >
                        <v-expansion-panel-title>
                            <div class="notice-header">
                                <span class="notice-date font-weight-semibold">
                                    {{ formatDate(item.info_date) }}
                                </span>
                                <span class="notice-title">
                                    {{ item.title || item.information }}
                                </span>
                            </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            {{ item.information }}

                            <div v-if="item.links?.length">
                                <template v-for="(link, i) in item.links">
                                    <v-btn
                                        v-if="link.external"
                                        :key="'external-' + i"
                                        :href="link.url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="text"
                                        class="notice-link font-weight-semibold"
                                    >
                                        {{ link.text }}
                                    </v-btn>

                                    <v-btn
                                        v-else
                                        :key="'internal-' + i"
                                        :to="link.url"
                                        variant="text"
                                        class="notice-link font-weight-semibold border-md"
                                    >
                                        {{ link.text }}
                                    </v-btn>
                                </template>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-list>
        </div>

        <v-row
            class="gap-4"
            justify="start"
            direction="column"
            :md-direction="'row'"
        >
            <v-col>
                <v-btn
                    variant="flat"
                    rounded="lg"
                    class="main-button d-flex align-center font-weight-bold border-md"
                    color="surface"
                    elevation="0"
                    rel="noopener"
                    to="/information/all"
                >
                    <v-icon
                        icon="mdi-list-box-outline"
                        class="mr-2"
                        size="large"
                        target="_blank"
                    ></v-icon>
                    全てのお知らせを表示
                </v-btn></v-col
            >
            <v-col>
                <v-btn
                    variant="flat"
                    rounded="lg"
                    class="main-button d-flex align-center font-weight-bold border-md"
                    color="surface"
                    elevation="0"
                    rel="noopener"
                    to="/comments"
                >
                    <v-icon
                        icon="mdi-comment-alert-outline"
                        class="mr-2"
                        size="large"
                    ></v-icon>
                    お問い合わせ
                </v-btn></v-col
            >
        </v-row>

        <v-row
            class="gap-4 mb-12"
            justify="start"
            direction="column"
            :md-direction="'row'"
        >
            <v-col>
                <v-btn
                    variant="flat"
                    rounded="lg"
                    class="main-button d-flex align-center font-weight-bold border-md"
                    color="surface"
                    elevation="0"
                    rel="noopener"
                    to="/manager"
                >
                    <v-icon
                        icon="mdi-account-outline"
                        class="mr-2"
                        size="large"
                    ></v-icon>
                    サイト運営者
                </v-btn>
            </v-col>
            <v-col>
                <v-btn
                    variant="flat"
                    rounded="lg"
                    class="main-button d-flex align-center font-weight-bold border-md"
                    color="surface"
                    elevation="0"
                    rel="noopener"
                    to="/aboutsite"
                >
                    <v-icon
                        icon="mdi-alert-outline"
                        class="mr-2"
                        size="large"
                    ></v-icon>
                    サイト注意事項
                </v-btn></v-col
            >
        </v-row>

        <div class="warning-section">
            <v-alert
                type="warning"
                variant="tonal"
                class="warning-card mt-12 rounded-lg"
            >
                ※このページの表示内容について、公共交通事業者への直接の問合せは行わないでください。<br />
                ※このサイトは掲載されている交通機関の公式サイトではありません。表示されるデータは間違っている可能性があります。
            </v-alert>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

export interface NoticeLink {
    text: string;
    url: string;
    external?: boolean;
}

type Notice = {
    title: string;
    information: string;
    info_date: string;
    links?: NoticeLink[];
};

const notices = ref<Notice[]>([]);
const loading = ref(true);
const error = ref(false);

const operators = [
    {
        id: 'toei',
        name: '東京都交通局',
        status: 1,
        lines: [
            {
                id: 'asakusa',
                name: '浅草線',
                icon: '/retration2/symbole/Asakusa-symbole.png',
                to: '/line/asakusa',
            },
            {
                id: 'oedo',
                name: '大江戸線',
                icon: '/retration2/symbole/Oedo-symbole.png',
                to: '/line/oedo',
            },
            {
                id: 'shinjuku',
                name: '新宿線',
                icon: '/retration2/symbole/Shinjuku-symbole.png',
                to: '/line/shinjuku',
            },
            {
                id: 'mita',
                name: '三田線',
                icon: '/retration2/symbole/Mita-symbole.png',
                to: '/line/mita',
            },
        ],
    },
    {
        id: 'yokohama',
        name: '横浜市交通局',
        status: 1,
        lines: [
            {
                id: 'blueline',
                name: 'ブルーライン',
                icon: '/retration2/symbole/BlueLine-symbole.png',
                to: '/line/blueline',
            },
            {
                id: 'greenline',
                name: 'グリーンライン',
                icon: '/retration2/symbole/GreenLine-symbole.png',
                to: '/line/greenline',
            },
        ],
    },
    {
        id: 'JR-East',
        name: 'JR東日本(公開期間終了)',
        status: 0,
        lines: [
            {
                id: 'itsukaichi',
                name: '五日市線',
                tip: '拝島 ~ 武蔵五日市',
                icon: '/retration2/symbole/Itsukaichi-symbole.png',
                to: '/line/timelimited/itsukaichi',
            },
            {
                id: 'ome',
                name: '青梅線',
                tip: '立川 ~ 青梅',
                icon: '/retration2/symbole/Ome-symbole.png',
                to: '/line/timelimited/ome',
            },
            {
                id: 'utsunomiya',
                name: '宇都宮線',
                tip: '東京 ~ 黒磯',
                icon: '/retration2/symbole/Utsunomiya-symbole.png',
                to: '/line/timelimited/utsunomiya',
            },
            {
                id: 'kawagoe',
                name: '川越線',
                tip: '川越 ~ 高麗川',
                icon: '/retration2/symbole/Kawagoe-symbole.png',
                to: '/line/timelimited/kawagoe',
            },
            {
                id: 'keihintohokunegishi',
                name: '京浜東北・根岸線',
                icon: '/retration2/symbole/Keihintohokunegishi-symbole.png',
                to: '/line/timelimited/keihintohokunegishi',
            },
            {
                id: 'keiyo',
                name: '京葉線',
                icon: '/retration2/symbole/Keiyo-symbole.png',
                to: '/line/timelimited/keiyo',
            },
            {
                id: 'saikyokawagoe',
                name: '埼京・川越線',
                tip: '大崎 ~ 川越',
                icon: '/retration2/symbole/Saikyokawagoe-symbole.png',
                to: '/line/timelimited/saikyokawagoe',
            },
            {
                id: 'jobanrapid',
                name: '常磐線快速',
                tip: '品川 ~ 取手',
                icon: '/retration2/symbole/Jobanrapid-symbole.png',
                to: '/line/timelimited/jobanrapid',
            },
            {
                id: 'jobanlocal',
                name: '常磐線各駅停車',
                tip: '綾瀬 ~ 取手',
                icon: '/retration2/symbole/Jobanlocal-symbole.png',
                to: '/line/timelimited/jobanlocal',
            },
            {
                id: 'sotetsudirect',
                name: '相鉄線直通列車',
                tip: '大崎 ~ 羽沢横浜国大',
                icon: '/retration2/symbole/Sotetsudirect-symbole.png',
                to: '/line/timelimited/sotetsudirect',
            },
            {
                id: 'soburapid',
                name: '総武快速線',
                tip: '東京 ~ 千葉',
                icon: '/retration2/symbole/Soburapid-symbole.png',
                to: '/line/timelimited/soburapid',
            },
            {
                id: 'shonanshinjuku',
                name: '湘南新宿ライン',
                icon: '/retration2/symbole/Shonanshinjuku-symbole.png',
                to: '/line/timelimited/shonanshinjuku',
            },
            {
                id: 'takasaki',
                name: '高崎線',
                tip: '東京 ~ 高崎',
                icon: '/retration2/symbole/Takasaki-symbole.png',
                to: '/line/timelimited/takasaki',
            },
            {
                id: 'tokaido',
                name: '東海道線',
                tip: '東京 ~ 熱海',
                icon: '/retration2/symbole/Tokaido-symbole.png',
                to: '/line/timelimited/tokaido',
            },
            {
                id: 'chuorapid',
                name: '中央線快速',
                tip: '東京 ~ 高尾',
                icon: '/retration2/symbole/Chuorapid-symbole.png',
                to: '/line/timelimited/chuorapid',
            },
            {
                id: 'chuo',
                name: '中央本線',
                tip: '高尾 ~ 甲府',
                icon: '/retration2/symbole/Chuo-symbole.png',
                to: '/line/timelimited/chuo',
            },
            {
                id: 'chuosobulocal',
                name: '中央・総武線各停',
                tip: '千葉 ~ 三鷹',
                icon: '/retration2/symbole/Chuosobulocal-symbole.png',
                to: '/line/timelimited/chuosobulocal',
            },
            {
                id: 'nambu',
                name: '南武線',
                icon: '/retration2/symbole/Nambu-symbole.png',
                to: '/line/timelimited/nambu',
            },
            {
                id: 'musashino',
                name: '武蔵野線',
                icon: '/retration2/symbole/Musashino-symbole.png',
                to: '/line/timelimited/musashino',
            },
            {
                id: 'yamanote',
                name: '山手線',
                icon: '/retration2/symbole/Yamanote-symbole.png',
                to: '/line/timelimited/yamanote',
            },
            {
                id: 'yokosuka',
                name: '横須賀線',
                tip: '東京 ~ 久里浜',
                icon: '/retration2/symbole/Yokosuka-symbole.png',
                to: '/line/timelimited/yokosuka',
            },
            {
                id: 'yokohama',
                name: '横浜線',
                icon: '/retration2/symbole/Yokohama-symbole.png',
                to: '/line/timelimited/yokohama',
            },
        ],
    },
    {
        id: 'tobu',
        name: '東武鉄道(公開期間終了)',
        status: 0,
        lines: [
            {
                id: 'tobuurbanpark',
                name: 'アーバンパークライン',
                icon: '/retration2/symbole/Tobuurbanpark-symbole.png',
                to: '/line/timelimited/tobuurbanpark',
            },
            {
                id: 'isesaki',
                name: '伊勢崎線',
                icon: '/retration2/symbole/Isesaki-symbole.png',
                to: '/line/timelimited/isesaki',
            },
            {
                id: 'ogose',
                name: '越生線',
                icon: '/retration2/symbole/Ogose-symbole.png',
                to: '/line/timelimited/ogose',
            },
            {
                id: 'kameido',
                name: '亀戸線',
                icon: '/retration2/symbole/Kameido-symbole.png',
                to: '/line/timelimited/kameido',
            },
            {
                id: 'tobuskytree',
                name: 'スカイツリーライン',
                icon: '/retration2/symbole/Tobuskytree-symbole.png',
                to: '/line/timelimited/tobuskytree',
            },
            {
                id: 'daishi',
                name: '大師線',
                icon: '/retration2/symbole/Daishi-symbole.png',
                to: '/line/timelimited/daishi',
            },
            {
                id: 'tojo',
                name: '東上線',
                icon: '/retration2/symbole/Tojo-symbole.png',
                to: '/line/timelimited/tojo',
            },
            {
                id: 'nikko',
                name: '日光線',
                icon: '/retration2/symbole/Nikko-symbole.png',
                to: '/line/timelimited/nikko',
            },
        ],
    },
];

const images = ['/retration2/main-photo.png', '/retration2/main-photo2.png'];
const currentIndex = ref(0);
const currentImage = ref(images[0]);

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
    timer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % images.length;
        currentImage.value = images[currentIndex.value];
    }, 5000);
    try {
        const res = await fetch('/retration2/information/retration-info.json');
        if (!res.ok) throw new Error('fetch failed');
        notices.value = await res.json();
    } catch (e) {
        error.value = true;
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    if (timer !== null) {
        clearInterval(timer);
    }
});

const formatDate = (dateStr: string) => {
    // "2025-03-12-10:35" to "2025/03/12 10:35"
    const [y, m, d, hm] = dateStr.split('-');
    return `${y}/${m}/${d} ${hm}`;
};
</script>

<style lang="scss" scoped>
.v-container {
    padding: 16px 0px 16px 0px !important;
}

.hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    max-width: 1100px;
    margin: 60px auto 0;
    animation: fadeUp 0.6s ease-out;
}

.hero-image {
    flex: 1;
    order: 2;
    width: 250px;
    height: 250px;
}

.yoko {
    display: block;
}

.main-visual {
    max-width: 1000px;
    margin: 80px auto 0;
}

.main-photo {
    border-radius: 12px;
    filter: grayscale(75%) brightness(0.9) contrast(0.95);
}

.visual-wrapper {
    width: 100%;
    aspect-ratio: 16 / 9;
}

.main-title {
    flex: 2;
    order: 1;
    font-size: 25px;
}

.main-title h1 {
    font-family: 'Inter';
    letter-spacing: 1px;
    font-size: 60px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 12px;
    color: #00fa9a;
}

.main-title h2 {
    font-family: 'Inter', 'Zen Kaku Gothic New', sans-serif;
    font-size: 55px;
    font-weight: bold;
    line-height: 1.3;
    margin-bottom: 12px;
}

.main-title h3 {
    font-weight: bold;
    font-size: 24px;
    color: #999999;
}

.hero-image {
    flex-shrink: 0;
}

.line-section {
    max-width: 1000px;
    margin: 45px auto 60px;
}

.line-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    max-width: 1000px;
    margin: 10px auto 0;
}

.line-button {
    flex: 1 1 45%;
    max-width: 480px;
    min-width: 220px;
    height: 90px;
    gap: 12px;
    padding: 0 25px;

    justify-content: flex-start;
    align-items: center;
    text-transform: none;
    font-weight: 600;
    transition:
        background-color 0.15s ease,
        box-shadow 0.15s ease;
}

.line-button:hover {
    background-color: #f5f5f5;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.line-icon {
    margin-right: 16px;
    flex-shrink: 0;
}

.line-text {
    font-size: 20px;
    white-space: normal;
}

.line-tip {
    font-size: 15px;
    color: #a0a0a0;
}

.notice-section {
    max-width: 1000px;
    margin: 60px auto 30px;
}

.notice-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 18px 0;
}

.notice-link {
    margin: 10px 0px 10px 0px;
}

.notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;

    .notice-title {
        font-weight: 600;
        font-size: 18px;
        line-height: 1.5;
        flex: 1 1 auto;
        min-width: 0;
        word-break: break-word;
    }

    .notice-date {
        padding: 4px 18px;
        border-radius: 5px;
        font-size: 16px;
        color: #fff;
        background-color: #16c683;
        flex-shrink: 0;
    }
}

.main-button {
    display: block;
    width: 100%;
    max-width: 1000px;
    min-width: 220px;
    height: 50px;
    gap: 12px;
    padding: 0 16px;

    font-size: 17px;
    font-weight: 600;
    text-align: center;
}

.warning-card {
    max-width: 1000px;
    margin: 10px auto 45px;
    font-size: 16px;
}

.warning-section {
    max-width: 1000px;
}

.slide-enter-active,
.slide-leave-active {
    transition:
        transform 1s ease,
        opacity 1s ease;
}

.slide-enter-from {
    transform: translateX(20px);
    opacity: 0;
}

.slide-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

@media (max-width: 960px) {
    .hero {
        margin: 40px auto 0;
        flex-direction: column;
        text-align: center;
    }

    .hero-image {
        order: 1;
    }

    .main-title {
        order: 2;
    }

    .main-title h1 {
        text-align: center;
        font-size: 45px;
    }
    .main-title h2 {
        text-align: center;
        font-size: 40px;
    }
    .main-title h3 {
        text-align: center;
    }

    .main-title h3 {
        font-size: 20px;
    }
}

@media (max-width: 600px) {
    .hero-image {
        width: 160px;
        height: 160px;
    }

    .line-button {
        flex: 1 1 95%;
        max-width: none;
    }
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 480px) {
    .notice-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;

        .notice-date {
            margin-top: 4px;
        }
    }
}
</style>
