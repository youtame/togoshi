import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/pages/Home.vue';
import comments from '@/pages/Comments.vue';
import LinePage from '@/pages/LinePage.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/comments',
        name: 'comments',
        component: comments,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/line/:lineId',
        name: 'line',
        component: LinePage,
        props: true,
        meta: { title: 'Retration｜列車位置検索' },
    },
];

export const router = createRouter({
    history: createWebHistory('/retration2/'),
    routes,
});
