    import {createRouter, createWebHashHistory} from 'vue-router'
    import BabylonMetaRoom from "../components/BabylonMetaRoom.vue";
    import ForVR from "../components/ForVR.vue";
    import Choice from "../components/Choice.vue"

const routes = [
    {
        path: '/',
        redirect: '/choice'
    },
    {
        path: '/choice',
        name: 'Choice',
        component: Choice
    },
    {
        path: '/web',
        name: 'MetaRoom',
        component: BabylonMetaRoom
    },
    {
        path: '/oculus',
        name: 'ForVR',
        component: ForVR
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

export default router;

