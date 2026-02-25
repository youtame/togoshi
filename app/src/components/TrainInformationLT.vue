<template>
    <v-card class="traininfo-main-view rounded-lg border-md" elevation="0">
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
            {{ trainInfo }}
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { it } from 'vuetify/locale';

const jsonData = ref<any[]>([]);
const trainInfo = ref('読み込み中...');
const fetchTime = ref('');

const normalMessages = ['平常運転', '平常どおり運転しています。'];

const textClass = computed(() => {
    return normalMessages.includes(trainInfo.value) ? '' : 'text-error';
});

const props = defineProps<{
    lineId: string;
}>();

const LINE_MAP: Record<string, string> = {
    musashino: 'odpt.TrainInformation:JR-East.Musashino',
    shonanshinjuku: 'odpt.TrainInformation:JR-East.ShonanShinjuku',
    yokosuka: 'odpt.TrainInformation:JR-East.Yokosuka',
    keihintohokunegishi: 'odpt.TrainInformation:JR-East.KeihinTohokuNegishi',
    soburapid: 'odpt.TrainInformation:JR-East.SobuRapid',
    yokohama: 'odpt.TrainInformation:JR-East.Yokohama',
    utsunomiya: 'odpt.TrainInformation:JR-East.Utsunomiya',
    takasaki: 'odpt.TrainInformation:JR-East.Takasaki',
    jobanrapid: 'odpt.TrainInformation:JR-East.JobanRapid',
    jobanlocal: 'odpt.TrainInformation:JR-East.JobanLocal',
    keiyo: 'odpt.TrainInformation:JR-East.Keiyo',
    chuorapid: 'odpt.TrainInformation:JR-East.ChuoRapid',
    saikyokawagoe: 'odpt.TrainInformation:JR-East.SaikyoKawagoe',
    chuosobulocal: 'odpt.TrainInformation:JR-East.ChuoSobuLocal',
    tokaido: 'odpt.TrainInformation:JR-East.Tokaido',
    sotetsudirect: 'odpt.TrainInformation:JR-East.SotetsuDirect',
    itsukaichi: 'odpt.TrainInformation:JR-East.Itsukaichi',
    nambu: 'odpt.TrainInformation:JR-East.Nambu',
    kawagoe: 'odpt.TrainInformation:JR-East.Kawagoe',
    yamanote: 'odpt.TrainInformation:JR-East.Yamanote',
    ome: 'odpt.TrainInformation:JR-East.Ome',
    chuo: 'odpt.TrainInformation:JR-East.Chuo',
    tojo: 'odpt.TrainInformation:Tobu.Tojo',
    tobuskytree: 'odpt.TrainInformation:Tobu.TobuSkytree',
    tobuurbanpark: 'odpt.TrainInformation:Tobu.TobuUrbanPark',
    ogose: 'odpt.TrainInformation:Tobu.Ogose',
    daishi: 'odpt.TrainInformation:Tobu.Daishi',
    kameido: 'odpt.TrainInformation:Tobu.Kameido',
    isesaki: 'odpt.TrainInformation:Tobu.Isesaki',
    nikko: 'odpt.TrainInformation:Tobu.Nikko',
};

async function fetchTrainInfo() {
    try {
        const response = await fetch(
            'https://api-challenge.odpt.org/api/v4/odpt:TrainInformation?odpt:operator=odpt.Operator:jre-is,odpt.Operator:Tobu&acl:consumerKey=5cnfrm3vdwsfg163rrfrar0jqdlo3910alzus7xiwunv9jkd3x0b17e0vy9d50t0',
        );
        if (!response.ok) throw new Error('Network Error');
        jsonData.value = await response.json();

        const lineKey = LINE_MAP[props.lineId];

        if (!lineKey) {
            trainInfo.value = '対応していない路線です';
            fetchTime.value = formatTime(new Date());
            return;
        }

        const info = jsonData.value.find(
            (item) => item['owl:sameAs'] === lineKey,
        );

        trainInfo.value =
            info?.['odpt:trainInformationText']?.ja || 'No information';

        const now = new Date();
        fetchTime.value = formatTime(now);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        trainInfo.value = 'データの取得に失敗しました / Failed to fetch data';
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

watch(
    () => props.lineId,
    () => {
        fetchTrainInfo();
    },
);
</script>

<style scoped>
.traininfo-main-view {
    margin-top: 30px;
}

.text-error {
    color: #f44336 !important;
    font-weight: bold;
}
</style>
