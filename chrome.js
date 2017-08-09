jQuery(document).ready(function() {
	var colf="rgba(255, 170, 199,0.25)",colm="rgba(170,199,255,0.25)";
	var k;
	k=colf.split(",");
	colff=k[0]+","+k[1]+","+k[2]+",0.75)";
	k=colm.split(",");
	colmm=k[0]+","+k[1]+","+k[2]+",0.75)";
	var colFover='#C100C4',colMover='#0003FF';
	var colFfix='#F40041',colMfix='#007FFF';
	var dati;
	var chart;
	var ti;
	
	//jQuery("#chart").append("<span style='font-size:30px'>caricamento dati in corso...</span>");
	
	jQuery.getJSON("nomi.json", function(data) {
		dati=data.items;
		
		var nn=dati.length;
		
		console.log("inizio");
		
		var nomi=[];
		
		var xmax=-99,xmin=99,ymax=-99,ymin=+99;
		for (var i=0;i<nn;i++) {
			if (dati[i].color==1) dati[i].color=colm; else dati[i].color=colf; 
			dati[i].name=dati[i].name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				return letter.toUpperCase();
			});
			for (var j=0;j<dati[i].data.length;j++) {
				if (dati[i].data[j][0]>xmax) xmax=dati[i].data[j][0];
				if (dati[i].data[j][1]>ymax) ymax=dati[i].data[j][1];
				if (dati[i].data[j][0]<xmin) xmin=dati[i].data[j][0];
				if (dati[i].data[j][1]<ymin) ymin=dati[i].data[j][1];
			}		
		}		
		
		console.log(xmax,xmin,ymax,ymin);
		
		for (i=0;i<nn;i++) {
			if (dati[i].name!="*") {
				nomi.push([dati[i].name,i]);
				//						dati[i].color=((dati[i].name.substr(dati[i].name.length-1)=='a') ? colf : colm)
			}
		}
		
		
		
		var datu=[];
		for (i=0;i<nn;i++) {
			var c=(dati[i].color==colf) ? "rgba(244,0,65,0.4)" : "rgba(0,127,255,0.4)"; 
			var j=(dati[i].color==colf) ? 1 : 0;
			//					datu[j].push({x:dati[i].data[dati[i].data.length-1][0],y:dati[i].data[dati[i].data.length-1][1]}); //,marker:{enabled:true,fillColor:c}
			datu.push({
				x:dati[i].data[dati[i].data.length-1][0],
				y:dati[i].data[dati[i].data.length-1][1],
				marker: {
					fillColor: (dati[i].color==colf) ? colff : colmm,
					states: {
						hover: {
							fillColor: (dati[i].color==colf) ? colFover : colMover
						}
					}
				}
			});
		}
		
		dati.push({
			name:'allCircles',color:'#000000',data:datu,lineWidth:0,
			marker:{enabled:true,radius:4,symbol:'circle',lineWidth:0,
				states:{hover:{
					enabled:true,
					lineColor: 'rgba(128,128,128,0.5)',
					lineWidth:10
				}}
			},
			//				enableMouseTracking: false
		});
		
		jQuery('head').append('<style id="addedCSS" type="text/css"></style>');
		
		var exc="none";
		
		nomi.sort(function(a, b){return a[0]>b[0] ? 1 : -1});
		
		jQuery.each(nomi,function(index,value){
			jQuery("#nomi").append(
			"<span class='"+((dati[value[1]].color==colf) ? "female" : "male")+"'>" + value[0] +"</span>"
			);
		});
		
		function scanab() {
			jQuery("#outer a").each(function(index,value) {
				jQuery(this).parent().addClass("disabled");
				
				if (jQuery("#nomi span:not(.disabled):not(."+exc+")").filter(
				function(i,el) {
					return el.innerHTML.charAt(0)==value.innerHTML;
				}
				).length>0) jQuery(this).parent().removeClass("disabled");
			});	
		};
		
		scanab();
		
		jQuery.fn.scrollView = function () {
			return this.each(function () {
				
				var cpanel = jQuery('#nomi'),
				scrollTo = jQuery(this);
				
				// Or you can animate the scrolling:
				cpanel.animate({
					scrollTop: scrollTo.offset().top - cpanel.offset().top + cpanel.scrollTop()
				}, 2000);
				
				//	jQuery('#nomi').animate({
				//      scrollTop: (jQuery(this).offset().top<0) ? stop+jQuery(this).offset().top : jQuery(this).offset().top
				//    }, 1000);
				
				//	stop=jQuery(this).offset().top;
			});
		}
		
		jQuery.fn.hasScrollBar = function() {
			return this.get(0).scrollHeight > this.get(0).clientHeight;
		}
		//				console.log("scroll:"+jQuery("#nomi").hasScrollBar());		
		
		var lsel;
		
		jQuery.fn.outerHTML = function() {
			return jQuery('<div />').append(this.eq(0).clone()).html();
		};
		
		jQuery("#selez").append("<span></span>");
		
		jQuery("#outer li:not(.disabled) a").click(function (event) {
			event.preventDefault();
			var letter=this.innerHTML;
			var foundin = jQuery('#nomi span:not(.'+exc+')')
			.filter(function() { return jQuery(this).text().indexOf(letter) === 0; });
			if (foundin.length>0) {
				console.log(foundin[0].innerHTML);
				jQuery(foundin[0]).scrollView();
			}
		});
		
		
		jQuery("#nomi span").click(function (event) {
			event.preventDefault();
			selNome(jQuery(this),null);
		});
		
		function selNome(el,k) {
			var nome=el.html();
			var rnome=el.text();
			if (k==null) k=jQuery(nomi).filter(function(){return this[0]==rnome})[0][1];
			console.log("selNome "+rnome,k);
			if (el.hasClass("selected")) {
				console.log(rnome+ " dissel",k);
				el.removeClass("selected")
				jQuery("#selez span:last").text("")
				jQuery("#selez span").filter(function(){return  jQuery(this).text() == rnome;}).remove();
				if (jQuery("#selez span").length<2) jQuery("#azzera").addClass("off");
				disevSerie(chart.series[k],true);		
			} 
			else {
				if (jQuery("#selez span").length>5) {
					jQuery("#selez span:last").text("max 5 nomi")
				}
				else {	
					jQuery("#azzera").removeClass("off");
					el.addClass("selected");
					var kp=jQuery("#selez span").filter(function(){return  jQuery(this).html() < nome;}).length-1;
					var n=jQuery(el.outerHTML()).insertBefore(jQuery("#selez").children("span").eq(kp));
					n.html(n.html()+"<b></b>");
					evSerie(chart.series[k],null,true);
				}
			}
		}
		
		function evSerie(el,po,fix) {	
			//console.log(el.index);	
			var u=el.graph.attr("stroke");
			console.log("in",el.name, u);
			if (!(u==colMfix || u==colFfix)) {
				
				var c=(el.color==colm) ? colMover : colFover;
				if (fix) c=(el.color==colm) ? colMfix : colFfix;
				el.graph.attr({stroke: c});
				el.graph.attr({"stroke-width": 3});
			}
			
			//				el.setState("hoverK");
			el.data.forEach(p => {
				p.setState('hover'
				+((po===p) ? '' : (el.color==colm) ? 'M' : 'F')
				+((p.index==el.data.length-1) ? '' : '')
				);
			});
			chart.series[nn].data[el.index].setState("onlyMarker"+((el.color==colm) ? 'M' : 'F')+"K");
		}
		
		var temp;
		function forceWidth(ob) {
			ob.graph.attr({"stroke-width": 3})
		}
		
		function forceState(ob) {
			//ob.graph.attr({"stroke-width": 3})
			console.log("force "+ob.name);
			//chart.series[nn].data[ob.index].setState("onlyMarker"+((ob.color==colm) ? 'M' : 'F'));
		}
		
		function disevSerie(el, force) {
			var u=el.graph.attr("stroke");
			
			console.log("out",el.name, u, "onlyMarker"+((el.color==colm) ? 'M' : 'F'));
			
			//				el.graph.attr({"stroke-width": 3}); 
			if (u!=colMover && u!=colFover && !force) {
				if ((u==colMfix || u==colFfix)) {
					//						temp=el;
					//						setTimeout(jQuery.proxy(forceWidth, el), 0);
					console.log("=>3");
					//						setTimeout(function() {forceWidth(el)},0);
					//						el.graph.attr({"stroke-width": 3});
					//						el.select(true,true);
					el.options.lineWidth=3;
					//						el.lineWidth=3;
//					chart.series[nn].points[el.index].update({marker:{fillColor:(el.color==colm) ? colMover : colFover}});
					setTimeout(function() {
					chart.series[nn].points[el.index].setState("onlyMarker"+((el.color==colm) ? 'M' : 'F')+"K")	
					},0);
					
				}
				//					el.graph.attr({"stroke-width": 3}); 
				return;
			}
			//										console.log(this.series.graph.attr("stroke"));
			//								console.log("out "+this.series.name);
			var c=(el.color==colm) ? colm : colf;
			el.graph.attr({stroke: c});
			el.graph.attr({"stroke-width": 1})
			el.options.lineWidth=1;
			el.data.forEach(p => {
				//p.graph.attr({fill:'#bbbbbb'});
			p.setState();});
			chart.series[nn].points[el.index].setState("onlyMarker"+((el.color==colm) ? 'M' : 'F'));
//			chart.series[nn].points[el.index].update({marker:{fillColor:(el.color==colm) ? colm : colf}});
			//				ti=setTimeout(function() {forceState(el)},0);
			//				console.log("confirmed");
		}
		
		function ridisegnaChart(c) {
			for (var i=0;i<nn;i++){
				if (chart.series[i].color==c) {
					datu[i].x=Math.abs(datu[i].x);
					chart.series[i].setVisible(false,false);
				}
				else {
					datu[i].x=-Math.abs(datu[i].x);
				}
			}
			//				console.log(datu);
			chart.series[nn].setVisible(false,false);
			chart.series[nn].setData(datu,false);
			chart.series[nn].setVisible(true,false);
			//				chart.series[nn].remove(false);
			//				chart.addSeries({
			//					name:'allCircles',color:'#000000',data:datu,lineWidth:0,
			//					marker:{enabled:true,radius:4,fillColor:"rgba(128,128,128,0.5"},
			//					//				enableMouseTracking: false
			//				},false);
			chart.series[nn].data.forEach(p => {
				p.setState('onlyMarker'+((chart.series[p.index].color==colm) ? "M" : "F"));
			});
			
			chart.redraw();
			chart.hideLoading();
		}
		
		jQuery("#cp1.cpanel #sesso label").click(function (event) {
			event.preventDefault();
			if (jQuery(this).hasClass("selected")) return;
			jQuery(this).addClass("selected");
			jQuery(this).siblings("label").each(function(){
				jQuery(this).removeClass("selected");
			});
			chart.showLoading("<span style='font-size:40px;'>elaborazione in corso...</span>");
			azzera();
			if (jQuery(this).attr("id")=="male") exc="female";
			if (jQuery(this).attr("id")=="female") exc="male";
			if (jQuery(this).attr("id")=="both") exc="none";
			jQuery('#addedCSS').text("#nomi ."+exc+" {display:none}");
			scanab();
			//					chart.redraw();
			var c="***";
			if (exc=="male") c=colm;
			if (exc=="female") c=colf;
			setTimeout(function() {ridisegnaChart(c);},0);
		});
		
		function azzera() {
			jQuery.each(jQuery("#selez span:not(:last)"),function(index,value){
				//				console.log(jQuery(value).text());
				selNomeCall(jQuery(value).text());
			});
			jQuery("#azzera").addClass("off");
			
		}
		
		function selNomeCall(rnome) {
			console.log("selNome "+rnome);
			var el=jQuery("#nomi span").filter(function(){return  jQuery(this).text() == rnome;});
			if (!jQuery(el[0]).hasClass("selected")) jQuery(el[0]).scrollView()
			if (el.length>0) selNome(jQuery(el[0]));
		}
		
		jQuery("#azzera").click(function (event) {
			//chart.series[nn+1].setData([]); //.forEach(p => {p.marker.enabled=false;});
			azzera();
		});
		
		
		function drawChart() {
			
			chart=Highcharts.chart('chart', {
				chart: {
					type: 'scatter',
					zoomType: 'xy'
				},
				backgroundColor:'transparent',
				//subtitle: {    text: ''},
				title: {text: ''},
				xAxis: {
					title: {text: 'diffusione',style:{color: "rgba(0,0,0,0.5)"}},
					max:-3,min:-9,
					startOnTick: false,
					endOnTick: false,
					//						showLastLabel: true,
					labels: {
						enabled:true,
						formatter: function() {	return Math.round(Math.exp(this.value)*100000)/1000+"%";}
					},
					tickPositions: [Math.log(0.0001),Math.log(0.00025),Math.log(0.0005),Math.log(0.001),Math.log(0.0025),Math.log(0.005),Math.log(0.001),Math.log(0.0025),Math.log(0.005),Math.log(0.01),Math.log(0.025)],
					plotLines: [{
						color: 'red',
						width: 0,
						value: -9,
						label: {
							text: '> in crescita >',
							verticalAlign: 'top',align:'right',
							x: -10,
							y: 0,
							rotation: -90
						}
						},{
						color: 'red',
						width: 0,
						value: -9,
						label: {
							text: '< in calo <',
							verticalAlign: 'bottom',
							x: -10,
							y: 0,
							rotation: -90
						}
					}
					]
				},
				yAxis: {
					title: {text: 'tendenza',style:{color: "rgba(0,0,0,0.5)"}},
					max:5,min:-5,
					gridLineDashStyle: 'Dot',
					gridLineColor:'rgba(0,0,0,0.25)',
					tickAmount: 0,
					labels: {enabled:false},
					plotLines: [{
						width: 0,
						value: -5,
						label: {
							text: '> più diffusi >',
							align: 'right',
							x: 0,
							y: 36
						}
						},{
						width: 0,
						value: -5,
						label: {
							text: '< meno diffusi <',
							align: 'left',
							x: 0,
							y: 36
						}
						},{
						width: 1,
						value: 0,
						color: 'rgba(0,0,0,0.3)',
					}
					]
					
				},
				legend: {
					enabled:false
				},
				loading: {
					labelStyle: {
						fontSize: "30px",
						top: "45%"
					}
				},
				plotOptions: {
					scatter: {
						states: {
							//								hover:{
							//									halo: {size:10,opacity:0.9}
							//								}
						},
						marker: {
							states: {
								hover: {
									//									enabled:true,
									//										radius:20,
									//									radiusPlus:5,
									//										fillColor: '#0000ff',
									//									lineWidthPlus: 0
								}
							}
						},
					},
					series: {
						lineWidth:1,
						states: {
							//								hover: {
							//									lineWidthPlus: 2,
							//									halo: {size:10,opacity:0.2}
							//								},
							hoverK: {
								lineWidth: 3,
								lineWidthPlus: 3,
							}
						},
						marker: {
							radius: 1,
							symbol:'circle',
							fillColor: 'rgba(196,196,196,0.5)',
							states: {
								hover: {
									enabled:true,
									lineColor: 'rgba(128,128,128,0.25)',
									radius:4,
									symbol:'circle',
									lineWidth:10
								},
								hoverF: {
									enabled:true,
									lineColor: '#ffffff',
									fillColor: colFover,
									radius:3,
									symbol:'circle',
									lineWidth:1
								},
								hoverM: {
									enabled:true,
									lineColor: '#ffffff',
									fillColor: colMover,
									radius:3,
									symbol:'circle',
									lineWidth:1
								},
								hoverK: {
									enabled:true,
									lineColor: 'rgba(128,128,128,0.25)',
									//										fillColor: 'black',
									radius:4,
									symbol:'circle',
									lineWidth:1
								},
								hoverFK: {
									enabled:true,
									lineColor: '#ffffff',
									fillColor: colFover,
									radius:4,
									symbol:'circle',
									lineWidth:1
								},
								hoverMK: {
									enabled:true,
									lineColor: '#ffffff',
									fillColor: colMover,
									radius:4,
									symbol:'circle',
									lineWidth:1
								},
								selectF: {
									enabled:true,
									fillColor: '#aaffaa',
									radius:3,
									symbol:'circle',
									lineWidth:1
								},
								selectM: {
									enabled:true,
									fillColor: '#aaffaa',
									radius:3,
									symbol:'circle',
									lineWidth:1
								},
								onlyMarkerF: {
									enabled:true,
									lineColor: '#888888',
									fillColor: colff,
									radius:4,
									symbol:'circle',
									lineWidth:0
								},
								onlyMarkerM: {
									enabled:true,
									lineColor: '#888888',
									fillColor: colmm,
									radius:4,
									symbol:'circle',
									lineWidth:0
								},
								onlyMarkerFK: {
									enabled:true,
									lineColor: '#888888',
									fillColor: colFover,
									radius:4,
									symbol:'circle',
									lineWidth:0
								},
								onlyMarkerMK: {
									enabled:true,
									lineColor: '#888888',
									fillColor: colMover,
									radius:4,
									symbol:'circle',
									lineWidth:0
								}
								
							}
						},
						
						//stickyTracking: false,
						point: {
							events: {
								mouseOver: function () {
									if (this.series.index==nn) 
									evSerie(chart.series[this.index],this,false)
									else
									evSerie(this.series,this,false);
								},
								mouseOut: function () {
									if (this.series.index==nn) 
									disevSerie(chart.series[this.index],false)
									else
									disevSerie(this.series,false);
								},
								click: function() {
									if (this.series.index==nn) 
									selNomeCall(chart.series[this.index].name)
									else
									selNomeCall(this.series.name);
								}
							}
						}
					}
				},
				tooltip: {
					//followPointer:false,
					shape: 'rect',
					enabled:true,
					formatter: function() {
						if (this.series.index==nn) 
						return "<b>"+chart.series[this.point.index].name+"</b><br/>anno " + (2015) + 
						": " + Math.round(Math.exp(this.point.x)*100000) + " nat"+((chart.series[this.point.index].color==colm) ? "i" : "e")+" su 100.000";
						else
						return "<b>"+this.series.name+"</b><br/>anno " + ((this.point.index-9)+2015) + 
						": " + Math.round(Math.exp(this.point.x)*100000) + " nat"+((this.series.color==colm) ? "i" : "e")+" su 100.000";
					},
					positioner: function (labelWidth, labelHeight, point) {
						var tooltipX, tooltipY;
						if (point.plotX + chart.plotLeft < labelWidth && point.plotY + labelHeight > chart.plotHeight) {
							tooltipX = chart.plotLeft;
							tooltipY = chart.plotTop + chart.plotHeight - 2 * labelHeight - 10;
						} 
						else {
							tooltipX = chart.plotLeft;
							tooltipY = chart.plotTop + chart.plotHeight - labelHeight;
						}
						return {
							x: tooltipX,
							y: tooltipY
						};
					}
				},
				series: [] //dati
			});
			
			chart.showLoading("<span>elaborazione in corso...</span>");
			setTimeout(addSeries, 0);
			//				addSeries();
			//				chart.series=dati;
			
			jQuery("#nomi span").hover(
			function (event) {
				event.preventDefault();
				var rnome=jQuery(this).text();
				var k=jQuery(nomi).filter(function(){return this[0]==rnome})[0][1];
				evSerie(chart.series[k],null,false);
			},
			function(event) {
				event.preventDefault();
				var rnome=jQuery(this).text();
				var k=jQuery(nomi).filter(function(){return this[0]==rnome})[0][1];
				disevSerie(chart.series[k]);
				//				chart.series[chart.series.length-1].setVisible(false,false);
			}
			);
			
			jQuery("#selez").on("mouseover","span:not(:last)",function (event) {
				console.log("in");
				event.preventDefault();
				var rnome=jQuery(this).text();
				console.log(rnome);
				var k=jQuery(nomi).filter(function(){return this[0]==rnome});
				if (k.length>0) {
					k=k[0][1];
					if (k>=0) evSerie(chart.series[k],false)
					else console.log(k);
				}
			});
			
			jQuery("#selez").on("mouseout","span:not(:last)",function (event) {
				console.log("out");
				event.preventDefault();
				var rnome=jQuery(this).text();
				console.log(rnome);
				var k=jQuery(nomi).filter(function(){return this[0]==rnome});
				if (k.length>0) {
					k=k[0][1];
					if (k>=0) disevSerie(chart.series[k],false)
					else console.log(k);
				}
			});
			
			jQuery("#selez").on("click","span b",function (event) {
				console.log("selez click");
				event.preventDefault();
				var rnome=jQuery(this).parent().text();
				jQuery("#nomi span").filter(function(){return  jQuery(this).text() == rnome;}).removeClass("selected");
				jQuery(this).parent().remove();
				jQuery("#selez span:last").text("")
				if (jQuery("#selez span").length<2) jQuery("#azzera").addClass("off");
				
				var k=jQuery(nomi).filter(function(){return this[0]==rnome});
				if (k.length>0) {
					k=k[0][1];
					if (k>=0) disevSerie(chart.series[k],true)
					else console.log(k);
				}
			});
			
		};
		
		setTimeout(drawChart,0);
		
		function addSeries() {
			for (var i=0;i<nn+1;i++) {
				chart.addSeries(dati[i],false);
			}
			
			console.log("finito");
			chart.redraw();
			chart.series[nn].data.forEach(p => {
				//					p.setState('onlyMarker'+((chart.series[p.index].color==colm) ? "M" : "F"));
			});
			
			//				chart.update({series: dati});
			chart.hideLoading();
		}
		
		
		jQuery(window).resize(function() {
			chart.redraw(false);
		});				
		
	});
	
});
