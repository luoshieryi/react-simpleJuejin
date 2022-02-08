import React, {Component} from "react";

// @ts-ignore
import styles from './style.module.css';
import { getCommentsByArticleId} from "../../fake-api";

//向后端一次请求的数据数 (max: 60)
const NUM = 15;
//IO的选项
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
}

interface comments {
    id: string
    avatar: string,
    author: string,
    time: string,
    content: string,
    reply: comments | undefined,
}

interface Props {
    articleId: string,
}

interface State {
    list: comments[],
    page: number,
    more: boolean,
}

class CommentList extends Component<Props, State> {

    private readonly $onloadElement: React.RefObject<HTMLDivElement>
    private observer: IntersectionObserver

    constructor(props: Props) {
        super(props);
        this.state = {
            list: [],
            page: 0,
            more: true
        };
        this.$onloadElement = React.createRef();
        this.observer = new IntersectionObserver(this.callback, options);
        this.addList();
        console.log("init")
    }

    componentDidMount() {
        if (this.$onloadElement.current) {
            this.observer.observe(this.$onloadElement.current);
        }
    }

    addList() {
        console.log("addList");
        getCommentsByArticleId(this.props.articleId, this.state.page*NUM, NUM).then((response) => {
            console.log(this.state);
            console.log(response);
            let newList = response.data.comments.map(comment => {
                //十位时间戳转时间
                let time = new Date(comment.comment_info.ctime * 1000).toLocaleString().replace(/:\d{1,2}$/,' ').replace(/\//g, '-');
                let space_position = time.indexOf(' ');
                let reply: comments | undefined;
                if (comment.reply_infos.length !== 0) {
                    console.log(comment.reply_infos);
                    let r_time = new Date(comment.reply_infos[0].reply_info.ctime * 1000).toLocaleString().replace(/:\d{1,2}$/,' ').replace(/\//g, '-');
                    let r_space_position = time.indexOf(' ');
                    reply = {
                        id: comment.reply_infos[0].reply_id.toString(),
                        avatar: comment.reply_infos[0].user_info.avatar_large,
                        author: comment.reply_infos[0].user_info.user_name,
                        content: comment.reply_infos[0].reply_info.reply_content,
                        time: r_time.slice(0, r_space_position),
                        reply: undefined,
                    }
                }
                return {
                    id: comment.comment_id,
                    avatar: comment.user_info.avatar_large,
                    author: comment.user_info.user_name,
                    content: comment.comment_info.comment_content,
                    time: time.slice(0,space_position),
                    reply: reply
                }
            });
            this.setState({
                list: this.state.list.concat(newList),
                page: this.state.page+1,
                more: response.has_more,
            })
        })
    }

    callback = (entries: IntersectionObserverEntry[]) => {
        console.log(entries);
        entries.forEach((entry) => {
            if (entry.isIntersecting && this.state.more) {
                this.addList();
            }
        });
    }

    render() {

        return (
            <div>
                {this.state.list.map(comment => {
                    if (comment.reply) {
                        return (
                            <div key={Math.random()} className={`${styles["comment"]}`}>
                                <div className={`${styles["mainComment"]}`}>
                                    <img className={`${styles["commentAvatar"]}`}
                                         src="https://s4.ax1x.com/2022/02/07/HKO47F.jpg" alt={"avatar"}/>
                                    <div>
                                        <div className={`${styles["name"]}`}>{comment.author}</div>
                                        <p className={`${styles["commentContent"]}`}>{comment.content}</p>
                                        <p className={`${styles["commentTime"]}`}>{comment.time}</p>
                                    </div>
                                </div>
                                <div className={`${styles["subComment"]}`}>
                                    <img className={`${styles["commentAvatar"]}`}
                                         src="https://s4.ax1x.com/2022/02/07/HKO47F.jpg" alt={"avatar"}/>
                                    <div>
                                        <div className={`${styles["name"]}`}>{comment.reply.author}</div>
                                        <p className={`${styles["commentContent"]}`}>{comment.reply.content}</p>
                                        <p className={`${styles["commentTime"]}`}>{comment.reply.time}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={Math.random()} className={`${styles["comment"]}`}>
                                <div className={`${styles["mainComment"]}`}>
                                    <img className={`${styles["commentAvatar"]}`}
                                         src="https://s4.ax1x.com/2022/02/07/HKO47F.jpg" alt={"avatar"}/>
                                    <div>
                                        <div className={`${styles["name"]}`}>{comment.author}</div>
                                        <p className={`${styles["commentContent"]}`}>{comment.content}</p>
                                        <p className={`${styles["commentTime"]}`}>{comment.time}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
                <div  className={`${styles["onload"]}`} ref={this.$onloadElement} id={"onload"}>没有更多评论了哦</div>
            </div>
        )
    }

}

export default CommentList;
