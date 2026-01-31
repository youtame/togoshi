import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('@/pages/Home.vue');
const Comments = () => import('@/pages/Comments.vue');
const AboutSite = () => import('@/pages/AboutSite.vue');
const Manager = () => import('@/pages/Manager.vue');
const LinePage = () => import('@/pages/LinePage.vue');
const LinePageLT = () => import('@/pages/LinePageLT.vue');
const NotFound = () => import('@/pages/NotFound.vue');

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
        component: Comments,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/aboutsite',
        name: 'aboutsite',
        component: AboutSite,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/manager',
        name: 'manager',
        component: Manager,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/line/:lineId',
        name: 'line',
        component: LinePage,
        props: true,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/line/timelimited/:lineId',
        name: 'lineLT',
        component: LinePageLT,
        props: true,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
];

export const router = createRouter({
    history: createWebHistory('/retration2/'),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    },
});
