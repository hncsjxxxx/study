import React,{ReactNode,forwardRef,useImperativeHandle,useRef,DOMAttributes,useEffect,useCallback} from 'react';
import cn from 'classnames';
import {getElementStyle,getScrollPane,transformSpmContent,getMobileOS,events} from 'petal-utils';
import createBem from '../Utils/bem';
import {Spmtype} from '../_interface';
import {useEventCallback} from '../hooks';
const bem = createBem('loadMore');

export interface LoadMoreProps {
    className?:string;
    disabled?:boolean;
    initLoad?:boolean;
    hasNext:boolean;
    isFill?:boolean;
    offset?:number;
    tips?:ReactNode[];
    onLoad:() => Promise<any>;
    onLoadEnd?:(success:boolean) => void;
    spm?:SpmType;
    children?:ReactNode;
}

export interface LoadMoreRef{
    loadMoreContent:HTMLDivElement;
    getScrollPane:() => HTMLElement | Window;
    getScrollPaneDOM: () => HTMLElement;
    getClientHeight:() => number;
    getSCrollTop:() => number;
}

function LoadMore(props:LoadMoreProps, ref:React.Ref<LoadMoreRef> ) {
    const {
        className,
        disabled=false,
        initLoad=false,
        tips=['正在加载','已无更多'],

    }=props;
    const loadMore = useRef<HTMLDivElement>(null);
    const loadMoreContent = useRef<HTMLDivElement>(null);
    const loadMoreTips = useRef<HTMLDivElement>(null);
    const scrollPaneDom = useRef<HTMLElement>(null);
    const scrollPane = useRef(null);
    const loading = useRef<boolean>(false);
    const domUpdate = useRef<boolean>(false);
    const initFlag = useRef<boolean>(false);
    const initLoadFlag = useRef<boolean>(false);
    const hasRemoveScrollEvent = useRef<boolean>(true);
    const clientHeight = useRef<number>(0);
    const offsetTop = useRef<number>(offset);

    // 设置滚动容器
    function setScrollPane() {
        if(!scrollPane.current) {
            scrollPane.current = getScrollPane(loadMore.current);
        }
    }

    // 设置滚动容器 元素
    function setScrollPaneDOM() {
        if(!scrollPaneDom.current) {
            setScrollPane();

            if(scrollPane.current === window) {
                scrollPaneDom.current = document.body;

            }else {
                scrollPaneDom.current = scrollPane.current;
            }
        }
    }

    // 滚动容器窗口高度
    function setClientHeight() {
        if(!clientHeight.current){
            setScrollPaneDOM();
            clientHeight.current = scrollPaneDom.current.clientHeight;
        }
    }

    // 给父组件调用
    useImperativeHandle(ref,() => {
        return {
            // children所在的内容区域
            loadmoreContent:loadMoreContent.current,
            //获取滚动容器，用于绑定scroll事件
            getScrollPane:() => {
                setScrollPane();
                return scrollPane.current;
            }
            // 获取滚动容器元素
            getScrollPaneDom:() => {
                setScrollPaneDOM();
                return scrollPaneDom.current;
            },
            // 滚动容易窗口高度
            getClientHeight:() => {
                setClientHeight();
                return clientHeight.currentl
            },
            // 获取滚动距离
            getScrollTop:() => {
                setScrollPaneDOM();
                return scrollPaneDom.current.scrollTop;
            }
        }
    })
    //加载结束的回调
    function loadEnd(success:boolean) {
        loading.current = false;
        if(typeof onLoadEnd === 'function') {
            onLoadEnd(success);

        }
        if(domUpdate.current) {
            fill();
        }
    }

    //加载数据
    const load = useEventCallback(() => {
        if(loading.current) {
            return;
        }
        loading.current = true;
        domUpdate.current =false;
        onload().then(loadEnd.bind(null,true),loadEnd.bind(null,false));
    },[onLoad]);
    //滚动监听事件
    const scroll = useCallback(() => {
        if(loading.current) {
            return;
        }
        const {scrollTop,scrollHeight} = scrollPaneDOM.current;
        if(scrollTop + clientHeight.current + offsetTop.current >= scrollHeight) {
            load();
        }
    },[load]);
    //未满屏加载更多
    function fill() {
        if(loading.current) {
            return;
        }
        if(isFill&&hasNext&&clientHeight.current > getElementStyle(loadMoreContent.current,'height',true)) {
            //防止子组件状态没有更新 onload的state没有更新
            setTimeout(load);
        }
    }

    function init() {
        if(initFlag.current) {
            return;
        }
        setScrollPane();
        setScrollPaneDOM();
        setClientHeight();
        const img = loadMoreTips.current.getElementsByTagName('img')[0];
        //上啦加载的提示信息 如果是图片
        if(img){
            img.onload = () => {
                offsetTop.current = getElementsStyle(loadMoreTips.current, 'height',true) + offset;

            }
        }
        offsetTop.current = getElementStyle(loadMoreTips.current,'height',true) + offset;
        initFlag.current = true;
    }
    useEffect(() => {
        if(loading.current) {
            return;
        }
        if(!disabled) {
            init();
        }
        // 删除或重新绑定scroll监听事件 
        //监听事件已删除
        if(hasRemoveScrollEvent.current) {
            //有更多，需要重新监听
            if(hasNext && !disabled) {
                events.addDOMEvents(scrollPane.current,'scroll',scroll, {
                    passive:true,
                })
                hasRemoveScrollEvent.current = false;
            }
        }else {
            if(!hasNext || disabled) {
                events.removeDOMEvents(scrollPane.current,'scroll',scroll);
                hasRemoveScrollEvent.current = true;
            }
        }
        domUpdate.current = true;
        // wei满屏继续加载
        if(!disabled) {
            if(initLoad && !initLoadFlag.current) {
                initLoadFlag.current = true;
                load();
            }else {
                fill();
            }
        }
    },[children,disabled])

    return (
        <div
        ref={loadMore}
        className={cn(bem(),className)}
        {...transformSpmContent(spm)}
        >
            <div    className={bem('inner',getMobileOS().toLowerCase())}>
                <div ref={loadMoreContet} className={bem('content')}>
                    {children}
                </div>
                {!disabled && (
                    <div ref={loadMoreTips}
                    className={bem('tips')} {...transformSpmContent(tipsSpm)}>
                        {hasNext?tips[0] : tips[1]}
                        </div>
                )}
            </div>
        </div>
    )
}
export default forwardRef<LoadMoreRef,LoadMoreProps>(LoadMore);