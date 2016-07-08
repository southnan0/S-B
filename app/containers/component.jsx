/**
 * 继承React.component，接下来整个项目都将会继承这个类
 */
import React from 'react';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';

@immutableRenderDecorator
class Component extends React.Component {

}

export default Component;