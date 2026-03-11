<template>
    <v-container>
        <div class="comments-section">
            <div v-if="isAllMode">
                <div v-for="notice in allNotices" :key="notice.id" class="mb-6">
                    <div class="notice-header mb-3">
                        <h2 class="notice-title">
                            {{ notice.title }}
                        </h2>

                        <span class="notice-date font-weight-semibold">
                            {{ formatDate(notice.info_date) }}
                        </span>
                    </div>
                    <div class="site-container d-flex"></div>

                    <v-list class="rounded-lg pa-3 mb-2 border-md">
                        <v-list-item>
                            <v-list-item-content style="white-space: pre-line">
                                {{
                                    notice.information_detail ??
                                    notice.information
                                }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </div>
            </div>
            <div v-else-if="currentNotice">
                <div class="notice-header mb-3" v-if="currentNotice">
                    <h2 class="notice-title">
                        {{ currentNotice.title }}
                    </h2>

                    <span class="notice-date font-weight-semibold">
                        {{ formatDate(currentNotice.info_date) }}
                    </span>
                </div>
                <div class="site-container d-flex"></div>

                <v-list class="rounded-lg pa-3 mb-2 border-md">
                    <v-list-item>
                        <v-list-item-content style="white-space: pre-line">
                            {{ displayInformation }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
        </div>
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
                    to="/"
                >
                    <v-icon
                        icon="mdi-home-outline"
                        class="mr-2"
                        size="large"
                    ></v-icon>
                    ホームに戻る
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
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const informationParam = computed(() => route.params.informationId as string);
const isLoaded = ref(false);

export interface NoticeLink {
    text: string;
    url: string;
    external?: boolean;
}

type Notice = {
    id: number;
    title: string;
    information?: string;
    information_detail?: string;
    info_date: string;
    links?: NoticeLink[];
};

const notices = ref<Notice[]>([]);

const isAllMode = computed(() => informationParam.value === 'all');

const currentNotice = computed(() => {
    if (isAllMode.value) return null;

    const id = Number(informationParam.value);
    if (isNaN(id)) return undefined;

    return notices.value.find((notice) => notice.id === id);
});

const allNotices = computed(() => {
    return notices.value;
});

const displayInformation = computed(() => {
    if (!currentNotice.value) return '';

    return (
        currentNotice.value.information_detail ??
        currentNotice.value.information ??
        ''
    );
});

onMounted(async () => {
    try {
        const res = await fetch('/retration2/information/retration-info.json');
        if (!res.ok) throw new Error('fetch failed');

        const data: Notice[] = await res.json();
        notices.value = data;
    } catch (e) {
        console.error('Fetch Error');
    } finally {
        isLoaded.value = true;
    }
});

watch([currentNotice, isLoaded, isAllMode], ([notice, loaded, all]) => {
    if (loaded && !notice && !all) {
        router.replace({ name: 'NotFound' });
    }
});

const formatDate = (dateStr: string) => {
    // "2025-03-12-10:35" to "2025/03/12 10:35"
    const [y, m, d, hm] = dateStr.split('-');
    return `${y}/${m}/${d} ${hm}`;
};
</script>
<style scoped>
.v-container {
    padding: 0px 0px 0px 0px !important;
}
.comments-section {
    max-width: 1000px;
    margin: 45px auto;
    margin-bottom: 30px;
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

.notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
}

.notice-title {
    font-weight: 600;
    font-size: 24px;
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
</style>
