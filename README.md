## react + ts 仿写一点点掘金
From 字节校园镜像计划, 实现了主页与文章页 ( 的逻辑......css勉强满足基本功能 )

#### 总结

无限滚动列表: 使用 IntersectionObserver
1. articleList: 勉强实现了虚拟化列表,  实现: 

   - 观察当前 top , bottom 元素, 分向上/下滚动两个事件, 重新渲染列表项
   - 固定每项高度,  使用绝对定位, 额外添加空白元素撑高度
   - - 存在 当前列表项高度设置过低时, observer事件反复触发的bug , 同时与页面尺寸, threshold 属性有关

   ( *实现有些勉强)), 可拓展性/兼容性不太好*  )

2. commentList: flex布局, 底部添加 onloading 元素并观察

历史状态保存: 使用 Storage

1.  浏览记录用 loaclStorage , 列表页的临时状态用 sessionStorage
   1. 在 constructor 中读取并直接赋值  ( 在 componentDidMount() 中更新后会重复触发Update, 也许会有奇怪的问题 x )

接收参数: 套一层函数组件

```tsx
function WithParams(): ReactElement {
    return  (
        <MyElement params={{id: "1", ...useParams()}} />
    )
}
```



#### 碎碎念 ( x )

1. ts 好麻烦好麻烦..... 尤其还是用了 class component
   - 使用一个 state 要声明一遍, 初始化一遍, 赋值一遍, 三倍快乐))
   - 对于 context, params 等参数, 要先声明类型再手动接收))
   - 在 `import style from './style.module.scss'` 前加上 `@ts-ignore`
   - 呜呜呜....

#### 参考

[Forms and Events]: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/#list-of-event-types
[React Hook]: https://github.com/puxiao/react-hook-tutorial
[https://github.com/puxiao/react-hook-tutorial]:  https://baurine.netlify.app/2020/04/26/pages-share-state/
[React Component 生命周期]: https://zh-hans.reactjs.org/docs/react-component.html
[React Contexts in TypeScript]: https://medium.com/@mtiller/react-contexts-in-typescript-1337abb2e5a7
[React window 与IntersectionObserver API 实现无限卷动Dcard 文章阅读器之心得纪录]: https://oldmo860617.medium.com/react-window-%E8%88%87-intersectionobserver-api-%E5%AF%A6%E7%8F%BE%E7%84%A1%E9%99%90%E6%8D%B2%E5%8B%95-dcard-%E6%96%87%E7%AB%A0%E9%96%B1%E8%AE%80%E5%99%A8%E4%B9%8B%E5%BF%83%E5%BE%97%E7%B4%80%E9%8C%84-97bc1c3faa07



