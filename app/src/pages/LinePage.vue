<template>
    <div>
        <Top />
        <Traininfo :line-id="lineId" />
        <Trainlocation :line-id="lineId" />
        <Aboutsite />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watchEffect } from 'vue';
import Traininfo from '@/components/TrainInformation.vue';
import Trainlocation from '@/components/TrainLocation.vue';
import Aboutsite from '@/components/AboutSite.vue';
import Top from '@/components/Top.vue';

const props = defineProps<{
    lineId: string;
}>();

const route = useRoute();

const LINE_NAME: Record<string, string> = {
    asakusa: '都営浅草線',
    mita: '都営三田線',
    shinjuku: '都営新宿線',
    oedo: '都営大江戸線',
    blueline: '横浜市営地下鉄ブルーライン',
    greenline: '横浜市営地下鉄グリーンライン',
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
