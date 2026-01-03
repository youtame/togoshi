<template>
    <div>
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

const props = defineProps<{
    lineId: string;
}>();

const route = useRoute();

const LINE_NAME: Record<string, string> = {
    asakusa: '都営浅草線',
    mita: '都営三田線',
    shinjuku: '都営新宿線',
    oedo: '都営大江戸線',
};

watchEffect(() => {
    const lineId = route.params.lineId as string;
    const lineName = LINE_NAME[lineId];

    document.title = lineName ? `${lineName}｜Retration` : 'Retration';
});
</script>
