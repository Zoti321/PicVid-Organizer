import {createRouter, createWebHistory} from 'vue-router'
import PvoComicPage from "../views/benzi/pvoComicPage.vue";
import PvoComicsAlbum from "../views/benzi/pvoComicsAlbum.vue";
import PvoImageSetReader from "../views/benzi/pvoImageSetReader.vue";
import LGMHome from "../views/LGMHome.vue";
import LgmComicReaderScrollMode from "../views/benzi/ComicReader/LGMComicReaderScrollMode.vue";
import LGMSettings from "../views/LGMSettings.vue";
import mmd3D from "../views/media/mmd3D.vue"
import AdultVideos from "../views/media/AdultVideos.vue";
import EroAnimation from "../views/media/EroAnimation.vue";
import SoundComic from "../views/media/SoundComic.vue";
import LGMResourceManagement from "../views/LGMResourceManagement.vue";
import LGMComicReader from "../views/benzi/ComicReader/LGMComicReader.vue";


const routes = [
    {path: '/', name: '主页', component: LGMHome},
    {path: '/benzi/comics', name: '漫画', component: PvoComicsAlbum},
    {path: '/benzi/image-set', name: '图片合集', component: PvoImageSetReader},
    {path: '/comic/:id', component: PvoComicPage},
    {path: '/comic-reader/:id', component: LGMComicReader},
    {path: '/comic-reader-scroll/:id', component: LgmComicReaderScrollMode},
    {path: '/media/3D', component: mmd3D},
    {path: '/media/ero-animation', component: EroAnimation},
    {path: '/media/av', component: AdultVideos},
    {path: '/media/sound-comic', component: SoundComic},
    {path: '/resource-management', component: LGMResourceManagement},
    {path: '/settings', component: LGMSettings}
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes: routes,
    }
)

export default router