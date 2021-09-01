import React,{CSSProperties,ReactNode,forwardRef,useImperativeHandle,useRef,DOMAttributes} from 'react';
import cn from 'classnames';
import {transformSpmContent} from 'petal-utils';
import createBem from '../Utils/bem';
import {Spmtype} from '../_interface';

//样式没写
export interface ButtonProps extends DOMAttributes<HTMLButtonElement> {
    type?:'primary' | 'default' | 'info' | 'health' | 'danger';
    size?:'sm' | 'md' | 'lg';
    htmlType?: 'button' | 'submit' | 'reset'
    block?:boolean;
    round?:boolean;
    disabled?:boolean;
    ghost?:boolean;
    icon?:ReactNode;
    className?:string;
    style?:CSSProperties;
    onClick?():any;
    spm?:SpmType;
    children?:ReactNode;
}

export interface ButtonRef {
    elem:HTMLButtonElement;
}

const bem = createBem('button');

export function Button(
    {
        type='primary',
        className,
        size='md',
        disabled=false,
        block=false,
        icon,
        round=false,
        htmlType='button',
        style,
        onClick,
        children,
        spm,
        ...others

    }:ButtonProps
){
    const elem = useRef(null);

    //给父组件调用
    useImperativeHandle(ref, () => {
        return {
            elem: elem.current,
        }
    });
    
    const modifiers = {
        [type]: true,
        ghost,
        block,
        disabled,
        round,
        sm: size === 'sm',
        lg: size === 'lg'
    }

    if(icon && React.isValidElement(icon)) {
        icon = React.cloneElement(icon, {className: cn(bem('icon'), icon.props.className)})
    }

    return (
        <button
        {...others}
        ref={elem}
        {...transformSpmContent(spm)}
        className={bem(modifiers, className)}
        type={htmlType}
        aria-disabled={disabled}
        {...{style,disabled,onclick:disabled ? void 0 : onClick}}
        >
            <div className={bem('content')}>
                {icon}
                {children}
            </div>
        </button>
    )
}

export default forwardRef<ButtonRef,ButtonProps>(Button);