<template>
    <div>
        <Top />
        <TraininfoLT :line-id="lineId" />
        <Suspense>
            <TrainlocationLT :line-id="lineId" />
        </Suspense>
        <Aboutsite />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watchEffect, defineAsyncComponent } from 'vue';

import TraininfoLT from '@/components/TrainInformationLT.vue';
import Aboutsite from '@/components/AboutSite.vue';
import Top from '@/components/Top.vue';

const TrainlocationLT = defineAsyncComponent({
    loader: async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        return import('@/components/TrainLocationLT.vue');
    },
    loadingComponent: () => import('@/components/Loading.vue'),
});

const props = defineProps<{
    lineId: string;
}>();

const route = useRoute();

const LINE_NAME: Record<string, string> = {
    musashino: 'JR武蔵野線',
    shonanshinjuku: 'JR湘南新宿ライン',
    yokosuka: 'JR横須賀線',
    yokohama: 'JR横浜線',
    soburapid: 'JR総武快速線',
    keihintohokunegishi: 'JR京浜東北線・根岸線',
    utsunomiya: 'JR宇都宮線',
    jobanrapid: 'JR常磐快速線',
    jobanlocal: 'JR常磐線各駅停車',
    keiyo: 'JR京葉線',
    saikyokawagoe: 'JR埼京・川越線',
    takasaki: 'JR高崎線',
    chuorapid: 'JR中央線快速',
    chuosobulocal: 'JR中央・総武線各駅停車',
    tokaido: 'JR東海道線',
    sotetsudirect: 'JR相鉄直通線',
    itsukaichi: 'JR五日市線',
    nambu: 'JR南武線',
    ome: 'JR青梅線',
    yamanote: 'JR山手線',
    kawagoe: 'JR川越線',
    chuo: 'JR中央本線',
    tojo: '東武東上線',
    tobuskytree: '東武スカイツリーライン',
    ogose: '東武越生線',
    daishi: '東武大師線',
    kameido: '東武亀戸線',
    tobuurbanpark: '東武アーバンパークライン',
    isesaki: '東武伊勢崎線',
    nikko: '東武日光線',
};

watchEffect(() => {
    const lineId = route.params.lineId as string;
    const lineName = LINE_NAME[lineId];

    document.title = lineName
        ? `${lineName} 列車走行位置｜リアルタイム更新 Retration`
        : 'Retration | リアルタイム列車走行位置表示サイト';

    const description = lineName
        ? `${lineName}の列車走行位置・運行情報・現在の在線をリアルタイム表示。45秒間隔の自動更新で、最新の在線状況をアプリ不要で確認できます。`
        : '公共交通機関のリアルタイムな運行状況を確認できるサイトです。';

    let metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
    }
});
</script>
