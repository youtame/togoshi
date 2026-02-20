<template>
    <v-card class="trainlocation-main-view rounded-lg border-md" elevation="0">
        <v-card-title class="ma-1 text-h6 font-weight-semibold">
            <v-icon icon="mdi-map-marker" size="small"></v-icon>
            <span class="pl-3">列車現在位置</span>
        </v-card-title>
        <v-card-subtitle class="ma-1 text-subtitle-2">
            データ最終更新: {{ fetchTime }}<br />
            データは45sで自動更新されます
        </v-card-subtitle>
        <v-card-text class="pa-3">
            <v-alert
                v-if="lineNotice"
                type="info"
                variant="tonal"
                class="text-body-1 warning-card mt-3 mb-6 rounded-lg"
            >
                {{ lineNotice }}
            </v-alert>
            <v-alert
                type="warning"
                variant="tonal"
                class="text-body-1 warning-card mt-3 mb-6 rounded-lg"
            >
                こちらのページは期間限定公開です
            </v-alert>
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
                                    station.same,
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
                                            'odpt.RailDirection:Outbound',
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
                                <!--
                                <div
                                    v-if="train.delay >= 60"
                                    class="font-weight-bold"
                                >
                                    {{ train.delay / 60 }}m
                                </div>-->
                            </div>
                        </div>

                        <div class="north-bound train-container">
                            <div
                                v-for="train in trainsAtStationWithType(
                                    station.same,
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
                                            'odpt.RailDirection:Inbound',
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
                                        marginBottom: '4px',
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
                            <span v-if="selectedTrain.traincarcomposition">
                                {{ selectedTrain.traincarcomposition }}両
                            </span>
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
                        <template
                            v-if="
                                props.lineId === 'yamanote' &&
                                selectedTrain.destinationName === '大崎'
                            "
                        >
                            山手線 {{ displayDirection }}
                        </template>
                        <template v-else>
                            {{ selectedTrain.destinationName
                            }}<span class="dialog-iki">行</span>
                        </template>
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
                                                'bg-red':
                                                    selectedTrain?.delay >= 300,
                                                'bg-yellow':
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

                                    <v-list-item
                                        v-if="selectedTrain.originName"
                                    >
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
                                            >途中経由路線</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            :style="{
                                                backgroundColor:
                                                    selectedTrain.destinationColor,
                                            }"
                                            class="font-weight-semibold text-h6 dialog-origin"
                                            >{{ selectedTrain.destinationLine }}
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

                                    <v-list-item
                                        v-if="selectedTrain.trainOwner"
                                    >
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
                                                        'text-delayed':
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
                                                        'text-delayed':
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

                                <div v-else class="pa-4 text-center text-grey">
                                    時刻表データに対応していない列車です
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
import { useTouch } from 'vuetify/lib/components/VNavigationDrawer/touch.mjs';
import { isJSDocMemberName, isNamedTupleMember, isToken } from 'typescript';
import { it } from 'vuetify/locale';

interface Station {
    same: string;
    name: string;
    code: string;
}

interface Train {
    same: string;
    carComposition: string;
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
    Line: string;
    name: string;
    color: string;
}

interface TrainTimetableData {
    train: string;
    train_nu: string;
    calendar: string;
    train_type: string;
    carComposition: string;
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

interface OdptStation {
    'owl:sameAs': string;
    'odpt:railway': string;
    'odpt:stationTitle'?: {
        ja?: string;
        en?: string;
    };
    'odpt:stationCode'?: string;
}

interface OdptStationOrder {
    'odpt:index': number;
    'odpt:station': string;
}

interface OdptRailway {
    'owl:sameAs': string;
    'odpt:stationOrder'?: OdptStationOrder[];
}

const jsonData = ref<any[]>([]);
const StationInfo = ref<Station[]>([]);
const LocationInfo = ref<Train[]>([]);
const fetchTime = ref('');
const TrainTypeMap = ref<
    Record<string, { name: string; short: string; color: string }>
>({});
const TrainDestinationMap = ref<
    Record<string, { name: string; Line: string; color: string }>
>({});
const TrainTimetableList = ref<TrainTimetableData[]>([]);
const TrainCompanyMap = ref<Record<string, { company: string; name: string }>>(
    {},
);
const props = defineProps<{
    lineId: string;
}>();
const stationRaw = ref<OdptStation[]>([]);

const LINE_MAP: Record<string, string> = {
    musashino: 'odpt.Railway:JR-East.Musashino',
    shonanshinjuku: 'odpt.Railway:JR-East.ShonanShinjuku',
    yokosuka: 'odpt.Railway:JR-East.Yokosuka',
    keihintohokunegishi: 'odpt.Railway:JR-East.KeihinTohokuNegishi',
    soburapid: 'odpt.Railway:JR-East.SobuRapid',
    yokohama: 'odpt.Railway:JR-East.Yokohama',
    utsunomiya: 'odpt.Railway:JR-East.Utsunomiya',
    takasaki: 'odpt.Railway:JR-East.Takasaki,odpt.Railway:JR-East.Utsunomiya',
    joban: 'odpt.Railway:JR-East.Joban',
    jobanrapid: 'odpt.Railway:JR-East.JobanRapid',
    jobanlocal: 'odpt.Railway:JR-East.JobanLocal',
    saikyokawagoe: 'odpt.Railway:JR-East.SaikyoKawagoe',
    keiyo: 'odpt.Railway:JR-East.Keiyo',
    chuorapid: 'odpt.Railway:JR-East.ChuoRapid',
    nambu: 'odpt.Railway:JR-East.Nambu',
    chuosobulocal: 'odpt.Railway:JR-East.ChuoSobuLocal',
    tokaido: 'odpt.Railway:JR-East.Tokaido',
    chuo: 'odpt.Railway:JR-East.Chuo',
    sotetsudirect: 'odpt.Railway:JR-East.SotetsuDirect',
    itsukaichi: 'odpt.Railway:JR-East.Itsukaichi',
    ome: 'odpt.Railway:JR-East.Ome',
    yamanote: 'odpt.Railway:JR-East.Yamanote',
    kawagoe: 'odpt.Railway:JR-East.Kawagoe',
    tojo: 'odpt.Railway:Tobu.Tojo',
    tobuskytree: 'odpt.Railway:Tobu.TobuSkytree',
    daishi: 'odpt.Railway:Tobu.Daishi',
    ogose: 'odpt.Railway:Tobu.Ogose',
    kameido: 'odpt.Railway:Tobu.Kameido',
    isesaki: 'odpt.Railway:Tobu.Isesaki',
    nikko: 'odpt.Railway:Tobu.Nikko',
    tobuurbanpark: 'odpt.Railway:Tobu.TobuUrbanPark',
    kinugawa: 'odpt.Railway:Tobu.Kinugawa',
    main: 'odpt.Railway:Keikyu.Main',
};

const ROUTE_ICONS: Record<string, string> = {
    musashino: '/retration2/symbole/Musashino-train.png',
    shonanshinjuku: '/retration2/symbole/Shonanshinjuku-train.png',
    yokosuka: '/retration2/symbole/Yokosuka-train.png',
    keihintohokunegishi: '/retration2/symbole/Keihintohokunegishi-train.png',
    yokohama: '/retration2/symbole/Yokohama-train.png',
    soburapid: '/retration2/symbole/Soburapid-train.png',
    utsunomiya: '/retration2/symbole/Utsunomiya-train.png',
    takasaki: '/retration2/symbole/Takasaki-train.png',
    jobanrapid: '/retration2/symbole/Jobanrapid-train.png',
    jobanlocal: '/retration2/symbole/Jobanlocal-train.png',
    saikyokawagoe: '/retration2/symbole/Saikyokawagoe-train.png',
    keiyo: '/retration2/symbole/keiyo-train.png',
    chuorapid: '/retration2/symbole/Chuorapid-train.png',
    nambu: '/retration2/symbole/Nambu-train.png',
    chuosobulocal: '/retration2/symbole/Chuosobulocal-train.png',
    sotetsudirect: '/retration2/symbole/Sotetsudirect-train.png',
    itsukaichi: '/retration2/symbole/Itsukaichi-train.png',
    tokaido: '/retration2/symbole/Tokaido-train.png',
    kawagoe: '/retration2/symbole/Kawagoe-train.png',
    yamanote: '/retration2/symbole/Yamanote-train.png',
    ome: '/retration2/symbole/Ome-train.png',
    tojo: '/retration2/symbole/Tojo-train.png',
    tobuskytree: '/retration2/symbole/Tobuskytree-train.png',
    ogose: '/retration2/symbole/Ogose-train.png',
    daishi: '/retration2/symbole/Daishi-train.png',
    kameido: '/retration2/symbole/Kameido-train.png',
    nikko: '/retration2/symbole/Nikko-train.png',
    isesaki: '/retration2/symbole/Isesaki-train.png',
    tobuurbanpark: '/retration2/symbole/Tobuurbanpark-train.png',
};

const NOTICE: Record<string, string> = {
    utsunomiya:
        '東京 ~ 大宮間で同じ区間を走る高崎線、湘南新宿ラインの列車は表示されません',
    saikyokawagoe: '川越 ~ 高麗川間の川越線はこのページには表示されません',
    takasaki:
        '東京 ~ 大宮間で同じ区間を走る宇都宮線、湘南新宿ラインの列車は表示されません',
    shonanshinjuku:
        '同じ区間を走る高崎線、宇都宮線、東海道線、横須賀線経由列車、埼京線、相鉄線直通列車は表示されません',
    kawagoe: '大宮 ~ 川越間の川越線はこのページには表示されません',
    tokaido: '湘南新宿ラインへ直通する列車は表示されません',
    yamanote:
        '山手線は、大崎行きのすべての列車の行き先が外回りか内回りと表示されます',
    ome: 'データの都合上奥多摩〜青梅間の列車は表示されません',
    itsukaichi: '立川〜拝島間の列車は青梅線のページに表示されます',
    kameido:
        '亀戸線の 小村井 - 東あずま - 亀戸水神 の区間については、列車在線位置の区別ができません',
    isesaki:
        '伊勢崎線は東武動物公園 - 館林間のみの列車位置情報表示で、その他の区間は駅名のみ表示されます',
    nikko: '東武日光線は東武動物公園 - 新栃木間のみの列車位置情報表示で、その他の区間は駅名のみ表示されます',
};

const lineIcon = computed(() => {
    return (
        ROUTE_ICONS[props.lineId] || '/retration2/symbole/retration-icon.png'
    );
});

const lineNotice = computed(() => {
    return NOTICE[props.lineId];
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
    return `${delayMin} 分遅れ`;
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
        const lineKey = LINE_MAP[props.lineId];
        if (!lineKey) {
            console.warn('未対応の路線IDです:', props.lineId);
            return;
        }

        const response = await fetch(
            `https://api-challenge.odpt.org/api/v4/odpt:Train` +
                `?odpt:operator=odpt.Operator:JR-East,odpt.Operator:Tobu,odpt.Operator:Keikyu` +
                `&odpt:railway=${encodeURIComponent(lineKey)}` +
                `&acl:consumerKey=5cnfrm3vdwsfg163rrfrar0jqdlo3910alzus7xiwunv9jkd3x0b17e0vy9d50t0`,
        );

        if (!response.ok) throw new Error('Network Error');

        const data = (await response.json()) as any[];

        LocationInfo.value = data.map((item) => ({
            same: item['owl:sameAs'] ?? '',
            carComposition: item['odpt:carComposition'] ?? '',
            direction: item['odpt:railDirection'] ?? '',
            owner: item['odpt:trainOwner'] ?? null,
            originstation: item['odpt:originStation']?.[0] ?? null,
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

async function fetchStationOrder(
    railwaySameAs: string,
): Promise<Map<string, number>> {
    const res = await fetch(
        `https://api-challenge.odpt.org/api/v4/odpt:Railway?owl:sameAs=${railwaySameAs}&acl:consumerKey=5cnfrm3vdwsfg163rrfrar0jqdlo3910alzus7xiwunv9jkd3x0b17e0vy9d50t0`,
    );
    console.log('railway sameas', railwaySameAs);
    console.log(res);
    if (!res.ok) throw new Error('Railway fetch error');

    const data = (await res.json()) as OdptRailway[];

    const order = data[0]?.['odpt:stationOrder'] ?? [];

    return new Map(order.map((o) => [o['odpt:station'], o['odpt:index']]));
}

// Function to get station information from the API
async function fetchStationInfo() {
    try {
        StationInfo.value = [];
        stationRaw.value = [];

        const lineKey = LINE_MAP[props.lineId];
        if (!lineKey) return;

        const stationRes = await fetch(
            `https://api-challenge.odpt.org/api/v4/odpt:Station` +
                `?odpt:operator=odpt.Operator:JR-East,odpt.Operator:Tobu,odpt.Operator:Keikyu` +
                `&odpt:railway=${encodeURIComponent(lineKey)}` +
                `&acl:consumerKey=5cnfrm3vdwsfg163rrfrar0jqdlo3910alzus7xiwunv9jkd3x0b17e0vy9d50t0`,
        );

        if (!stationRes.ok) throw new Error('Station fetch error');

        stationRaw.value = (await stationRes.json()) as OdptStation[];

        const orderMap = await fetchStationOrder(lineKey);

        let processedStations = stationRaw.value
            .filter((s) => orderMap.has(s['owl:sameAs']))
            .map((s) => ({
                same: s['owl:sameAs'],
                name: s['odpt:stationTitle']?.ja ?? '',
                code: s['odpt:stationCode'] ?? '',
            }));
        if (
            props.lineId === 'shonanshinjuku' ||
            props.lineId === 'saikyokawagoe' ||
            props.lineId === 'yamanote'
        ) {
            processedStations.sort(
                (a, b) =>
                    (orderMap.get(a.same) ?? 0) - (orderMap.get(b.same) ?? 0),
            );
        } else {
            processedStations.sort(
                (a, b) =>
                    (orderMap.get(b.same) ?? 0) - (orderMap.get(a.same) ?? 0),
            );
        }

        StationInfo.value = processedStations;
    } catch (e) {
        console.error(e);
        StationInfo.value = [];
    }
}

// Function to get train type information from local JSON
async function fetchTrainType() {
    try {
        const response = await fetch('/retration2/data/TrainType.json');
        if (!response.ok) throw new Error('Network Error');
        const data: TrainType[] = await response.json();

        TrainTypeMap.value = data.reduce(
            (acc, item) => {
                acc[item.TrainType] = {
                    name: item.name,
                    short: item.short,
                    color: item.color,
                };
                return acc;
            },
            {} as Record<
                string,
                { name: string; short: string; color: string }
            >,
        );

        console.log(TrainTypeMap.value);
    } catch (error) {
        console.error('Failed to fetch train type data', error);
    }
}

// Function to get train destination information from local JSON
async function fetchTraindestination() {
    try {
        const response = await fetch('/retration2/data/TrainDestination.json');
        if (!response.ok) throw new Error('Network Error');
        const data: TrainDestination[] = await response.json();

        TrainDestinationMap.value = data.reduce(
            (acc, item) => {
                acc[item.TrainDestination] = {
                    name: item.name,
                    Line: item.Line,
                    color: item.color,
                };
                return acc;
            },
            {} as Record<string, { name: string; Line: string; color: string }>,
        );

        console.log(TrainDestinationMap.value);
    } catch (error) {
        console.error('Failed to fetch train destination data', error);
    }
}

// Function to get train timetable information from local JSON
async function fetchTrainTimetable() {
    const lineId = props.lineId; // asakusa / mita / shinjuku / oedo
    try {
        const response = await fetch(
            `/retration2/data/timetable/${lineId}-Timetable.json`,
        );
        if (!response.ok) throw new Error('Network Error');

        TrainTimetableList.value = await response.json();
        console.log(`${lineId} の時刻表を読み込みました`);
    } catch (error) {
        console.error(`Failed to fetch timetable for ${lineId}`, error);
        TrainTimetableList.value = [];
    }
}

// Function to get train company information from local JSON
async function fetchTrainCompany() {
    try {
        const response = await fetch('/retration2/data/TrainCompany.json');
        const data: TrainCompany[] = await response.json();

        TrainCompanyMap.value = data.reduce(
            (acc, item) => {
                acc[item.company] = {
                    company: item.company,
                    name: item.name,
                };
                return acc;
            },
            {} as Record<string, { company: string; name: string }>,
        );

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
            traincarcomposition: train?.carComposition ?? null,
            traintypeColor: type?.color ?? '#000',
            trainOwner: company?.name ?? train.owner,
            originName: origin?.name ?? train.originstation,
            originColor: origin?.color ?? '#aaa',
            destinationName: destination?.name ?? train.destinationstation,
            destinationLine: destination?.Line,
            destinationColor: destination?.color ?? '#000',
        };
    });
});

// Function to place train icons at stations
function trainsAtStationWithType(stationSame: string) {
    return LocationInfoWithTypeName.value.filter(
        (train) => train.fromstation === stationSame,
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
        '0',
    )}`;
}

const selectedTrainTimetable = computed(() => {
    if (!selectedTrain.value?.same) return null;

    const calendar = getCalendar();

    return (
        TrainTimetableList.value.find(
            (t) =>
                t.train === selectedTrain.value.same && t.calendar === calendar,
        ) ?? null
    );
});

const selectedTrainTimetableDisplay = computed(() => {
    if (!selectedTrainTimetable.value) return [];

    const delaySec = selectedTrain.value?.delay ?? 0;
    const fromStation = selectedTrain.value?.fromstation ?? null;

    const stationOrder = selectedTrainTimetable.value.timetable.map(
        (t) => t.station,
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
            stationSame: item.station,
            stationName: station?.name ?? item.station,

            platform: item.platform ?? null,

            rawTimeAr: item.time_ar ?? null,
            rawTimeDe: item.time_de ?? null,

            timeAr,
            timeDe,

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
    fetchTrainCompany();

    const calendar = getCalendar();

    console.log('Calendar ?', calendar);

    trainLocationTimer = window.setInterval(() => {
        fetchTrainLocation();
    }, 45 * 1000);
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
    { immediate: true },
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
    flex-wrap: wrap;
    text-align: center;
    padding: 0px 5px 0px 10px;
    min-width: 0;
}

.north-bound {
    flex: 10;
    display: flex;
    flex-wrap: wrap;
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
    transition:
        transform 0.4s ease,
        opacity 0.2s;
}

.v-card-text {
    overflow-y: visible;
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
    color: #f44336 !important;
}

.text-delayed {
    width: 192px;
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: #f44336;
    background-color: #f44336 !important;
    color: #fff !important;
    padding: 2px 4px;
    border-radius: 6px;
}

.smaller {
    font-size: 15px;
}

.bg-yellow {
    width: max-content;
    padding: 2px 6px;
    border-radius: 6px;
}

.bg-red {
    width: max-content;
    padding: 2px 6px;
    border-radius: 6px;
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
