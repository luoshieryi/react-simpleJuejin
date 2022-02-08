import React, {Component, ReactElement} from 'react';
import {useParams} from "react-router";
import {getArticleById, getCommentsByArticleId} from "../../fake-api";

//@ts-ignore
import styles from './style.module.css'
import CommentList from "./commentList";

interface Props {
    params: {
        id: string,
    }
}

interface State {
    author: {
        avatar: string,
        name: string,
        time: string,
        collectCount: string,
    }
    article: {
        cover: string,
        content: string,
    }
}

class Article2 extends Component<Props, State> {
    constructor(prop: Props) {
        super(prop);
        this.state = {
            author: {
                avatar: "",
                name: "",
                time: "",
                collectCount: "",
            },
            article: {
                cover: "",
                content: "",
            },
        };
        getArticleById(this.props.params.id).then((res) => {
            let article = res.data?.article;
            let ctime = new Date(parseInt(article.article_info.ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ').replace(/\//g, '-');
            let space_position = ctime.indexOf(' ');
            this.setState({
                author: {
                    avatar: article.author_user_info.avatar_large,
                    name: article.author_user_info.user_name,
                    time: ctime.slice(0,space_position),
                    collectCount: article.article_info.collect_count,
                },
                article: {
                    cover: article.article_info.cover_image,
                    content: article.article_content,
                }
            })
            console.log(this.state);
        })
        getCommentsByArticleId(this.props.params.id, 0, 60).then((res) => {
            console.log(res);
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {

        const author = () => (
            <div className={`${styles["author"]}`}>
                {/*接口的头像图片链接无权访问的样子))*/}
                <img className={`${styles["roundAvatar"]}`} src="https://s4.ax1x.com/2022/02/07/HKO47F.jpg" alt={"avatar"}/>
                <div>
                    <h2 className={`${styles["name"]}`}>{this.state?.author.name}</h2>
                    <p className={`${styles["time"]}`}>{this.state?.author.time} | 阅读 {this.state?.author.collectCount}</p>
                </div>
            </div>
        )

        const content = () => (
            <div className={`${styles["content"]}`}>
                <img src={this.state?.article.cover} className={`${styles["cover"]}`} alt={"background img can't load"}/>
                <div dangerouslySetInnerHTML={{__html: this.state?.article.content}} />
            </div>
        )

        return (
            <div className={`${styles["page"]}`}>
                {author()}
                {content()}
                <CommentList articleId={this.props.params.id} />
            </div>
        );
    }
}

function WithParams(): ReactElement {
    return  (
        <Article2 params={{id: "1", ...useParams()}} />
    )
}

export default WithParams;
