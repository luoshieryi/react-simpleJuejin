import React, {Component} from "react";

// @ts-ignore
import styles from './style.module.css';
import Article from "./article";
import {getArticles} from "../../fake-api";
import {Link} from "react-router-dom";


//无限滚动渲染条数
const THRESHOLD = 15;
//向后端一次请求的数据数 (max: 60)
const NUM = 50;
//每个列表项高度
const HEIGHT = 150;

export interface article {
    id: string,
    author: string,
    title: string,
    brief: string,
    time: string,
}
interface Props {
    categoryId: number,
    sortBy: string,
}

interface State {
    start: number,
    end: number,
    list: article[],
    page: number,
    more: boolean,
    adding: boolean,
}

class ArticleList extends Component<Props, State> {

    private $bottomElement: React.RefObject<any>
    private $topElement: React.RefObject<any>
    private observer: IntersectionObserver

    constructor(props: Props) {
        super(props);
        console.log("constructor");
        this.state = {
            start: 0,
            end: THRESHOLD,
            list: [],
            page: 0,
            more: true,
            adding: true,
        };
        this.$bottomElement = React.createRef();
        this.$topElement = React.createRef();
        this.observer = new IntersectionObserver(this.callback, {
            root: null,
            rootMargin: '0px',
            threshold: 1
        });
        const lastList = sessionStorage.getItem("list");
        if (lastList != null) {
            const lastState = JSON.parse(lastList);
            this.state = {
                start: lastState.start,
                end: lastState.end,
                list: lastState.list,
                page: lastState.page,
                more: true,
                adding: lastState.adding,
            }
        } else {
            this.addList();
        }
    }

    componentDidMount() {
        console.log("ListMount");
        this.initiateScrollObserver();
        // console.log(this.state);
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        console.log("Update");
        // if ((prevState.end !== this.state.end) || (prevState.start !== this.state.start) || prevState.list !== this.state.list) {
            this.initiateScrollObserver();
        // }
        if (prevProps.sortBy !== this.props.sortBy || prevProps.categoryId !== this.props.categoryId) {
            console.log(this.props);
            this.initList();
        }
        if ((this.state.list.length - this.state.end) < 10 && this.state.more && !this.state.adding && this.state.list.length !== 0) {
            this.setState({
                adding: true,
            })
            this.addList();
        }
    }

    componentWillUnmount() {
        console.log("ListUnMount");
        sessionStorage.setItem("list", JSON.stringify(this.state));
    }

    initList() {
        console.log("initList");
        if (this.props.sortBy !== "history") {
            getArticles(this.props.categoryId, this.props.sortBy, this.state.page * NUM, NUM).then((response) => {
                let newList = response.data.articles.map(article => {
                    //十位时间戳转时间
                    let time = new Date(parseInt(article.article_info.ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ').replace(/\//g, '-');
                    let space_position = time.indexOf(' ');
                    return {
                        id: article.article_id,
                        author: article.author_user_info.user_name,
                        title: article.article_info.title,
                        brief: article.article_info.brief_content,
                        time: time.slice(0, space_position),
                    }
                });
                this.setState({
                    list: newList,
                    page: 0,
                    start: 0,
                    end: Math.min(newList.length-1, THRESHOLD),
                })
            })
        } else {
            let history:article[] = JSON.parse(localStorage.getItem("history") + "");
            if (!history) {
                history = [];
            }
            this.setState({
                list: history,
                page: 0,
                start: 0,
                end: Math.min(history.length-1, THRESHOLD),
                more: false,
            })
        }
    }

    addList() {
        console.log("addList 0 ");
        // console.log(this.state);
        getArticles(this.props.categoryId, this.props.sortBy, this.state.page*NUM, NUM).then((response) => {
            let newList = response.data.articles.map(article => {
                //十位时间戳转时间
                let time = new Date(parseInt(article.article_info.ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ').replace(/\//g, '-');
                let space_position = time.indexOf(' ');
                return {
                    id: article.article_id,
                    author: article.author_user_info.user_name,
                    title: article.article_info.title,
                    brief: article.article_info.brief_content,
                    time: time.slice(0,space_position),
                }
            });
            this.setState({
                list: this.state.list.concat(newList),
                page: this.state.page+1,
                more: response.has_more,
                adding: false,
            })
        })
        console.log("addList 1 " + this.state);
        // console.log(this.state);
    }

    initiateScrollObserver = () => {
        console.log("initiateSO");
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        };
        this.observer = new IntersectionObserver(this.callback, options);

        if (this.$topElement.current) {
            this.observer.observe(this.$topElement.current);
        }
        if (this.$bottomElement.current) {
            this.observer.observe(this.$bottomElement.current);
        }
    }

    callback = (entries: IntersectionObserverEntry[], observer:IntersectionObserver) => {
        console.log("callback");
        entries.forEach((entry, index) => {
            const listLength = this.state.list.length;
            const {start, end} = this.state;
            // Scroll Down
            // We make increments and decrements in 10s
            if (entry.isIntersecting && entry.target.id === "bottom") {
                console.log("down")
                const maxStartIndex = listLength - 1 - THRESHOLD;     // Maximum index value `start` can take
                const maxEndIndex = listLength - 1;                   // Maximum index value `end` can take
                const newEnd = Math.min(((end + 10) <= maxEndIndex ? end + 10 : maxEndIndex), this.state.list.length);
                const newStart = Math.max(((end - 5) <= maxStartIndex ? end - 5 : maxStartIndex),0);
                this.updateState(newStart, newEnd);
            }
            // Scroll up
            if (entry.isIntersecting && entry.target.id === "top") {
                console.log("up")
                const newEnd = Math.min((end === THRESHOLD ? THRESHOLD : (end - 10 > THRESHOLD ? end - 10 : THRESHOLD)), this.state.list.length-1);
                let newStart = Math.max((start === 0 ? 0 : (start - 10 > 0 ? start - 10 : 0)), 0);
                this.updateState(newStart, newEnd);
            }
        });
    }

    resetObservation = () => {
        this.observer.unobserve(this.$bottomElement.current);
        this.observer.unobserve(this.$topElement.current);
        this.$bottomElement = React.createRef();
        this.$topElement = React.createRef();
    }

    updateState = (newStart: number, newEnd: number) => {
        const {start, end} = this.state;
        if (start !== newStart || end !== newEnd) {
            this.resetObservation();
            this.setState({
                start: newStart,
                end: newEnd
            });
        }
    }

    getReference = (index: number, isLastIndex: boolean) => {
        if (index === 0)
            return this.$topElement;
        if (isLastIndex)
            return this.$bottomElement;
        return null;
    }

    addHistory = (item: article) => {
        let history:article[] = JSON.parse(localStorage.getItem("history") + "");
        if (!history) {
            history = [];
        }
        history.push(item);
        localStorage.setItem("history", JSON.stringify(history));
    }

    render() {
        console.log(this.state);

        const {list, start, end} = this.state;
        const updatedList = list.slice(start, end);

        const lastIndex = updatedList.length - 1;

        return (
            <ul style={{position: 'relative'}}>
                <li key={Math.random()} id={'height'} style={{position: 'relative', height: this.state.end * HEIGHT}}/>
                {updatedList.map((item, index) => {
                    const top = (HEIGHT * (index + start)) + 'px';
                    const refVal = this.getReference(index, index === lastIndex);
                    const id = index === 0 ? 'top' : (index === lastIndex ? 'bottom' : '');
                    return (
                        <li className={`${styles['li-card']}`} key={Math.random()} style={{top}} ref={refVal} id={id}>
                            <Link  to={`/article/${item.id}`} style={{font: 'none'}} onClick={() => {this.addHistory(item)}}>
                               <Article  author={item.author} title={item.title} brief={item.brief} time={item.time}/>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    }

}

export default ArticleList;
