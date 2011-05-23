// kiwoticum
// Created 2011 by wolfger@spearwolf.de

window.kiwoticum = window.kiwoticum||{};

// custom_event/custom_event.js
window.Cevent=(function(){function logError(){if(typeof console!=="undefined"){console.error.apply(window,arguments)}}var nextCallId=1;function EventNode(name,parentNode){this.name=name;this.parentNode=parentNode;this.children=[];this.greedyChildren=[];this.insatiableChildren=[];this.callbacks=[]}var rootNode=new EventNode();EventNode.prototype.fullPathName=function(){return(typeof this.name==="undefined")?Cevent.pathSeparator:this._fullPathName()};EventNode.prototype._fullPathName=function(){return(typeof this.name==="undefined")?"":this.parentNode._fullPathName()+Cevent.pathSeparator+this.name};EventNode.prototype.addChild=function(name){var node=new EventNode(name,this);if(name===Cevent.greedyChar){this.greedyChildren.push(node)}else{if(name===Cevent.insatiableSequence){this.insatiableChildren.push(node)}else{this.children.push(node)}}return node};EventNode.prototype.splitPath=function(path){var all_names=path.split(Cevent.pathSeparator),name=null;while(name===null||name.length===0){name=all_names.shift()}if(name===Cevent.insatiableSequence){return[name,""]}var rest=[];for(var i=0;i<all_names.length;i++){rest.push(all_names[i]);if(all_names[i]===Cevent.insatiableSequence){break}}return[name,rest.length===0?"":rest.join(Cevent.pathSeparator)]};EventNode.prototype.matchNodes=function(path,fn){var split_path=this.splitPath(path),name=split_path[0],rest=split_path[1],child,i;if(rest.length>0){for(i=0;i<this.children.length;i++){child=this.children[i];if(name===Cevent.greedyChar||name===child.name){child.matchNodes(rest,fn)}}for(i=0;i<this.greedyChildren.length;i++){this.greedyChildren[i].matchNodes(rest,fn)}}else{for(i=0;i<this.children.length;i++){child=this.children[i];if(name===Cevent.greedyChar||name===child.name){fn(child)}}for(i=0;i<this.greedyChildren.length;i++){fn(this.greedyChildren[i])}}for(i=0;i<this.insatiableChildren.length;i++){fn(this.insatiableChildren[i])}};EventNode.prototype.findOrCreateNode=function(path){var split_path=this.splitPath(path),name=split_path[0],rest=split_path[1];var findChild=(function(self){return function(childName){var i,child;for(i=0;i<self.children.length;i++){child=self.children[i];if(childName===child.name){return child}}for(i=0;i<self.greedyChildren.length;i++){child=self.greedyChildren[i];if(childName===child.name){return child}}return null}})(this);var node=findChild(name);if(node===null){node=this.addChild(name)}if(rest.length>0){return node.findOrCreateNode(rest)}else{return node}};EventNode.prototype.addCallback=function(callbackFn,options){var callback={id:nextCallId++,fn:callbackFn};if(typeof options==="object"){callback.once=!!options.once}this.callbacks.push(callback);return callback};EventNode.prototype.destroyCallbacks=function(ids){var updated_callbacks=[],i,j,skip,count=0;for(i=0;i<this.callbacks.length;i++){skip=false;for(j=0;j<ids.length;j++){if(this.callbacks[i].id==ids[j]){skip=true;++count;break}}if(!skip){updated_callbacks.push(this.callbacks[i])}}this.callbacks=updated_callbacks;return count};function registerEventListener(eventPath,callbackFn,options){return rootNode.findOrCreateNode(eventPath).addCallback(callbackFn,options||{}).id}function registerEventListenerOnce(eventPath,callbackFn){return registerEventListener(eventPath,callbackFn,{once:true})}function fireEvent(eventName,fn){var args=[],results=[],i;for(i=1;i<arguments.length;i++){args.push(arguments[i])}rootNode.matchNodes(eventName,function(node){try{var destroy_callback_ids=[],unbind=function(id){return function(){destroy_callback_ids.push(id)}},result,callback;for(i=0;i<node.callbacks.length;i++){callback=node.callbacks[i];result=callback.fn.apply({name:eventName,unbind:unbind(callback.id)},args);if(callback.once){destroy_callback_ids.push(callback.id)}if(result!==null&&typeof result!=="undefined"){results.push(result)}}node.destroyCallbacks(destroy_callback_ids)}catch(error){logError(error)}});if(typeof fn==="function"&&results.length>0){fn.apply(window,results)}}function unbind(pathOrId,node){node=node||rootNode;if(typeof pathOrId==="number"){if(node.destroyCallbacks([pathOrId])>0){return true}else{var i;for(i=0;i<node.children.length;i++){if(unbind(pathOrId,node.children[i])){return true}}for(i=0;i<node.greedyChildren.length;i++){if(unbind(pathOrId,node.greedyChildren[i])){return true}}for(i=0;i<node.insatiableChildren.length;i++){if(unbind(pathOrId,node.insatiableChildren[i])){return true}}return false}}}return{on:registerEventListener,once:registerEventListenerOnce,emit:fireEvent,unbind:unbind,pathSeparator:"/",greedyChar:"*",insatiableSequence:"**",rootNode:rootNode}})();

// kiwoticum/svg_renderer.js
kiwoticum.SvgRenderer=function(canvasContainer,builder){var api={},paper=Raphael(canvasContainer,builder.getCanvasWidth(),builder.getCanvasHeight());function createSvgPath(coords){return _.reduce(coords,function(path,v){return path+(path===""?"M":" L")+(Math.round(v[0]*100)/100)+" "+(Math.round(v[1]*100)/100)},"")+" z"}var baseHexSvgPath=createSvgPath(builder.baseHexCoords);function emitObj(eventName,eventObj){return function(){Cevent.emit(eventName,eventObj)}}api.drawHexagon=function(hexagon,fillColor){var hex=paper.path(baseHexSvgPath);hex.attr("fill",fillColor);hex.attr("stroke",builder.config.hexagonStroke);hex.translate(hexagon.left,hexagon.top);hex.click(emitObj("kiwoticum/battlefield/hexagon/click",hexagon));return hex};api.drawCountry=function(country){var countrySvgPath=paper.path(createSvgPath(country.createShapePath()));countrySvgPath.attr("fill",country.data.color);countrySvgPath.attr("stroke-width","1");countrySvgPath.attr("stroke","#000000");var inlineSvgPath=paper.path(createSvgPath(country.data.inlineShapePath));inlineSvgPath.attr("fill","rgba(0, 0, 0, 0.4)");inlineSvgPath.attr("stroke-width","0");inlineSvgPath.click(emitObj("kiwoticum/battlefield/country/click",country))};return api};

// kiwoticum/country_map_builder.js
kiwoticum.CountryMapBuilder=function(container,options){var api={},conf=api.config=_.extend({width:10,height:10,hexagonWidth:20,hexagonHeight:20,startAtAngle:90,paddingX:4,paddingY:4,hexagonFill:"#79b",hexagonFill2:"#68a",hexagonStroke:"#024",gridWidth:4,gridHeight:4,hexagonExtension:null,countryExtension:null,createCountries:null},options);api.getWidth=function(){return conf.width};api.getHeight=function(){return conf.height};api.createHexagonCoords=function(width,height,inlineOffset){inlineOffset=inlineOffset!==undefined?inlineOffset:0;var mx=width/2,my=height/2,lx=mx-inlineOffset-1,ly=my-inlineOffset-1;return _.map([0,1,2,3,4,5],function(n){var r=(n*(360/6)+conf.startAtAngle)*(Math.PI/180);if(inlineOffset===0){return[Math.round(Math.sin(r)*lx+mx),Math.round(Math.cos(r)*ly+my)]}else{return[Math.sin(r)*lx+mx,Math.cos(r)*ly+my]}})};var baseHexCoords=api.baseHexCoords=api.createHexagonCoords(conf.hexagonWidth,conf.hexagonHeight),inlineHexCoords=api.createHexagonCoords(conf.hexagonWidth,conf.hexagonHeight,conf.hexagonInlineOffset),stepX=baseHexCoords[5][0]-baseHexCoords[3][0],stepY=baseHexCoords[5][1]-baseHexCoords[1][1],stepY1=baseHexCoords[0][1]-baseHexCoords[1][1],canvasWidth=((conf.width-1)*stepX)+((conf.width-1)*conf.paddingX)+conf.hexagonWidth,canvasHeight=((conf.height-1)*stepY)+((conf.height-1)*conf.paddingY)+conf.hexagonHeight+stepY1;api.getCanvasWidth=function(){return canvasWidth};api.getCanvasHeight=function(){return canvasHeight};function extendObject(obj,extension){if(typeof extension==="object"){return _.extend(obj,extension)}else{if(typeof extension==="function"){return _.extend(obj,new extension(obj))}}return obj}function createHexagon(x,y,positionLeft,positionTop){var hex={type:"Hexagon",x:x,y:y,top:positionTop,left:positionLeft,getVertexCoords:function(i){return[baseHexCoords[i][0]+this.left,baseHexCoords[i][1]+this.top]},getInlineVertexCoords:function(i){return[inlineHexCoords[i][0]+this.left,inlineHexCoords[i][1]+this.top]},elem:null,country:null,data:{},neighbor:{north:null,south:null,northWest:null,southWest:null,northEast:null,southEast:null},builder:api};return extendObject(hex,conf.hexagonExtension)}var hexagonModel=(function(){var col=[],row,y,x,pixelX,pixelY,hexagon;for(y=0;y<conf.height;y++){row=[];for(x=0;x<conf.width;x++){pixelX=x*stepX+x*conf.paddingX;pixelY=y*stepY+y*conf.paddingY;if(x%2===1){pixelY+=stepY1}row.push(createHexagon(x,y,pixelX,pixelY))}col.push(row)}var yOffset,_y;for(y=0;y<conf.height;y++){for(x=0;x<conf.width;x++){yOffset=x%2;_y=y+yOffset;hexagon=col[y][x];if(x>0){if(_y<conf.height){hexagon.neighbor.southWest=col[_y][x-1]}if(_y>0){hexagon.neighbor.northWest=col[_y-1][x-1]}}if(y>0){hexagon.neighbor.north=col[y-1][x]}if(y<conf.height-1){hexagon.neighbor.south=col[y+1][x]}if(x<conf.width-1){if(_y>0){hexagon.neighbor.northEast=col[_y-1][x+1]}if(_y<conf.height){hexagon.neighbor.southEast=col[_y][x+1]}}}}return col})();api.getHexagon=function(v){return(v[0]>=0&&v[0]<conf.width&&v[1]>=0&&v[1]<conf.height)?hexagonModel[v[1]][v[0]]:null};api.drawGroundHexagons=function(showHexagonFn){var y,x,hexagon,evenX,evenY,fillColor,showHexagon;for(y=0;y<conf.height;y++){for(x=0;x<conf.width;x++){hexagon=api.getHexagon([x,y]);if(!_.isFunction(showHexagonFn)||showHexagonFn(hexagon)){if(_.isUndefined(hexagon.data.color)&&hexagon.country===null){evenX=(Math.floor(x/conf.gridWidth)%2)===1;evenY=(Math.floor(y/conf.gridHeight)%2)===1;fillColor=(evenY?evenX:!evenX)?conf.hexagonFill:conf.hexagonFill2}else{fillColor=hexagon.country!==null?hexagon.country.data.color:hexagon.data.color}hexagon.elem=api.renderer.drawHexagon(hexagon,fillColor)}}}};function Country(id){this.type="Country";this.id=id;this.hexagons=[];this.neighbors=[];this.data={};this.builder=api}Country.prototype.unassignHexagon=function(hexagon){var i;if(hexagon&&(i=_.indexOf(this.hexagons,hexagon))>=0){this.hexagons.splice(i,1);hexagon.country=null}return this};Country.prototype.assignHexagon=function(hexagon){if(hexagon&&hexagon.country!=this){if(hexagon.country!==null){hexagon.country.unassignHexagon(hexagon)}hexagon.country=this;this.hexagons.push(hexagon)}return this};Country.prototype.assignHexagons=function(coords){var i,hexagon;for(i=0;i<coords.length;i++){hexagon=this.builder.getHexagon(coords[i]);if(hexagon){this.assignHexagon(hexagon)}}return this};Country.prototype.addNeighbor=function(country){if(country&&_.indexOf(this.neighbors,country)<0){this.neighbors.push(country)}return this};Country.prototype.nonUniqueCountryLessNeighborHexagons=function(){var neighbors=[];_.each(this.hexagons,function(hexagon){if(hexagon.neighbor.north!==null&&hexagon.neighbor.north.country===null){neighbors.push(hexagon.neighbor.north)}if(hexagon.neighbor.south!==null&&hexagon.neighbor.south.country===null){neighbors.push(hexagon.neighbor.south)}if(hexagon.neighbor.northWest!==null&&hexagon.neighbor.northWest.country===null){neighbors.push(hexagon.neighbor.northWest)}if(hexagon.neighbor.southWest!==null&&hexagon.neighbor.southWest.country===null){neighbors.push(hexagon.neighbor.southWest)}if(hexagon.neighbor.northEast!==null&&hexagon.neighbor.northEast.country===null){neighbors.push(hexagon.neighbor.northEast)}if(hexagon.neighbor.southEast!==null&&hexagon.neighbor.southEast.country===null){neighbors.push(hexagon.neighbor.southEast)}});return neighbors};Country.prototype.uniqueCountryLessNeighborHexagons=function(){return _.uniq(this.nonUniqueCountryLessNeighborHexagons())};Country.prototype.shapeHexagons=function(){var self=this;return _.select(this.hexagons,function(hexagon){return hexagon.neighbor.north===null||hexagon.neighbor.north.country===null||hexagon.neighbor.north.country!==self||hexagon.neighbor.south===null||hexagon.neighbor.south.country===null||hexagon.neighbor.south.country!==self||hexagon.neighbor.northWest===null||hexagon.neighbor.northWest.country===null||hexagon.neighbor.northWest.country!==self||hexagon.neighbor.southWest===null||hexagon.neighbor.southWest.country===null||hexagon.neighbor.southWest.country!==self||hexagon.neighbor.northEast===null||hexagon.neighbor.northEast.country===null||hexagon.neighbor.northEast.country!==self||hexagon.neighbor.southEast===null||hexagon.neighbor.southEast.country===null||hexagon.neighbor.southEast.country!==self})};Country.prototype.firstShapeHexagon=function(){var i,hexagon;for(i=0;i<this.hexagons.length;i++){hexagon=this.hexagons[i];if(hexagon.neighbor.north===null||hexagon.neighbor.north.country===null||hexagon.neighbor.north.country!==this||hexagon.neighbor.south===null||hexagon.neighbor.south.country===null||hexagon.neighbor.south.country!==this||hexagon.neighbor.northWest===null||hexagon.neighbor.northWest.country===null||hexagon.neighbor.northWest.country!==this||hexagon.neighbor.southWest===null||hexagon.neighbor.southWest.country===null||hexagon.neighbor.southWest.country!==this||hexagon.neighbor.northEast===null||hexagon.neighbor.northEast.country===null||hexagon.neighbor.northEast.country!==this||hexagon.neighbor.southEast===null||hexagon.neighbor.southEast.country===null||hexagon.neighbor.southEast.country!==this){return hexagon}}};Country.prototype.nextShapeHexagonEdge=function(hexagon,startAtEdge){var i,neighbor=[hexagon.neighbor.northEast,hexagon.neighbor.north,hexagon.neighbor.northWest,hexagon.neighbor.southWest,hexagon.neighbor.south,hexagon.neighbor.southEast];if(typeof startAtEdge!=="number"){for(i=0;i<6;++i){if(neighbor[i]===null||neighbor[i].country!==hexagon.country){break}}if(i!==6){startAtEdge=i}else{return false}}if(typeof hexagon.data.visitedEdges!=="object"){hexagon.data.visitedEdges=[false,false,false,false,false,false]}var visitedEdges=hexagon.data.visitedEdges;if(typeof hexagon.country.data.shapePath!=="object"){hexagon.country.data.shapePath=[];hexagon.country.data.inlineShapePath=[]}var shapePath=hexagon.country.data.shapePath,inlineShapePath=hexagon.country.data.inlineShapePath;var edge;for(i=0;i<6;++i){edge=(startAtEdge+i)%6;if(visitedEdges[edge]){return false}visitedEdges[edge]=true;if(neighbor[edge]===null||neighbor[edge].country!==hexagon.country){break}}if(i===6){return false}var prevEdge=edge;do{shapePath.push(hexagon.getVertexCoords(edge));inlineShapePath.push(hexagon.getInlineVertexCoords(edge));visitedEdges[edge]=true;edge=(edge+1)%6}while(!visitedEdges[edge]&&(neighbor[edge]===null||neighbor[edge].country!==hexagon.country));if(edge===startAtEdge||visitedEdges[edge]){return false}if(prevEdge!==edge){inlineShapePath.push(hexagon.getInlineVertexCoords(edge))}return{hexagon:neighbor[edge],edge:[4,5,0,1,2,3][edge]}};Country.prototype.createShapePath=function(){var next=this.nextShapeHexagonEdge(this.firstShapeHexagon());while(!!next){next=this.nextShapeHexagonEdge(next.hexagon,next.edge)}return this.data.shapePath};api.countries=[];api.createCountry=function(){var country=extendObject(new Country(api.countries.length),conf.countryExtension);api.countries.push(country);return country};api.getCountry=function(id){return api.countries[id]};api.createCountries=function(){if(_.isFunction(conf.createCountries)){try{conf.createCountries(api,conf)}catch(ex){console.error("createCountries() Error:",ex)}}};api.drawAll=function(){if(_.isFunction(conf.drawAll)){conf.drawAll(api,conf)}else{api.drawGroundHexagons()}};api.renderer=kiwoticum.SvgRenderer(container,api);return api};

// kiwoticum/form_builder.js
(function($){kiwoticum.FormBuilder=function(container,options){var optionElements=[];function build_form_elements(root,opts){var $container=_.isString(root)?$("#"+root):root;if("legend" in opts){var $el=$("<fieldset>");if("cssClass" in opts){$el.addClass(opts.cssClass)}$container.append($el);$container=$el;$container.append($("<legend>").html(opts.legend));_.each(opts.inputs,function(item){var $input=null,$label=null,$p=null;if("label" in item){$label=$("<label>").attr("for",item.name).html(item.label)}switch(item.type){case"text":$input=$("<input>").attr("id",options.idPrefix+item.name).attr("type","text").attr("name",item.name).attr("size","11").attr("value",item.value);optionElements.push($input);break;case"number":$input=$("<input>").attr("id",options.idPrefix+item.name).attr("type","number").attr("name",item.name).attr("min",item.min).attr("max",item.max).attr("size","6").attr("value",item.value);optionElements.push($input);break;case"select-country-algorithms":$input=$("<select>").attr("id",options.idPrefix+item.name).attr("name",item.name).attr("size","1");var first=true;_.each(item.countryAlgorithms,function(algorithm){var $opt=$("<option>").html(algorithm.name);if(first){$opt.attr("selected","selected");first=false}$input.append($opt)});optionElements.push($input);build_form_elements(root,item.countryAlgorithms[0].form);break;case"br":$input=$("<p>").addClass("br");break;case"title":$input=$("<h5>").html(item.text);break;case"fieldset":build_form_elements(root,item);break;default:}if(item.type!="title"){$p=$("<p>");if($label){$p.append($label)}if($input){$p.append($input);$input.data("itemDescription",item)}if($label||$input){$container.append($p)}}else{$container.append($input)}})}return $container}var $container=build_form_elements(container,options.form).parent();$container.submit(function(event){var builderOptions={};_.each(optionElements,function(oe){var item=oe.data("itemDescription");if(item.type==="select-country-algorithms"){_.extend(builderOptions,item.countryAlgorithms[0].builder_options)}else{builderOptions[item.name]=item.type==="number"?parseInt(oe.val(),10):oe.val()}});Cevent.emit(options.fireSubmitEvent,builderOptions);event.stopPropagation();return false});$container.append($("<p>").addClass("actions").append($("<input>").attr("type","submit").attr("value","Start!").addClass("uniformjsBtn")));return{destroy:function(){$container.empty().html("")}}}})(jQuery);

// kiwoticum/app.js
(function($){kiwoticum.App=function(){function centerLoadingAnimation(){var $loadImg=$(".load-display > img"),imgWidth=$loadImg.width(),imgHeight=$loadImg.height(),imgTop,imgLeft;if(_.isNumber(window.innerHeight)&&_.isNumber(window.pageYOffset)){imgTop=window.innerHeight/2+window.pageYOffset-imgHeight;imgLeft=window.innerWidth/2+window.pageXOffset-imgWidth/2}else{imgTop=$(window).height()/2-imgHeight;imgLeft=$(window).width()/2-imgWidth/2}$loadImg.css({top:Math.round(imgTop),left:Math.round(imgLeft)})}function toggleLoading(){var LOADING_CLASS="loading",$body=$("body");if(!$body.hasClass(LOADING_CLASS)){centerLoadingAnimation()}$body.toggleClass(LOADING_CLASS)}function calculatePlaygroundLayout(moreInfo){if(window.screen.availWidth<=1024){$("#battlefield").css({width:$(window).width(),height:$(window).height()})}$("#status-bar").html('<p class="info">'+$(window).width()+"x"+$(window).height()+" "+moreInfo+"</p>")}Cevent.on("kiwoticum/country_map_builder/form",function(){Cevent.emit("kiwoticum/country_map_builder/register/algorithm",function(){var countryAlgorithms=_.select(arguments,function(algorithm){return(typeof algorithm==="object")&&_.isString(algorithm.name)});_.each(countryAlgorithms,function(algorithm){console.info("registered country algorithm:",algorithm.name)});kiwoticum.App.formBuilder=kiwoticum.FormBuilder("country-map-builder-form",{idPrefix:"cmbf_",fireSubmitEvent:"kiwoticum/country_map_builder/start",form:{legend:"Country Map Builder",cssClass:"cmb-general",inputs:[{type:"title",text:"Hexagon Definition"},{type:"number",name:"hexagonWidth",value:18,min:5,max:99,label:"pixel-width"},{type:"number",name:"hexagonHeight",value:18,min:5,max:99,label:"pixel-height"},{type:"number",name:"hexagonInlineOffset",value:4,min:0,max:99,label:"inline-offset"},{type:"br"},{type:"number",name:"paddingX",value:0,min:0,max:99,label:"padding-x"},{type:"number",name:"paddingY",value:0,min:0,max:99,label:"padding-y"},{type:"br"},{type:"number",name:"startAtAngle",value:90,min:0,max:359,label:"start-at-angle"},{type:"br"},{type:"text",name:"hexagonFill",value:"rgba(128, 128, 128, 0.5)",label:"even-fill-color"},{type:"text",name:"hexagonFill2",value:"rgba(128, 128, 128, 0.25)",label:"odd-fill-color"},{type:"text",name:"hexagonStroke",value:"#333",label:"stroke-color"},{type:"title",text:"Map/Grid Definition"},{type:"number",name:"width",value:100,min:10,max:9999,label:"width"},{type:"number",name:"height",value:100,min:10,max:9999,label:"height"},{type:"number",name:"gridWidth",value:5,min:1,max:99,label:"grid-width"},{type:"number",name:"gridHeight",value:5,min:1,max:99,label:"grid-height"},{type:"fieldset",legend:"Country Algorithm",cssClass:"cmb-select-algorithm",inputs:[{type:"select-country-algorithms",name:"countryAlgorithm",label:"country-algorithm",countryAlgorithms:countryAlgorithms}]}]}})})});Cevent.on("kiwoticum/country_map_builder/start",function(builderOptions){toggleLoading();console.info("builderOptions",builderOptions);kiwoticum.countryMapBuilder=kiwoticum.CountryMapBuilder("scrollable-canvas",builderOptions);setTimeout(function(){var t=new Date();kiwoticum.countryMapBuilder.createCountries();window.benchmarkCreateCountries=new Date()-t;console.log("createCountries: "+benchmarkCreateCountries+"ms");Cevent.emit("kiwoticum/show/battlefield")},1000)});Cevent.on("kiwoticum/show/battlefield",function(){var t=new Date();kiwoticum.countryMapBuilder.drawAll();var benchmarkDrawAll=new Date()-t;console.log("drawAll: "+benchmarkDrawAll+"ms");var moreInfo="&mdash; "+benchmarkCreateCountries+"ms / "+benchmarkDrawAll+"ms";calculatePlaygroundLayout(moreInfo);$("body").removeClass("loading").addClass("playing").bind("orientationchange",function(){calculatePlaygroundLayout(moreInfo)});$("#scrollable-canvas").css({width:kiwoticum.countryMapBuilder.getCanvasWidth()+100,height:kiwoticum.countryMapBuilder.getCanvasHeight()+60});window.iScroll=new iScroll("battlefield",{hScroll:true,vScroll:true,lockDirection:false,zoom:true});iScroll.scrollTo(50,50,200,true)})};$(function(){kiwoticum.App();Cevent.emit("kiwoticum/country_map_builder/form")})})(jQuery);

