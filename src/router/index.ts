/*
 * @Author: mryyg
 * @Date: 2020-07-27 22:38:02
 * @LastEditTime: 2020-07-27 23:29:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /workSpace/myBlog/src/router/index.ts
 */ 
import Home from '../blog/pages/home/home';
import Article from '../blog/pages/article/article';

const routes =[
    {
        path: '/home',
        component: Home
    },
    {
        path: '/article',
        component: Article
    }
]

export default routes;