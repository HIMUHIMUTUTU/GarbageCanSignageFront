/** socket action **/

/** client canvas file **/
/* Variables definition */
var frame_x = 10;
var frame_y = 50;
var frame_w = 500
var frame_h = 740;
var gframe_x = 600;
var gframe_y = 0;
var gframe_w = 400;
var gframe_h = 800;

var signagepath = "./signage/";
//var signagepath = "/Users/kentaro/Trashcan_s/signage/";

var configimgpath = "./config/img/";

var imgrate = 1;
var order = 0;

var focus = null;
var dr = null;
var isDrag = false;
var isDraw = false;
var actionMode = 0; //0=>hand 1=>pen 2=>erase

var x, y;
var startX = 0;
var startY = 0;

var allon = 100; //number of all image
var iconimg = new Array();
for(var i=0; i<allon; i++){    
    iconimg[i] = new Image();
    iconimg[i].src = signagepath + i +".png";
}

var boximg = new Array();
for(var i=0; i<3; i++){    
    boximg[i] = new Image();
    boximg[i].src = configimgpath + "box" + i +".png";
}

var line = new Array();
var li = 0;

var log = new Array();
var lo = 0;

var agentWord = new Array();
var aw = 0;

var gomi = new Array();
var on = 0; //number of image
var ton = 200; //number of text

var textdata = null;

var time = 0;

//Draw bottun;
var box = new Array();
box[0] = new Toolbox(0, 100, 10, 0);
box[1] = new Toolbox(1, 150, 10, 1);
box[2] = new Toolbox(2, 200, 10, 2);

log[lo] = new Log("SESSIONSTART");


/** main **/
window.onload = function() {
	
/** Get DBConnection **/
var search_msg_data
		$.ajax({
        type: "GET",
        url: "./hoge.php?s=1&e=100",

        success: function(msg){
        //setTimeout(search_json, 5000); // タイムラグ表示(Now Loading確認用)
        var get_json = eval("("+msg+")");
        console.log("DB CONNECTION SUCCESS");
        console.log(get_json);
            if(get_json.results == null){
           	 	console.log("NO DATA");
            }
            else{
            textdata = get_json["results"];
            main();
            }
        }
        });
}

	
function main(){

//Gomi
for(var i=0; i<on; i++){
	 //Gomi(type, id, typetid, name, xPos, yPos, chkin, rad, ord)
	gomi[i] = new Gomi("i", i, i, "Gomi" + i , gframe_x+Math.random()*gframe_w+40, gframe_y + gframe_h*i/on + Math.random()*50-100, 1 , Math.random()*40-20 , order); 
	order++;
	console.log(gomi[i]);
}

for(var i=on; i<on+ton; i++){
	 //Gomi(type, id, typetid, name, xPos, yPos, chkin, rad, ord)
	gomi[i] = new Gomi("t", i, i , textdata[i+1].name , gframe_x+Math.random()*gframe_w+40, gframe_y + gframe_h*i/ton + Math.random()*50-100, 1 , Math.random()*40-20 , order); 
	order++;
	console.log(gomi[i]);
}

//load canvas
var canvas = document.getElementById('canvas');
var cc = canvas.getContext('2d');


//mouse function
canvas.onmousemove = mouseMoveListner;
function mouseMoveListner(e) {
		
		var mouseX = getpoint(e,"x");
		var mouseY = getpoint(e,"y");
		
		var o = null;
		var oi = null;
		focus = null;

		if(actionMode == 0){
			for(var i=0; i<gomi.length; i++){
				gomi[i].mo = 0;
				if(mouseX > gomi[i].xPos - gomi[i].w/2 && mouseX < gomi[i].xPos + gomi[i].w/2 && mouseY > gomi[i].yPos - gomi[i].h/2 && mouseY < gomi[i].yPos + gomi[i].h/2){
					if(o == null && oi == null){
						o = gomi[i].ord;
						oi = i;
					}else if(gomi[i].ord > o){
						o = gomi[i].ord;
						oi = i;
					};
				};
			}
			if(o != null && oi != null){
				gomi[oi].mo = 1;
				focus = oi;
			};
	};
}


canvas.addEventListener("mousedown",function(e){
		
		var mouseX = getpoint(e,"x");
		var mouseY = getpoint(e,"y");
		
		//garbage
		if(actionMode == 0 && focus != null ){
			isDrag = true;
			dr = focus;
	        startX = mouseX - gomi[dr].xPos;
	        startY = mouseY - gomi[dr].yPos;

	        for(var o=0; o<gomi.length; o++){
				if(gomi[o].ord > gomi[dr].ord ){
	        		gomi[o].ord--;
			}
	        }
	        for(var l=0; l<line.length; l++){
				if(line[l].ord > gomi[dr].ord ){
	        		line[l].ord--;
			}
	        }
			gomi[dr].ord = order;
			log[lo] = new Log("DRAGGOMI," + dr + "," + gomi[dr].name + "," + (gomi[dr].xPos - frame_x) + "," + (gomi[dr].yPos - frame_y));

		}
		
		//whiteboard
		//click box
		for(var i = 0; i < box.length; i++){
			if(mouseX > box[i].x && mouseX < box[i].x + box[i].w && mouseY > box[i].y && mouseY < box[i].y + box[i].w){
				for(var ii = 0; ii < box.length; ii++){
					box[ii].status_flag = 1;
					box[ii].display(cc);
				}
					box[i].status_flag = 2;
					box[i].display(cc);
					actionMode = box[i].id;
					log[lo] = new Log("SELECTMODE," + actionMode);
					return;
			}
		}
		
		//draw
		if(actionMode == 1 || actionMode == 2){
		if(mouseX > frame_x && mouseX < frame_x + frame_w && mouseY > frame_y && mouseY < frame_y + frame_h){
			var linecolor = "#696969";
			var linewidth = 1;
			if(actionMode == 1){
				    linecolor = "#696969";
				    linewidth = 1;
			}else if(actionMode == 2){
				    linecolor = "#ffffff";
				    linewidth = 40;
			}
			line[li] = new Line(li, linecolor, linewidth , order);  
			log[lo] = new Log("STARTDRAW," + li + "," + actionMode);
			order++;
			isDraw = true;
		};
		};
		
	    }
	);
	
canvas.addEventListener("mousemove", function(e){
	
	//garbage
	if(isDrag){
		var mouseX = getpoint(e,"x");
		var mouseY = getpoint(e,"y");
		
	    	gomi[dr].xPos = mouseX - startX;
	    	gomi[dr].yPos = mouseY - startY;
	    	gomi[dr].rad = 0;
	    	gomi[dr].ySpeed = 0;
		}
		
	//whiteboard	
	if (isDraw){
		var mouseX = getpoint(e,"x");
		var mouseY = getpoint(e,"y");
		
		if(mouseX > frame_x && mouseX < frame_x + frame_w && mouseY > frame_y && mouseY < frame_y + frame_h){
			line[li].draw(mouseX, mouseY);
			line[li].display(cc);
			log[lo] = new Log("DRAWING," + (mouseX - frame_x) + "," + (mouseY - frame_y));
		};
	};
    }
);
	
canvas.addEventListener("mouseup",function(e){
	
		//garbage
		if(isDrag){
			var mouseX = getpoint(e,"x");
			var mouseY = getpoint(e,"y");
			
			if(gomi[dr].xPos >= frame_x && gomi[dr].xPos < frame_x + frame_w && gomi[dr].yPos > frame_y && gomi[dr].yPos < frame_y + frame_h){
	    		gomi[dr].mo = 0;
	    		gomi[dr].display(cc);
	    		focus = null;
	    	}
			
			log[lo] = new Log("DROPGOMI," + dr + "," + gomi[dr].name + "," + (gomi[dr].xPos - frame_x) + "," + (gomi[dr].yPos - frame_y));
			dr = null;
			isDrag = false;
		}
		
		//whiteboard
		if(isDraw){
			isDraw = false;
			log[lo] = new Log("STOPDRAW," + li);
			li++;
		}
}
);


//Main loop
var loop = function() {
		
		cc.fillStyle = '#d3d3d3';
		cc.fillRect(0,0,canvas.width,canvas.height);
		
		cc.font = "23px 'ヒラギノ明朝 ProN W6'";
		cc.fillStyle = '#ffffff';
		var min =  Math.floor(time / 600);
		 if(min < 10){min = '0' + min;}
		var sec =  Math.floor((time % 600) / 10);
		 if(sec < 10){sec = '0' + sec;}
	 	cc.fillText(min + ":" + sec , 10, 35);
	 	
	 	cc.fillStyle = '#ffffff';
		cc.fillRect(frame_x,frame_y,frame_w,frame_h);
		
		for(var o=0; o<order+1; o++){
	    	for(var i=0; i<gomi.length; i++){
		    	if(gomi[i].ord == o){
		    		//gomi[i].move(); 
			       	gomi[i].edge(); 
		      		gomi[i].display(cc);
		    	}
	    	}
	    	
    		for(var ii = 0; ii < line.length; ii++){
        		if(line[ii].ord == o){
    	    		line[ii].display(cc);
        		}
        	}
		}
		
		/**
		for(var iii = 0; iii < agentWord.length; iii++){
			agentWord[iii].move();
			if(agentWord[iii].status_flag == 1){
				agentWord[iii].display(cc);
			}
    	}
		**/
		
		for(var i = 0; i < box.length; i++){
			box[i].display(cc);
		}
		
		/**
		cc.lineWidth = 1;
		cc.strokeStyle='#696969';
		cc.strokeRect(frame_x+1, frame_y , frame_w, frame_h);
		**/
		time++;
		
	setTimeout(loop, 100);
 };
 
 
var agentloop = function() {
	
	
	/**
	for(var li = 0; li < log.length; li++){
		logarray = log[li].log.split(",");
		if(logarray[2] == "DROPGOMI"){
			if(logarray[5] < frame_x + frame_w){
				wordsIdOnFrame.push(logarray[4]);
			}
		}
	}
	**/
	
	var wordsIdOnFrame = [];
	 for(var i=0; i<gomi.length; i++){
	    	if(gomi[i].xPos < frame_x + frame_w){
	    		wordsIdOnFrame.push([i, gomi[i].name]);	 
	    	}
	 }
	 
	 console.log(wordsIdOnFrame);

	 if(wordsIdOnFrame.length != 0){
			 var logArray = [];
			 var lli = 0;
			 
			 for(var li = 0; li < log.length; li++){
					la = log[li].log.split(",");
					if(la[2] == "DROPGOMI" || wordsIdOnFrame.indexOf((la[3])) != -1){
						logArray.push([Number(la[0]), la[3] ,la[4]]);
						lli++;
					}
			 }
			 
			 console.log(logArray);
			 //var aid = Math.floor( Math.random() * (wordsIdOnFrame.length));
		 
		 lli = lli - 1;
		 //console.log("a:" + lli);
		 
		 //console.log(gomi[wordsIdOnFrame[wordsIdOnFrame.length - 1]].name);
		
		hatena(wordsIdOnFrame).done(function(msg) {
		});
			 
		//はてなapi	 
		function hatena(wiof){
			var d = $.Deferred();
			
			var words = "";
			for(var wi = 0; wi <wiof.length; wi++){
				if(wi != 0){
				words += ","
				}	
				words += wiof[wi][1];
			}
			
			$.ajax({
				type: "GET",
		        url: "./hatena.php?w=" + words,
		        success: function(msg){
		        	console.log(msg);
			        var gaj = eval("("+msg+")");
			        console.log(gaj);
			        var results = gaj.results;
			        	for(var wii=0 ; wii <wiof.length; wii++){
			        		console.log(results[wii].channel);
			        		
			        		var k = [];
			        		for (keys in results[wii].channel){
			        				k.push(keys);
			        			}
			        		
			        		if(keys.indexOf("item") == -1){
			        			console.log("noitem");
			        			return;
			        		}
			        		
			        		
			        		var items = results[wii].channel.item;
			        		console.log(items);
				        	
			        		if(!(items instanceof Array)){
				            	agentWord[aw] = new AgentWord(aw , items.title, wiof[wii][0], 2, order, 0);
				            	console.log(agentWord[aw]);
				            	aw++;
		            			order++;
		            			
			        		}else if(items.length == 0){
				           	 	console.log("NO DATA");
				           	 	
				            }else{

				            var wlist = [];
				            for(var gci = 0; gci <items.length; gci++){
				            	wlist.push(items[gci].title);
				            }
				            console.log(wlist);
				            
					        for(var wli = 0; wli < wlist.length; wli++){
					            	var wn = wlist[wli].indexOf(wiof[wii][1]);
					            		if(wn != -1){
					            		var aword = wlist[wli].split(wiof[wii][1]);
					            		console.log(aword);
					            		
					            		for(var awi = 0; awi < aword.length; awi++){
					            		if(aword[awi] != ""){
					            			//id, name, gomiid, relation, order, appearorder
					            			agentWord[aw] = new AgentWord(aw , aword[awi], wiof[wii][0], awi, order, wli);
					            			console.log(agentWord[aw]);
					            			aw++;
					            			order++;
					            		}
					            		}
					            		}else{
					            			agentWord[aw] = new AgentWord(aw , wlist[wli], wiof[wii][0], 2, order, wli);
					            			aw++;
					            			order++;
					            		}
					        }
				            }
				            
				            }
		        	d.resolve();
		        }
			});
			return d.promise();
		}

		
		/**
		 $.ajax({
		        type: "GET",
		        url: "./hatena.php?w=" + logArray[lli][2],
		        
		        success: function(msg){
		        console.log(msg);
		        var gaj = eval("("+msg+")");
		        console.log("HATENA CONNECTION SUCCESS");
		        console.log(gaj);
		        	//関連タイトルデータ抽出
		        	var items = gaj.results.channel.item;
		        	console.log(items);
		        	
		            if(items.length == 0){
		           	 	console.log("NO DATA");
		            }else{
		            var wlist = [];
		            for(var gci = 0; gci <gaj.results.channel.item.length; gci++){
		            	wlist.push(gaj.results.channel.item[gci].title);
		            }
		            console.log(wlist);
		            
		            if(wlist.length != 0){
			        for(var wli = 0; wli < wlist.length; wli++){
			            	var wn = wlist[wli].indexOf(logArray[lli][2]);
			            		if(wn != -1){
			            		var aword = wlist[wli].split(logArray[lli][2]);
			            		console.log(aword);
			            		
			            		for(var awi = 0; awi < aword.length; awi++){
			            		if(aword[awi] != ""){
			            			//id, name, gomiid, relation, order
			            			agentWord[aw] = new AgentWord(aw , aword[awi], logArray[lli][1], awi, order);
			            			console.log(agentWord[aw]);
			            			aw++;
			            			order++;
			            		}
			            		}
			            		}else{
			            			agentWord[aw] = new AgentWord(aw , wlist[wli], logArray[lli][1], 2, order);
			            			aw++;
			            			order++;
			            		}
			        }
		            }
		            }
		        }//success
		        });//ajax
		        **/
		 }
	 setTimeout(agentloop, 30000);
 };

//Start loop
loop();
//agentloop();

};


//Publish log 
function end(){
	var text = "";
	for(var i = 0; i < log.length; i++){
		text += log[i].log + "\r";
	}
	for(var i = 0; i < line.length; i++){
		text += line[i].id + " x:" + line[i].x + " y:" + line[i].y + "\r" + "&"; 
	}
	var blob = new Blob([text], {'type': 'text/plain'});
	var a = document.createElement('a');
	var label = document.createTextNode('GETLOG');
	if(window.webkitURL){
		a.setAttribute('href', window.webkitURL.createObjectURL(blob));
	}else if(window.URL){
		a.setAttribute('href', window.URL.createObjectURL(blob));
	}
	a.setAttribute('target', '_blank');
	a.appendChild(label);
	document.getElementById('log').appendChild(a);
}


 //** Gomi Class **//
 //Gomi(type, id, typetid, name, xPos, yPos, chkin, rad, ord)
 function Gomi(type, id, typeid, name, xPos, yPos, chkin, rad, ord){
   	  this.type = type;
	  this.id = id;
	  this.typeid = typeid;
	
	  this.name = name;
	  
	  //this.xPos = xPos;
	  //this.yPos = yPos;
	  this.xPos = gframe_x + Math.floor(this.id / 50) * 120;
	  this.yPos = gframe_y + 10+ this.id % 50 * 17;
	  this.rad = 0;
	  this.xSpeed = 0;
	  this.ySpeed = 0;
	  this.rSpeed = 0;
	  
	  this.chkin = chkin;
	  this.speed = 3;
	  
	  this.mo = 0;
	  this.ord = ord;
	  
	  if(this.type == "i"){
		  this.w = iconimg[this.typeid].width*imgrate;
		  this.h = iconimg[this.typeid].height*imgrate;
	  }
	  if(this.type == "t"){
		  this.w = 30;
		  this.h = 30;
	  }
	  
	  this.sizerate = 1; 
	  this.sizerateSpeed = 0.2;
	  
	  this.status_flag = 1;
 }
 
 /* Display */
 Gomi.prototype.display = function(cc){
     cc.save();
     if(this.chkin == 1){
    	 
    	 cc.translate(this.xPos+ this.w/2, this.yPos+this.h/2);
    	 cc.rotate(this.rad/180*Math.PI);
    	 cc.translate(-this.xPos-this.w/2, -this.yPos-this.h/2);
    	 
    	 
    	 if(this.type == "i"){
    		 this.w = iconimg[this.typeid].width*imgrate*this.sizerate;
    		 this.h = iconimg[this.typeid].height*imgrate*this.sizerate;
    		 cc.drawImage(iconimg[this.typeid], this.xPos - this.w/2, this.yPos - this.h/2, this.w, this.h); //icon
    		 //console.log(this.typeid);
    		 cc.lineWidth = 1; 
    		 cc.strokeStyle = "#696969";
    		 cc.strokeRect(this.xPos - this.w/2, this.yPos - this.h/2, this.w, this.h);
    	 }
    	 
    	 if(this.type == "t"){
    		 cc.textBaseline = "middle";
    		 cc.textAlign = "center";
    		 cc.font = 15 * this.sizerate + "px 'ヒラギノ明朝 ProN W6'";
    		 cc.fillStyle = "black";
    		 
    		 cc.fillText(this.name, this.xPos, this.yPos);
    		 this.w = cc.measureText(this.name).width;
    		 this.h = 15 * this.sizerate;
    		 //console.log(cc.measureText(this.name).width);
    	 }
    	 
    	 	/**
        	 cc.save();
        	 cc.globalAlpha = 0.4;
    		 cc.fillStyle = "#FFD700";
        	 cc.fillRect(this.xPos, this.yPos, this.w, this.h);
        	 cc.restore();
			**/
     }
 	cc.restore();  
 }
 
 /* Move */
 Gomi.prototype.move = function(){  
	 if(this.mo == 0){
	 if(this.xPos >= gframe_x){
		 this.rSpeed += (Math.random()*2 - 1)*this.speed;
	     if(this.rSpeed > 0.05){this.rSpeed = 0.05;}else if(this.rSpeed < -0.05){this.rSpeed = -0.05;}
	     
	     this.xSpeed += (Math.random()*2 - 1)*0.1*this.speed;
	     if(this.xSpeed > 1){this.xSpeed = 1;}else if(this.xSpeed < -1){this.xSpeed = -1;}
	     
	     this.ySpeed += (Math.random()*2 - 1)*(this.xPos - gframe_x)*0.005*this.speed;
	     if(this.ySpeed > 12){this.ySpeed = 12;}else if(this.ySpeed < 0){this.ySpeed = 0;}
	     
	     this.rad += this.rSpeed;
	     this.xPos += this.xSpeed;
	     this.yPos += this.ySpeed;
	 }

	 if(this.sizerate > 1){
		  this.sizerate -= 0.2;
		  this.sizerateSpeed = 0.2;
	 }else if(this.sizerate < 1){
		 this.sizerate = 1;
	 }
	 
	 }
	 
	 if(this.mo == 1){
		 
		 this.rad = 0;
		 if(this.w < 400){
			 if(this.sizerate < 1.3){
				 this.sizerateSpeed -= 0.01; 
				 this.sizerate += this.sizerateSpeed;
			 }
	 }
	 }
 };
 	
   
 /* Edge */
   Gomi.prototype.edge = function(){
  	if(this.xPos > gframe_x+gframe_w - this.w/2){
  		this.xPos = gframe_x+gframe_w - this.w/2;
  		this.xSpeed = - this.xSpeed;
       }
    if(this.xPos < frame_x){
 		this.xPos = frame_x;
    }
    if(this.yPos > gframe_y+gframe_h){
   	    this.yPos = gframe_y - this.h;
   	    this.xPos = this.xPos;
	    this.renew();
    }
    if(this.rad < -5){
 	    this.rad = -5;
    }
    if(this.rad > 5){
 	    this.rad = 5;
    }
    
    if(this.xPos < gframe_x && this.xPos > gframe_x - 10){
    	this.xPos = gframe_x;
    	this.xSpeed = -this.xSpeed;
    }
    
    /**
    if(this.xPos < gframe_x && this.xPos > gframe_x - this.w/2){
    	this.xPos = gframe_x;
    }
    if(this.xPos < gframe_x - this.w/2 && this.xPos > gframe_x - this.w){
    	this.xPos = gframe_x  - this.w;
    }
    **/
    
   };
 
   
 /* Renew 
  * 画面下についた時に内容を更新
  * */
 Gomi.prototype.renew = function(){
	 if(this.type == "i"){
		 this.typeid = Math.floor( Math.random() * allon );
		 iconimg[this.typeid].src = signagepath + this.typeid +".png";
	 } 
	 if(this.type == "t"){
		 var newt = Math.floor( Math.random() * Object.keys(textdata).length ) + 1;
		 this.typeid = newt;
		 //console.log(newt);
		 this.name = textdata[newt].name;
		 
	 }
 };


//** Toolbox **//
function Toolbox(_i, _x, _y, _im){
	this.id = _i;
	this.x = _x;
	this.y = _y;
	this.w = 30;
	this.image = _im;
	this.status_flag = 1;
}

/*display*/
Toolbox.prototype.display = function(cc){
	//cc.fillStyle = this.color;
	//cc.fillRect(frame_x + this.x, frame_y + this.y, this.w, this.w);
	cc.beginPath();
	cc.lineWidth = 1;
	cc.strokeStyle='#ffffff';
	cc.strokeRect(this.x, this.y, this.w, this.w);
	cc.drawImage(boximg[this.image], this.x, this.y, this.w, this.w); //icon
	
	if(this.status_flag == 2){
		cc.beginPath();
		cc.lineWidth = 2;
		cc.strokeStyle='#ffd700';
		cc.strokeRect(this.x-2, this.y-2, 34, 34);
	}else{
		cc.beginPath();
		cc.lineWidth = 2;
		cc.strokeStyle='#d3d3d3';
		cc.strokeRect(this.x-2, this.y-2, 34, 34);
	}
}

//** Line **//
function Line(_i, _lc, _lw,  _o){
	  this.id = _i;
	  this.color = _lc;
	  this.width = _lw;
	  this.x = new Array();
	  this.y = new Array();
	  this.status_flag = true;
	  this.ord = _o;
}

/* draw */
Line.prototype.draw = function(_x,_y){
	  this.x.push(_x);
	  this.y.push(_y);
}

/* display */
Line.prototype.display = function(cc){
	if(this.status_flag){
		cc.beginPath();
		cc.lineWidth = this.width;
		cc.strokeStyle = this.color;
		cc.moveTo(this.x[0],this.y[0]);
		for(var i = 0; i < this.x.length; i++){
			cc.lineTo(this.x[i], this.y[i]);
		}
		cc.stroke();
	}
}

Line.prototype.move = function(){
	//console.log(this.speed + this.status_flag);
	for(var i = 0; i < this.y.length; i++){
			this.y[i] = this.y[i] + this.ySpeed;
	}
}

//** Agent Word **//
//id, name, gomiid, relation, order, appearorder
function AgentWord(_i, _n, _gid, _rel, _o, _ao){
	  this.id = _i;
	  this.name = _n;
	  this.gid = _gid;
	  this.relation = _rel;
	  this.w = 0;
	  this.h = 0;
	  this.alpha = 0.5;
	  this.ord = _o;
	  this.appearorder = _ao * 50;
	  this.status_flag = 0;
	  
	  if(this.relation == 0){
			this.xPos = gomi[this.gid].xPos - (gomi[this.gid].w/2 + Math.random() * 25 - 50);
			this.yPos = gomi[this.gid].yPos - (10 + Math.random() * 25);
		}else if(this.relation == 1){
			this.xPos = gomi[this.gid].xPos + (gomi[this.gid].w/2 + Math.random() * 25 - 50);
			this.yPos = gomi[this.gid].yPos + (10 + Math.random() * 25);
		}else if(this.relation == 2){
			this.xPos = gomi[this.gid].xPos;
			this.yPos = gomi[this.gid].yPos + (Math.floor(Math.random()*2)*2 - 1) * (10 + Math.random() * 25);
		}
}

/* display */
AgentWord.prototype.display = function(cc){
	if(this.status_flag == 1){
		
		cc.save();
   	 	cc.globalAlpha = this.alpha;
		cc.textBaseline = "middle";
		cc.textAlign = "center";
		cc.font = 20 + "px 'ヒラギノ明朝 ProN W6'";
		cc.fillStyle = "#008000";
		
		this.w = cc.measureText(this.name).width;
		this.h = 30;
		
		//console.log(gomi[this.gid].xPos);
		cc.fillText(this.name, this.xPos, this.yPos);
		cc.restore();
		this.alpha = this.alpha * 50 / 51;
		//console.log(this.alpha +"-"+ this.w +"-"+ this.h);
	}
	
	/**
	if(this.alpha < 0){
		this.status_flag = 0;
	}
	
	if(this.xPos > gframe_x){
		this.status_flag = 0;
	}
	**/
	
};

AgentWord.prototype.move = function(cc){
	this.appearorder -= 1;
	if(this.appearorder < 0){
		this.status_flag = 1;
	}
}

function Log(_l){
	this.log = lo + "," + time + "," + _l;
	console.log(this.log);
	lo++;
}

var getpoint = function(_e, _p){
	var rect = _e.target.getBoundingClientRect();
	if(_p == "x"){
		var mouseX = _e.clientX - rect.left;
		return mouseX;
	}
	if(_p == "y"){
		var mouseY = _e.clientY - rect.top;
		return mouseY;
	}
}
