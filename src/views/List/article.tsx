import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card} from "antd";

// @ts-ignore
import styles from './style.module.css'

interface Props {
    author: string,
    title: string,
    brief: string,
    time: string,
}
interface State {
}
class Article extends Component<Props, State> {
    render() {
        return (
            <div className={`${styles['article']}`}>
                <div className={`${styles['author']}`}>{this.props.author}</div>
                <h6 className={`${styles['title']}`}>{this.props.title}</h6>
                <div className={`${styles['brief']}`}>{this.props.brief}</div>
                <div className={`${styles['time']}`}>{this.props.time}</div>
            </div>
        );
    }
}

export default Article;
