import React from 'react';
import {Button} from 'antd';

export const Editor = React.createClass({
    // 编辑器样式
    style: {
        width: '100%',
        height: '200px'
    },
    getDefaultProps(){
        let num = parseInt((Math.random() * 100000), 10);
        return {
            id: 'editor' + num
        }
    },
    componentDidMount: function () {
        let {id, content} = this.props;
        require.ensure([], require => {
            const wangEditor = require('wangeditor');
            this.editor = new wangEditor(id);
            this.editor.config.uploadImgUrl = '/upload';
            this.editor.config.menus = [
                'bold',
                'underline',
                'strikethrough',
                'eraser',
                'bgcolor',
                'quote',
                'fontfamily',
                'fontsize',
                'img'
            ];
            this.editor.create();
            this.editor.$txt.html(content);
        });
    },
    getContent: function (e) {
        e.preventDefault();
        var content = this.editor.$txt.html();
        let state = this.props.handleSend(content);
        if (state) {
            this.editor.$txt.html(this.props.content);
        }
    },
    handleKeyDown(e) {
        if (e.keyCode === 13 && e.ctrlKey) {
            this.getContent(e);
        }
    },
    render: function () {
        return (
            <div onKeyDown={this.handleKeyDown}>
                <div id={this.props.id} style={this.style} contentEditable="true"></div>
                <Button className="send-btn" type="button"
                        onClick={this.getContent}> （ctrl+enter）发送 </Button>
            </div>
        );
    }
});
