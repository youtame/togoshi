<template>
    <v-card class="trainlocation-main-view rounded-lg">
        <v-card-title class="ma-1 text-h6 font-weight-semibold">
            <v-icon icon="mdi-map-marker" size="small"></v-icon>
            <span class="pl-3">列車現在位置</span>
        </v-card-title>
        <v-card-subtitle class="ma-1 text-subtitle-2">
            データ最終更新: {{ fetchTime }}<br />
            データは30sで自動更新されます
        </v-card-subtitle>
        <v-card-text class="pa-3">
            <v-list class="train-line" dense>
                <v-list-item
                    v-for="(station, index) in StationInfo"
                    :key="station.code"
                    :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
                    class="rounded-lg pt-3 pb-3 pl-2 pr-2"
                    style="min-height: 80px"
                >
                    <div class="station-container">
                        <div class="station-name">
                            <span class="text-body-1 font-weight-bold">{{
                                station.name
                            }}</span
                            ><br />
                            <span class="text-body-2 font-weight-semibold">{{
                                station.code
                            }}</span>
                        </div>

                        <div class="south-bound train-container">
                            <div
                                v-for="train in trainsAtStationWithType(
                                    station.same
                                ).filter(
                                    (t) =>
                                        t.direction ===
                                            'odpt.RailDirection:Southbound' ||
                                        t.direction ===
                                            'odpt.RailDirection:Westbound' ||
                                        t.direction ===
                                            'odpt.RailDirection:Toei.Minowabashi' ||
                                        t.direction ===
                                            'odpt.RailDirection:InnerLoop' ||
                                        t.direction ===
                                            'odpt.RailDirection:Inbound'
                                )"
                                :key="train.trainnumber"
                                class="train-wrapper-south"
                            >
                                <v-icon
                                    icon="mdi-menu-up"
                                    size="x-large"
                                    class="icon-direction-south"
                                    :class="{
                                        'text-red': train?.delay >= 300,
                                        'text-yellow':
                                            train?.delay >= 60 &&
                                            train?.delay < 300,
                                    }"
                                />

                                <v-img
                                    :src="lineIcon"
                                    max-height="40"
                                    max-width="40"
                                    contain
                                    class="icon-train"
                                    @click="openTrainDialog(train)"
                                    style="cursor: pointer"
                                />

                                <div
                                    class="train-type text-caption font-weight-bold"
                                    :style="{
                                        backgroundColor: train.traintypeColor,
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                    }"
                                >
                                    {{ train.traintypeShort }}
                                </div>
                            </div>
                        </div>

                        <div class="north-bound train-container">
                            <div
                                v-for="train in trainsAtStationWithType(
                                    station.same
                                ).filter(
                                    (t) =>
                                        t.direction ===
                                            'odpt.RailDirection:Northbound' ||
                                        t.direction ===
                                            'odpt.RailDirection:Eastbound' ||
                                        t.direction ===
                                            'odpt.RailDirection:Toei.Waseda' ||
                                        t.direction ===
                                            'odpt.RailDirection:OuterLoop' ||
                                        t.direction ===
                                            'odpt.RailDirection:Outbound'
                                )"
                                :key="train.trainnumber"
                                class="train-wrapper-north"
                            >
                                <v-icon
                                    icon="mdi-menu-down"
                                    size="x-large"
                                    class="icon-direction-north"
                                    :class="{
                                        'text-red': train?.delay >= 300,
                                        'text-yellow':
                                            train?.delay >= 60 &&
                                            train?.delay < 300,
                                    }"
                                />

                                <v-img
                                    :src="lineIcon"
                                    max-height="40"
                                    max-width="40"
                                    contain
                                    class="icon-train"
                                    @click="openTrainDialog(train)"
                                    style="cursor: pointer"
                                />

                                <div
                                    class="train-type text-caption font-weight-bold"
                                    :style="{
                                        backgroundColor: train.traintypeColor,
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                    }"
                                >
                                    {{ train.traintypeShort }}
                                </div>
                            </div>
                        </div>
                    </div>
                </v-list-item>
            </v-list>
        </v-card-text>

        <v-dialog
            v-model="dialog"
            width="90%"
            max-width="420px"
            max-height="700px"
            scrollable
        >
            <v-card>
                <v-card-title class="pa-4">
                    <div class="d-flex justify-space-between align-center">
                        <h2
                            class="dialog-type"
                            :style="{
                                backgroundColor: selectedTrain.traintypeColor,
                            }"
                        >
                            {{ selectedTrain.traintypeName }}
                        </h2>
                        <v-btn variant="plain" icon @click="dialog = false">
                            <v-icon icon="mdi-close" />
                        </v-btn>
                    </div>

                    <h1
                        class="dialog-destination mt-2"
                        :style="{
                            backgroundColor: selectedTrain.destinationColor,
                        }"
                    >
                        {{ selectedTrain.destinationName
                        }}<span class="dialog-iki">行</span>
                    </h1>
                </v-card-title>

                <v-tabs class="sticky-tabs" v-model="trainTab" grow>
                    <v-tab class="font-weight-semibold" value="summary"
                        >列車概要</v-tab
                    >
                    <v-tab class="font-weight-semibold" value="timetable"
                        >時刻表</v-tab
                    >
                </v-tabs>

                <v-divider />
                <v-card-text class="pa-0">
                    <v-window v-model="trainTab">
                        <v-window-item value="summary">
                            <v-card-text
                                class="pa-1"
                                style="max-height: 400px; overflow-y: auto"
                            >
                                <p
                                    :class="{
                                        'text-red': selectedTrain?.delay >= 300,
                                        'text-yellow':
                                            selectedTrain?.delay >= 60 &&
                                            selectedTrain?.delay < 300,
                                    }"
                                ></p>

                                <v-list density="compact">
                                    <v-list-item>
                                        <v-list-item-title
                                            >現在地</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            class="font-weight-semibold text-h6"
                                        >
                                            {{ currentStationName }}
                                        </v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title
                                            >遅れ</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            :class="{
                                                'text-red':
                                                    selectedTrain?.delay >= 300,
                                                'text-yellow':
                                                    selectedTrain?.delay >=
                                                        60 &&
                                                    selectedTrain?.delay < 300,
                                            }"
                                            class="font-weight-semibold text-h6"
                                        >
                                            {{ delayText }}
                                        </v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title
                                            >列車番号</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            class="font-weight-semibold text-h6"
                                        >
                                            {{ selectedTrain.trainnumber }}
                                        </v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title
                                            >始発駅（経由）</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            :style="{
                                                backgroundColor:
                                                    selectedTrain.originColor,
                                            }"
                                            class="font-weight-semibold text-h6 dialog-origin"
                                        >
                                            {{ selectedTrain.originName }}
                                        </v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title
                                            >進行方向</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            class="font-weight-semibold text-h6"
                                        >
                                            {{ displayDirection }}
                                        </v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title
                                            >運行日</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            class="font-weight-semibold text-h6"
                                        >
                                            {{ displayCalendar }} 運用
                                        </v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title
                                            >車両保有</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            class="font-weight-semibold text-h6"
                                        >
                                            {{ selectedTrain.trainOwner }} 車
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-window-item>

                        <v-window-item value="timetable" scrollable>
                            <v-card-text
                                class="pa-4"
                                style="max-height: 400px; overflow-y: auto"
                            >
                                <TrainTimetableView :train="selectedTrain" />
                                <div v-if="selectedTrainTimetable">
                                    <h3 class="pa-1">列車時刻表</h3>

                                    <div
                                        v-for="(
                                            row, index
                                        ) in selectedTrainTimetableDisplay"
                                        :key="row.stationSame"
                                        class="rounded-lg pt-3 pb-3 pl-2 pr-2 dialog-station-container"
                                        :class="[
                                            {
                                                'past-station':
                                                    row.isPastStation,
                                            },
                                            index % 2 === 0
                                                ? 'even-row'
                                                : 'odd-row',
                                        ]"
                                        style="min-height: 80px"
                                    >
                                        <div class="dialog-station-name">
                                            <span
                                                class="text-body-1 font-weight-bold"
                                            >
                                                {{ row.stationName }}
                                                <span
                                                    class="text-body-2 font-weight-semibold"
                                                >
                                                    {{
                                                        row.platform
                                                            ? '（' +
                                                              row.platform +
                                                              '番線）'
                                                            : ''
                                                    }}
                                                </span>
                                            </span>
                                        </div>

                                        <div class="train-container">
                                            <div class="dialog-timetable-times">
                                                <span
                                                    v-if="row.timeAr"
                                                    :class="{
                                                        'text-blue':
                                                            row.isDelayed,
                                                    }"
                                                    class="text-h6"
                                                >
                                                    {{ row.timeAr }}
                                                    <span
                                                        v-if="row.isDelayed"
                                                        class="smaller"
                                                    >
                                                        （定刻
                                                        {{ row.rawTimeAr }}）
                                                    </span>
                                                </span>

                                                <span
                                                    v-if="row.timeDe"
                                                    :class="{
                                                        'text-blue':
                                                            row.isDelayed,
                                                    }"
                                                    class="text-h6"
                                                >
                                                    {{ row.timeDe }}
                                                    <span
                                                        v-if="row.isDelayed"
                                                        class="smaller"
                                                    >
                                                        （{{
                                                            selectedTrain.delay /
                                                            60
                                                        }}分遅れ）
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="dialog-timetable-trainnumber">
                                        {{ selectedTrain.trainnumber }}運用{{
                                            displayCalendar
                                        }}ダイヤ
                                    </p>
                                </div>
                            </v-card-text>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getCalendar } from '@/utils/Calendar';

interface Station {
    same: string;
    name: string;
    code: string;
}

interface Train {
    same: string;
    direction: string;
    owner: string;
    originstation: string;
    destinationstation: string | null;
    fromstation: string | null;
    tostation: string | null;
    traintype: string | null;
    trainnumber: string;
    delay: number;
}

interface TrainType {
    TrainType: string;
    name: string;
    short: string;
    color: string;
}

interface TrainDestination {
    TrainDestination: string;
    name: string;
    color: string;
}

interface TrainTimetableData {
    train: string;
    train_nu: string;
    calendar: string;
    train_type: string;
    direction: string;
    timetable: {
        station: string;
        platform?: string;
        time_ar?: string;
        time_de?: string;
    }[];
}

interface TrainCompany {
    TrainCompany: string;
    company: string;
    name: string;
}

const jsonData = ref<any[]>([]);
const StationInfo = ref<Station[]>([]);
const LocationInfo = ref<Train[]>([]);
const fetchTime = ref('');
const TrainTypeMap = ref<
    Record<string, { name: string; short: string; color: string }>
>({});
const TrainDestinationMap = ref<
    Record<string, { name: string; color: string }>
>({});
const TrainTimetableList = ref<TrainTimetableData[]>([]);
const TrainCompanyMap = ref<Record<string, { company: string; name: string }>>(
    {}
);
const props = defineProps<{
    lineId: string;
}>();

const LINE_MAP: Record<string, string> = {
    asakusa: 'odpt.Railway:Toei.Asakusa',
    mita: 'odpt.Railway:Toei.Mita',
    shinjuku: 'odpt.Railway:Toei.Shinjuku',
    oedo: 'odpt.Railway:Toei.Oedo',
};

const ROUTE_ICONS: Record<string, string> = {
    asakusa: '/retration2/Asakusa-train.png',
    mita: '/retration2/Mita-train.png',
    shinjuku: '/retration2/Shinjuku-train.png',
    oedo: '/retration2/Oedo-train.png',
};

const lineIcon = computed(() => {
    return ROUTE_ICONS[props.lineId] || '/default-icon.png';
});

const dialog = ref(false);
const selectedTrain = ref<any>({});
const trainTab = ref<'summary' | 'timetable'>('summary');

const delayText = computed<string>(() => {
    const delaySec = selectedTrain.value?.delay ?? 0;

    if (delaySec < 60) {
        return '時刻通り運転しています';
    }

    const delayMin = Math.floor(delaySec / 60);
    return `${delayMin} 分遅延`;
});

const directionMap: Record<string, string> = {
    'odpt.RailDirection:Southbound': '南方向',
    'odpt.RailDirection:Northbound': '北方向',
    'odpt.RailDirection:Eastbound': '東方向',
    'odpt.RailDirection:Westbound': '西方向',
    'odpt.RailDirection:Inbound': '上り',
    'odpt.RailDirection:Outbound': '下り',
    'odpt.RailDirection:InnerLoop': '内回り',
    'odpt.RailDirection:OuterLoop': '外回り',
    'odpt.RailDirection:Toei.Minowabashi': '三ノ輪橋方向',
    'odpt.RailDirection:Toei.Waseda': '早稲田方向',
};

const calendardataMap: Record<string, string> = {
    'odpt.Calendar:SaturdayHoliday': '土休日',
    'odpt.Calendar:Weekday': '平日',
};

const displayDirection = computed(() => {
    return directionMap[selectedTrain.value?.direction] ?? '不明';
});

const displayCalendar = computed(() => {
    return calendardataMap[getCalendar()] ?? '';
});

function openTrainDialog(train: any) {
    selectedTrain.value = train;
    dialog.value = true;
}

async function fetchTrainLocation() {
    try {
        const response = await fetch(
            'https://api.odpt.org/api/v4/odpt:Train?odpt:operator=odpt.Operator:Toei&acl:consumerKey=b70f7d9c215874f66461094458ea3f080fec87af36b3c31981aa35d3cb59afa4' //
        );
        if (!response.ok) throw new Error('Network Error');
        jsonData.value = await response.json();

        const lineKey = LINE_MAP[props.lineId];

        if (!lineKey) {
            console.warn('未対応の路線IDです:', props.lineId);
            return;
        }

        const location = jsonData.value.filter(
            (item) => item['odpt:railway'] === lineKey
        );

        LocationInfo.value = location.map((item) => ({
            same: item['owl:sameAs'] ?? '',
            direction: item['odpt:railDirection'] ?? '',
            owner: item['odpt:trainOwner'] ?? '自社局',
            originstation:
                item['odpt:originStation']?.[0] ?? '始発駅データなし',
            destinationstation:
                item['odpt:destinationStation']?.[0] ?? '行き先データなし',
            delay: item['odpt:delay'] ?? 0,
            fromstation: item['odpt:fromStation'] ?? null,
            tostation: item['odpt:toStation'] ?? null,
            traintype: item['odpt:trainType'] ?? null,
            trainnumber: item['odpt:trainNumber'] ?? '',
        }));

        console.log(LocationInfo.value);

        const now = new Date();
        fetchTime.value = formatTime(now);
    } catch (error) {
        console.error('Failed to fetch train location data', error);
    }
}

// Function to get station information from the API
async function fetchStationInfo() {
    try {
        const response = await fetch(
            'https://api.odpt.org/api/v4/odpt:Station?odpt:operator=odpt.Operator:Toei&acl:consumerKey=b70f7d9c215874f66461094458ea3f080fec87af36b3c31981aa35d3cb59afa4'
        );
        if (!response.ok) throw new Error('Network Error');
        jsonData.value = await response.json();

        const lineKey = LINE_MAP[props.lineId];

        if (!lineKey) {
            console.warn('未対応の路線IDです:', props.lineId);
            return;
        }

        const station = jsonData.value.filter(
            (item) => item['odpt:railway'] === lineKey
        );

        StationInfo.value = station.map((item) => ({
            same: item['owl:sameAs'] ?? '',
            name: item['odpt:stationTitle']?.ja ?? '',
            code: item['odpt:stationCode'] ?? '',
        }));

        StationInfo.value.sort((a, b) => {
            const numA = parseInt(a.code.replace(/[^0-9]/g, ''), 10);
            const numB = parseInt(b.code.replace(/[^0-9]/g, ''), 10);
            return numA - numB;
        });

        console.log(StationInfo.value);
    } catch (error) {
        console.error('Failed to fetch station data', error);
    }
}

async function fetchTrainType() {
    try {
        const response = await fetch('/retration2/data/TrainType.json');
        if (!response.ok) throw new Error('Network Error');
        const data: TrainType[] = await response.json();

        TrainTypeMap.value = data.reduce((acc, item) => {
            acc[item.TrainType] = {
                name: item.name,
                short: item.short,
                color: item.color,
            };
            return acc;
        }, {} as Record<string, { name: string; short: string; color: string }>);

        console.log(TrainTypeMap.value);
    } catch (error) {
        console.error('Failed to fetch train type data', error);
    }
}

async function fetchTraindestination() {
    try {
        const response = await fetch('/retration2/data/TrainDestination.json');
        if (!response.ok) throw new Error('Network Error');
        const data: TrainDestination[] = await response.json();

        TrainDestinationMap.value = data.reduce((acc, item) => {
            acc[item.TrainDestination] = {
                name: item.name,
                color: item.color,
            };
            return acc;
        }, {} as Record<string, { name: string; color: string }>);

        console.log('Main : ', TrainDestinationMap.value);
    } catch (error) {
        console.error('Failed to fetch train destination data', error);
    }
}

async function fetchTrainTimetable() {
    const lineId = props.lineId; // asakusa / mita / shinjuku / oedo
    try {
        const response = await fetch(
            `/retration2/data/${lineId}-Timetable.json`
        );
        if (!response.ok) throw new Error('Network Error');

        TrainTimetableList.value = await response.json();
        console.log(`${lineId} の時刻表を読み込みました`);
    } catch (error) {
        console.error(`Failed to fetch timetable for ${lineId}`, error);
        TrainTimetableList.value = [];
    }
}

async function fetchTrainCompnay() {
    try {
        const response = await fetch('/retration2/data/TrainCompany.json');
        const data: TrainCompany[] = await response.json();

        TrainCompanyMap.value = data.reduce((acc, item) => {
            acc[item.company] = {
                company: item.company,
                name: item.name,
            };
            return acc;
        }, {} as Record<string, { company: string; name: string }>);

        console.log(data);
    } catch (error) {
        console.error('Failed to fetch train timetable data', error);
    }
}

const LocationInfoWithTypeName = computed(() => {
    return LocationInfo.value.map((train) => {
        const type = train.traintype
            ? TrainTypeMap.value[train.traintype]
            : null;

        const destination = train.destinationstation
            ? TrainDestinationMap.value[train.destinationstation]
            : null;

        const origin = train.destinationstation
            ? TrainDestinationMap.value[train.originstation]
            : null;

        const company = train.owner ? TrainCompanyMap.value[train.owner] : null;

        return {
            ...train,
            traintypeName: type?.name ?? train.traintype,
            traintypeShort: type?.short ?? train.traintype,
            traintypeColor: type?.color ?? '#000',
            trainOwner: company?.name ?? train.owner,
            originName: origin?.name ?? train.originstation,
            originColor: origin?.color ?? '#aaa',
            destinationName: destination?.name ?? train.destinationstation,
            destinationColor: destination?.color ?? '#000',
        };
    });
});

// Function to place train icons at stations
function trainsAtStationWithType(stationSame: string) {
    return LocationInfoWithTypeName.value.filter(
        (train) => train.fromstation === stationSame
    );
}

function addDelayToTime(time: string, delaySec: number): string {
    if (!time || delaySec === 0) return time;

    const [hour, minute] = time.split(':').map(Number);
    const delayMin = delaySec / 60;

    const totalMinutes = (hour ?? 0) * 60 + (minute ?? 0) + delayMin;
    const newHour = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;

    return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(
        2,
        '0'
    )}`;
}

const selectedTrainTimetable = computed(() => {
    if (!selectedTrain.value?.same) return null;

    const calendar = getCalendar();

    return (
        TrainTimetableList.value.find(
            (t) =>
                t.train === selectedTrain.value.same && t.calendar === calendar
        ) ?? null
    );
});

const selectedTrainTimetableDisplay = computed(() => {
    if (!selectedTrainTimetable.value) return [];

    const delaySec = selectedTrain.value?.delay ?? 0;
    const fromStation = selectedTrain.value?.fromstation ?? null;

    // 時刻表に出てくる駅順
    const stationOrder = selectedTrainTimetable.value.timetable.map(
        (t) => t.station
    );

    const fromIndex = fromStation ? stationOrder.indexOf(fromStation) : -1;

    return selectedTrainTimetable.value.timetable.map((item, index) => {
        const station = StationInfo.value.find((s) => s.same === item.station);

        const timeAr = item.time_ar
            ? addDelayToTime(item.time_ar, delaySec)
            : null;

        const timeDe = item.time_de
            ? addDelayToTime(item.time_de, delaySec)
            : null;

        return {
            // 駅情報
            stationSame: item.station,
            stationName: station?.name ?? item.station,

            platform: item.platform ?? null,

            // 元時刻（検証・表示用）
            rawTimeAr: item.time_ar ?? null,
            rawTimeDe: item.time_de ?? null,

            // 遅延反映後
            timeAr,
            timeDe,

            // 状態フラグ
            isDelayed: delaySec > 0,
            isPastStation: fromIndex !== -1 && index <= fromIndex,
        };
    });
});

const currentStationName = computed(() => {
    const same = selectedTrain.value?.fromstation;
    if (!same) return '不明';

    const station = StationInfo.value.find((s) => s.same === same);
    return station?.name ?? '不明';
});

// Make the time display look so nice
function formatTime(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}

// https://api.odpt.org/api/v4/odpt:Station?odpt:operator=odpt.Operator:Toei&acl:consumerKey=b70f7d9c215874f66461094458ea3f080fec87af36b3c31981aa35d3cb59afa4
// https://api.odpt.org/api/v4/odpt:Train?odpt:operator=odpt.Operator:Toei&acl:consumerKey=b70f7d9c215874f66461094458ea3f080fec87af36b3c31981aa35d3cb59afa4

let trainLocationTimer: number | undefined;

onMounted(() => {
    fetchStationInfo();
    fetchTrainLocation();
    fetchTrainType();
    fetchTraindestination();
    fetchTrainTimetable();
    fetchTrainCompnay();

    const calendar = getCalendar();

    console.log('今日はどっちだcalendar', calendar);

    trainLocationTimer = window.setInterval(() => {
        fetchTrainLocation();
    }, 30 * 1000);
});

onUnmounted(() => {
    if (trainLocationTimer) {
        clearInterval(trainLocationTimer);
    }
});

watch(
    () => props.lineId,
    () => {
        fetchStationInfo();
        fetchTrainLocation();
        fetchTrainTimetable();
    },
    { immediate: true }
);
</script>

<style>
.trainlocation-main-view {
    margin-top: 30px;
}

.odd-row {
    background-color: rgb(var(--v-theme-primary));
}

.v-list {
    position: relative;
}

.train-line::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(1 / 5 * 100% + 3 / 7 * 100%);
    width: 7px;
    border-radius: 5px;
    background-color: rgb(var(--v-theme-secondary));
    pointer-events: none;
}

.station-container {
    display: flex;
    min-height: 80px;
    width: 100%;
}

.station-name {
    flex: 9;
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.train-container {
    display: flex;
    gap: 8px;
}

.train-wrapper-south {
    position: relative;
    display: inline-block;
    padding-top: 20px;
}

.train-wrapper-north {
    position: relative;
    display: inline-block;
    padding-top: 0px;
}

.icon-direction-south {
    position: absolute;
    z-index: 9999;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
}

.icon-direction-north {
    position: absolute;
    z-index: 9999;
    top: 57px;
    left: 50%;
    transform: translateX(-50%);
}

.south-bound {
    flex: 10;
    display: flex;
    text-align: center;
    padding: 0px 5px 0px 10px;
    min-width: 0;
}

.north-bound {
    flex: 10;
    display: flex;
    text-align: center;
    padding: 0px 5px 0px 8px;
    min-width: 0;
}

.icon-train {
    width: 50px;
    height: 50px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.v-card-text {
    overflow-y: visible; /* 親の overflow を visible に */
}

.sticky-tabs {
    position: sticky;
    top: 0;
    z-index: 10;
}

.dialog-type {
    padding: 3px 8px 3px 8px;
    color: #fff;
    border-radius: 5px;
    height: max-content;
    width: max-content;
    max-width: 100%;
    font-size: 18px;
}

.dialog-origin {
    margin-top: 5px;
    padding: 3px 8px 3px 8px;
    color: #fff;
    border-radius: 5px;
    width: max-content;
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
    text-align: center;
    font-size: 20px;
}

.dialog-destination {
    margin: auto;
    margin-top: 10px;
    padding: 3px 8px 3px 8px;
    color: #fff;
    border-radius: 5px;
    width: max-content;
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
    text-align: center;
    font-size: 20px;
}

.dialog-destination .dialog-iki {
    font-size: 14px;
}

.dialog-station-container {
    display: flex;
    align-items: center;
}

.dialog-station-name {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.dialog-timetable-times {
    flex: 10;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dialog-timetable-trainnumber {
    padding: 10px 5px 5px 5px;
    font-size: 15px;
}

.past-station .text-h6 {
    text-decoration: line-through;
    opacity: 0.4;
}

.text-red {
    text-decoration: none;
    color: crimson !important;
}

.smaller {
    font-size: 15px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
