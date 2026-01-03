<template>
    <v-container>
        <div class="hero">
            <v-img
                src="/retration2/retration-icon.png"
                width="180"
                height="180"
                alt="Main Visual"
                class="hero-image"
            />
            <div class="main-title">
                <h1>Retration</h1>
                <h2>Find train<br />locations fast</h2>
                <h3>今、大体列車がどこにいるのかがわかります</h3>
            </div>
        </div>
        <div class="line-section">
            <h2 class="mb-3">対応中の路線</h2>

            <div class="line-container d-flex">
                <v-btn
                    v-for="line in lines"
                    :key="line.id"
                    variant="flat"
                    rounded="lg"
                    class="line-button d-flex align-center font-weight-bold border-md"
                    color="surface"
                    elevation="0"
                    :to="line.to"
                >
                    <v-img
                        :src="line.icon"
                        width="50"
                        height="50"
                        class="line-icon"
                        alt="Line icon"
                    />

                    <span class="line-text">{{ line.name }}</span>
                </v-btn>
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
                                <span class="notice-title">
                                    {{ item.title || item.information }}
                                </span>
                                <span class="notice-date">
                                    {{ formatDate(item.info_date) }}
                                </span>
                            </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            {{ item.information }}
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-list>
        </div>

        <div class="about-section">
            <h2 class="mb-3">サイトに関して</h2>

            <div class="site-container d-flex"></div>

            <v-list class="rounded-lg pa-3 mb-2 border-md">
                <v-list-item>
                    <v-list-item-content>
                        1.
                        取得しているAPIの都合上正確でないデータがある可能性があります
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        2.
                        このページが利用する公共交通データは、公共交通オープンデータセンターにおいて提供されるものです
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        3.
                        このページの表示内容について、公共交通事業者への直接の問合せは行わないでください。
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        4.
                        サイトに関するお問い合わせは右側のメニューバーのリンクからお願いいたします。
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>

        <div class="lozdo-section">
            <h2 class="mb-3">運営者について</h2>

            <div class="site-container d-flex"></div>

            <v-list class="rounded-lg pa-3 mb-2 border-md">
                <v-list-item>
                    <v-list-item-content>
                        このサイトをご利用いただきありがとうございます。このサイトは102℃が運営しています。　読み方は、10-2-doでten-two-doで鉄道の語呂合わせになっています。RetrationはReal-time
                        Train-Informationの略です。102℃の他のサービスについては<a
                            href="https://lozdo.com"
                            >こちら</a
                        >から。このサイトに関するお問い合わせは<a
                            class="normal-btn"
                            href="/retration2/comments"
                            >こちら</a
                        >からお願いいたします。
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

type Notice = {
    title: string;
    information: string;
    info_date: string;
};

const notices = ref<Notice[]>([]);
const loading = ref(true);
const error = ref(false);

const lines = [
    {
        id: 'asakusa',
        name: '都営浅草線',
        icon: '/retration2/Asakusa-symbole.png',
        to: '/line/asakusa',
    },
    {
        id: 'oedo',
        name: '都営大江戸線',
        icon: '/retration2/Oedo-symbole.png',
        to: '/line/oedo',
    },
    {
        id: 'shinjuku',
        name: '都営新宿線',
        icon: '/retration2/Shinjuku-symbole.png',
        to: '/line/shinjuku',
    },
    {
        id: 'mita',
        name: '都営三田線',
        icon: '/retration2/Mita-symbole.png',
        to: '/line/mita',
    },
];

onMounted(async () => {
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
    padding: 0 16px;
    animation: fadeUp 0.6s ease-out;
}

.hero-image {
    flex: 1;
    order: 2;
    width: 200px;
    height: 200px;
}

.main-title {
    flex: 2;
    order: 1;
    font-size: 25px;
}

.main-title h1 {
    font-weight: bold;
    line-height: 1;
    margin-bottom: 12px;
    color: #00fa9a;
}

.main-title h2 {
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
    margin: 60px auto 0;
    padding: 0 16px;
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
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
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
}

.notice-section {
    max-width: 1000px;
    margin: 60px auto 0;
    padding: 0 16px;
}

.notice-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 18px 0;
}

.notice-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 1.5;
}

.notice-date {
    padding: 5px 2px 5px 2px;
    margin-left: 12px 0px 0px 12px;
    border-radius: 10px;
    font-size: 15px;
    color: #777;
}

.about-section {
    max-width: 1000px;
    margin: 60px auto;
    padding: 0 16px;
}

.lozdo-section {
    max-width: 1000px;
    margin: 45px auto;
    padding: 0 16px;
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

    .main-title h1,
    .main-title h2,
    .main-title h3 {
        text-align: center;
    }

    .main-title h3 {
        font-size: 20px;
    }
}

@media (max-width: 600px) {
    .hero-image {
        width: 140px;
        height: 140px;
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
</style>
