import React, {Component} from 'react';

import './article'

// @ts-ignore
import styles from './style.module.css';
import ArticleList from "./articleList";
import {getCategories} from "../../fake-api";

export type tabsType = ({
    category_id: number;
    category_name: string;
    children?: (undefined |
        {
            category_id: number;
            category_name: string;
        }[]);
})[]

interface Props {

}
interface State {
    tabsId: number,
    categoryId: number,
    tabs: tabsType,
    sort: string,
}

class Index extends Component<Props, State> {

    constructor(prop: Props) {
        super(prop);
        // console.log("constructor");
        this.state = {
            tabsId: 0,
            categoryId: 0,
            tabs: [],
            sort: 'hot',
        };
        getCategories().then(res => {
            this.setState({tabs: res.data.categories})
        })
        const lastHome = sessionStorage.getItem("lastHome")
        if (lastHome != null) {
            this.state = JSON.parse(lastHome);
        }
    }

    componentWillUnmount() {
        // console.log("IndexUnMount");
        sessionStorage.setItem("lastHome", JSON.stringify(this.state));
    }

    render() {

        const tab1Constructor = () => {
            const tabs1 = this.state.tabs.map(tab => (
                <div key={Math.random()} onClick={() => this.setState({
                    tabsId: tab.category_id,
                    categoryId: tab.category_id
                })}
                     className={`${styles['tab1']}`}>{tab.category_name}</div>
            ));
            return (
                <div className={`${styles['tabBox1']}`}>{tabs1}</div>
            )
        }

        const tab2Constructor = () => {
            if (this.state.tabsId) {
                const tabs2 = this.state.tabs[this.state.tabsId].children?.map(tab => (
                    <div key={Math.random()} onClick={() => this.setState({categoryId: tab.category_id})} className={`${styles['tab2']}`}>{tab.category_name}</div>
                ));
                return (
                    <div className={`${styles['tabBox2']}`}>{tabs2}</div>
                )
            }
        }

        return (
            <div className={`${styles['page-home']}`}>

                {tab1Constructor()}
                {tab2Constructor()}

                <div className={`${styles['page-article']}`}>
                    <div className={`${styles['tabBox-sort']}`}>
                        <div onClick={() => {this.setState({sort: 'hot'})}} className={`${styles['tab-sort']}`}>热门</div>
                        <div onClick={() => {this.setState({sort: 'new'})}} className={`${styles['tab-sort']}`}>最新</div>
                        <div onClick={() => {this.setState({sort: 'history'})}} className={`${styles['tab-sort']}`}>历史</div>
                    </div>
                    {<ArticleList categoryId={this.state.categoryId} sortBy={this.state.sort}/>}
                    <div className={`${styles["onload"]}`} id={"onload"}>没有更多评论了哦</div>
                </div>
            </div>
        );
    }
}

export default Index;
