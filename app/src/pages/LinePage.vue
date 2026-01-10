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
    asakusa: '都営浅草線走行位置',
    mita: '都営三田線走行位置',
    shinjuku: '都営新宿線走行位置',
    oedo: '都営大江戸線走行位置',
    blueline: '横浜市営ブルーライン走行位置',
    greenline: '横浜市営グリーンライン走行位置',
};

watchEffect(() => {
    const lineId = route.params.lineId as string;
    const lineName = LINE_NAME[lineId];

    document.title = lineName ? `${lineName}｜Retration` : 'Retration';
});
</script>
