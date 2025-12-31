<template>
    <v-card class="traininfo-main-view rounded-lg">
        <v-card-title class="ma-1 text-h6 font-weight-semibold">
            <v-icon
                icon="mdi-information-box"
                size="small"
                class="pb-1"
            ></v-icon>
            <span class="pl-3">運行情報</span>
        </v-card-title>
        <v-card-subtitle class="ma-1 text-subtitle-2">
            データ最終更新: {{ fetchTime }}
        </v-card-subtitle>
        <v-card-text
            class="ma-1 text-body-2 font-weight-semibold"
            :class="textClass"
        >
            {{ AsakusaInfo }}
        </v-card-text>
    </v-card>
</template>

<style lang="css" scoped>
.traininfo-main-view {
    margin-top: 30px;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const jsonData = ref<any[]>([]);
const AsakusaInfo = ref('Loading...');
const fetchTime = ref('');

const normalMessage = '現在、１５分以上の遅延はありません。';

const textClass = computed(() => {
    return AsakusaInfo.value === normalMessage ? '' : 'text-error';
});

async function fetchTrainInfo() {
    try {
        const response = await fetch(
            'https://api.odpt.org/api/v4/odpt:TrainInformation?odpt:operator=odpt.Operator:Toei&acl:consumerKey=b70f7d9c215874f66461094458ea3f080fec87af36b3c31981aa35d3cb59afa4'
        );
        if (!response.ok) throw new Error('Network Error');
        jsonData.value = await response.json();

        const asakusa = jsonData.value.find(
            (item) =>
                item['owl:sameAs'] === 'odpt.TrainInformation:Toei.Asakusa'
        );
        AsakusaInfo.value =
            asakusa?.['odpt:trainInformationText']?.ja || 'No information';

        const now = new Date();
        fetchTime.value = formatTime(now);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        AsakusaInfo.value = 'データの取得に失敗しました / Failed to fetch data';
        fetchTime.value = '取得できませんでした';
    }
}

function formatTime(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
}

let intervalId: number | undefined;

onMounted(() => {
    fetchTrainInfo();
    intervalId = window.setInterval(fetchTrainInfo, 5 * 60 * 1000); // Fetch data minutes each
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.traininfo-main-view {
    margin-top: 30px;
}
</style>
