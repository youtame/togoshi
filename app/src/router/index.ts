import { createRouter, createWebHistory } from 'vue-router';

import type { RouteLocationNormalized } from 'vue-router';

const Home = () => import('@/pages/Home.vue');
const Comments = () => import('@/pages/Comments.vue');
const AboutSite = () => import('@/pages/AboutSite.vue');
const Manager = () => import('@/pages/Manager.vue');
const LinePage = () => import('@/pages/LinePage.vue');
const LinePageLT = () => import('@/pages/LinePageLT.vue');
const NotFound = () => import('@/pages/NotFound.vue');
const Status = () => import('@/pages/Status.vue');
const Infomation = () => import('@/pages/information.vue');
const Outofservice = () => import('@/pages/Outofservice.vue');

const VALID_LINES = [
    'asakusa',
    'mita',
    'shinjuku',
    'oedo',
    'arakawa',
    'blueline',
    'greenline',
    'nambu',
    'chuo',
    'musashino',
    'shonanshinjuku',
    'yokosuka',
    'yokohama',
    'soburapid',
    'keihintohokunegishi',
    'utsunomiya',
    'jobanrapid',
    'jobanlocal',
    'joban',
    'keiyo',
    'saikyokawagoe',
    'takasaki',
    'chuorapid',
    'chuosobulocal',
    'tokaido',
    'sotetsudirect',
    'itsukaichi',
    'ome',
    'yamanote',
    'chuo',
    'kawagoe',
    'tojo',
    'tobuskytree',
    'daishi',
    'ogose',
    'kameido',
    'isesaki',
    'nikko',
    'tobuurbanpark',
    'main',
    'uchibo',
];

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
        path: '/status',
        name: 'status',
        component: Status,
        meta: { title: 'Retration｜列車位置検索' },
    },
    {
        path: '/line/:lineId',
        name: 'line',
        component: LinePage,
        props: true,
        meta: { title: 'Retration｜列車位置検索' },
        beforeEnter: (to: RouteLocationNormalized) => {
            const param = to.params.lineId;
            const lineId = Array.isArray(param) ? param[0] : param;

            if (typeof lineId !== 'string' || !VALID_LINES.includes(lineId)) {
                return { name: 'NotFound' };
            }
        },
    },
    {
        path: '/line/timelimited/:lineId',
        name: 'outofservice',
        component: Outofservice,
        props: true,
        meta: { title: 'Retration｜列車位置検索' },
        beforeEnter: (to: RouteLocationNormalized) => {
            const param = to.params.lineId;
            const lineId = Array.isArray(param) ? param[0] : param;

            if (typeof lineId !== 'string' || !VALID_LINES.includes(lineId)) {
                return { name: 'NotFound' };
            }
        },
    },
    {
        path: '/information/:informationId',
        name: 'lineInfomation',
        component: Infomation,
        props: true,
        meta: { title: 'Retrationお知らせ｜列車位置検索' },
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
