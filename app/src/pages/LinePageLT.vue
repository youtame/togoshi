<template>
    <div>
        <Top />
        <TraininfoLT :line-id="lineId" />
        <TrainlocationLT :line-id="lineId" />
        <Aboutsite />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watchEffect } from 'vue';
import TraininfoLT from '@/components/TrainInformationLT.vue';
import TrainlocationLT from '@/components/TrainLocationLT.vue';
import Aboutsite from '@/components/AboutSite.vue';
import Top from '@/components/Top.vue';

const props = defineProps<{
    lineId: string;
}>();

const route = useRoute();

const LINE_NAME: Record<string, string> = {
    musashino: 'JR武蔵野線',
    shonanshinjuku: 'JR湘南新宿ライン',
};

watchEffect(() => {
    const lineId = route.params.lineId as string;
    const lineName = LINE_NAME[lineId];

    document.title = lineName ? `${lineName}｜Retration` : 'Retration';
});
</script>
