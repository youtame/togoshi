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
    asakusa: '都営地下鉄浅草線',
    mita: '都営地下鉄三田線',
    shinjuku: '都営地下鉄新宿線',
    oedo: '都営地下鉄大江戸線',
    blueline: '横浜市営地下鉄ブルーライン',
    greenline: '横浜市営地下鉄グリーンライン',
};

watchEffect(() => {
    const lineId = route.params.lineId as string;
    const lineName = LINE_NAME[lineId];

    document.title = lineName
        ? `${lineName}列車走行位置｜Retration`
        : 'Retration';
});
</script>
