const MainLayOut = () => import('@/views/main/layout');
const Main = () => import('@/views/main/index');
export default [
  {
    path: '/',
    component: MainLayOut,
    children: [
      { path: '/', component: Main, meta: { title: '首页' } },
    ],
  },
];
