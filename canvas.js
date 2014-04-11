/** socket action **/

/** client canvas file **/

/* Variables definition */
var frame_x = 0;
var frame_y = 0;
var frame_w = 500
var frame_h = 800;

var gframe_x = 500;
var gframe_y = 0;
var gframe_w = 500;
var gframe_h = 800;

var on = 2; //number of image
var allon = 100;
var ton = 50; //number of text

var signagepath = "./signage/";
//var signagepath = "/Users/kentaro/Trashcan_s/signage/";

/**
var pinimg = new Image();
pinimg.src = "./files/pin.png";
**/

var imgrate = 1;
var order = 0;

var focus = null;
var dr = null;
var isDrag = false;
var isDraw = false;

var line = new Array();
var li = 0;

var log = new Array();
var lo = 0;

var x, y;
var startX = 0;
var startY = 0;

var color = "#696969";

//Img
var iconimg = new Array();
for(var i=0; i<allon; i++){    
    iconimg[i] = new Image();
    iconimg[i].src = signagepath + i +".png";
}

var textdata = null;

//Draw bottun;
var box = new Array();
//box[0] = new Toolbox(10, 10, "#696969");
//box[1] = new Toolbox(10, 60, "#ff0000");
//box[2] = new Toolbox(10, 110, "#ffffff");

log[lo] = new Log("SESSIONSTART");


/** main **/
window.onload = function() {
	
/** Get DBConnection **/
var search_msg_data
		$.ajax({
        type: "GET",
        url: "http://localhost/gcs/hoge.php?s=1&e=100",

        success: function(msg){
        
        	console.log("success");

        //setTimeout(search_json, 5000); // タイムラグ表示(Now Loading確認用)
        var get_json = eval("("+msg+")");
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

console.log(textdata[1].name);

//Gomi
var gomi = new Array();
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

		if(!isDrag){
			for(var i=0; i<gomi.length; i++){
				gomi[i].mo = 0;
				if(mouseX > gomi[i].xPos && mouseX < gomi[i].xPos + gomi[i].w && mouseY > gomi[i].yPos && mouseY < gomi[i].yPos + gomi[i].h){
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
		if(focus != null ){
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
			log[lo] = new Log("DRAGIMAGE," + gomi[dr].img + "," + e.clientX + "," + e.clientY);

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
					color = box[i].color;
					box[i].display(cc);
					log[lo] = new Log("SELECTCOLOR," + color);
					return;
			}
		}
		
		//draw
		/**
		if(mouseX > frame_x && mouseX < frame_x + frame_w && mouseY > frame_y && mouseY < frame_y + frame_h){
			line[li] = new Line(li, color, order);  
			isDraw = true;
			log[lo] = new Log("STARTDRAW," + li + "," + color);
			order++;
		};
		**/
		
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
		
		if(mouseX > frame_x && mouseX < frame_x + frame_w && mouseY > frame_y + box[0].y + box[0].w + box[0].y + 20 && mouseY < frame_y + frame_h){
			line[li].draw(mouseX, mouseY);
			line[li].display(cc);
			//log[lo] = new Log("DRAWING," + x + "," + y);
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
			
			log[lo] = new Log("DROPIMAGE," + dr + "," + mouseX + "," + mouseY);
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
	
			cc.clearRect(0,0,canvas.width,canvas.height);
		/**
		for(var i = 0; i < box.length; i++){
			box[i].display(cc);
		}
		**/
		
		for(var o=0; o<order+1; o++){
	    	for(var i=0; i<gomi.length; i++){
		    	if(gomi[i].ord == o){
		    		if(gomi[i].mo != 1){
		    			gomi[i].move(); 
		    		}
			       	gomi[i].edge(); 
		      		gomi[i].display(cc);
		    	}
	    	}
	    	
    		for(var ii = 0; ii < line.length; ii++){
        		if(line[ii].ord == o){
    	    		//line[ii].move()
    	    		line[ii].display(cc);
        		}
        	}
		}	

		/**
		cc.lineWidth = 1;
		cc.strokeStyle='#696969';
		cc.strokeRect(frame_x+1, frame_y , frame_w, frame_h);
		**/
		
	setTimeout(loop, 100);
 };

//Start loop
loop();

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
	  
	  this.xPos = xPos;
	  this.yPos = yPos;
	  this.rad = rad;
	  this.xSpeed = 0;
	  this.ySpeed = 0;
	  this.rSpeed = 0;
	  
	  this.chkin = chkin;
	  this.speed = 1;
	  
	  this.mo = 0;
	  this.ord = ord;
	  	  
	  if(this.type == "i"){
		  this.w = iconimg[this.typeid].width*imgrate;
		  this.h = iconimg[this.typeid].height*imgrate;
	  }
	  if(this.type == "t"){
		  this.w = 70;
		  this.h = 30;
	  }
	  
 }
 
 /* Display */
 Gomi.prototype.display = function(cc){
     cc.save();
     if(this.chkin == 1){
    	 
    	 cc.translate(this.xPos+ this.w/2, this.yPos+this.h/2);
    	 cc.rotate(this.rad/180*Math.PI);
    	 cc.translate(-this.xPos-this.w/2, -this.yPos-this.h/2);
    	 
    	 
    	 if(this.type == "i"){
    		 cc.drawImage(iconimg[this.typeid], this.xPos, this.yPos, this.w, this.h); //icon
    		 cc.lineWidth = 1; 
    		 cc.strokeStyle = "#696969";
    		 cc.strokeRect(this.xPos, this.yPos, this.w, this.h);
    	 }
    	 
    	 if(this.type == "t"){
    		 cc.textBaseline = "top";
    		 cc.textAlign = "start";
    		 cc.font = "30px 'ヒラギノ明朝 ProN W6'";
    		 cc.fillStyle = "black";
    		 
    		 cc.fillText(this.name, this.xPos, this.yPos);
    		 this.w = cc.measureText(this.name).width;
    		 //console.log(cc.measureText(this.name).width);
    	 }
    	 
    	 if(this.mo == 1){
        	 cc.save();
        	 cc.globalAlpha = 0.4;
    		 cc.fillStyle = "#FFD700";
        	 cc.fillRect(this.xPos, this.yPos, this.w, this.h);
        	 cc.restore();
         }
    }
 	cc.restore();  
 }
 
 /* Move */
 Gomi.prototype.move = function(){  
	 
	 if(this.xPos >= gframe_x){
     
	 this.rSpeed += (Math.random()*2 - 1)*this.speed;
     if(this.rSpeed > 0.05){this.rSpeed = 0.05;}else if(this.rSpeed < -0.05){this.rSpeed = -0.05;}
     
     this.xSpeed += (Math.random()*2 - 1)*0.1*this.speed;
     if(this.xSpeed > 1){this.xSpeed = 1;}else if(this.xSpeed < -1){this.xSpeed = -1;}
     
     this.ySpeed += (Math.random()*2 - 1)*(this.xPos - gframe_x)*0.005*this.speed;
     if(this.ySpeed > 4){this.ySpeed = 4;}else if(this.ySpeed < 0){this.ySpeed = 0;}
     
     this.rad += this.rSpeed;
     this.xPos += this.xSpeed;
     this.yPos += this.ySpeed;
	 }
	 
	 
 };
 	
   
 /* Edge */
   Gomi.prototype.edge = function(){
  	if(this.xPos > gframe_x+gframe_w - this.w/2){
  		this.xPos = gframe_x+gframe_w - this.w/2;
       }
    if(this.xPos < frame_x){
 		this.xPos = frame_x;
    }
    if(this.yPos > gframe_y+gframe_h){
   	    this.yPos = gframe_y - this.h;
   	    this.xPos = this.xPos;
	    this.renew();
    }
    if(this.rad < -10){
 	    this.rad = -10;
    }
    if(this.rad > 10){
 	    this.rad = 10;
    }
    if(this.xPos < gframe_x && this.xPos > gframe_x - this.w/2){
    	this.xPos = gframe_x;
    }
    if(this.xPos < gframe_x - this.w/2 && this.xPos > gframe_x - this.w){
    	this.xPos = gframe_x  - this.w;
    }
   };
 
   
 /* Renew */
 Gomi.prototype.renew = function(){
	 if(this.type == "i"){
		 this.typeid = Math.floor( Math.random() * allon );
		 iconimg[this.typeid].src = signagepath + this.typeid +".png";
	 } 
	 if(this.type == "t"){
		 var newt = Math.floor( Math.random() * Object.keys(textdata).length ) + 1;
		 this.typeid = newt;
		 console.log(newt);
		 this.name = textdata[newt].name;
		 
	 }
 };



//** Toolbox **//
function Toolbox(_x, _y, _c, _i){
	this.x = _x;
	this.y = _y;
	this.w = 30;
	this.color = _c;
	this.status_flag = 1;
}

/*display*/
Toolbox.prototype.display = function(cc){
	cc.fillStyle = this.color;
	cc.fillRect(frame_x + this.x, frame_y + this.y, this.w, this.w);
	
	if(this.color == "#ffffff"){
		cc.beginPath();
		cc.lineWidth = 0.5;
		cc.strokeStyle='#696969';
		cc.strokeRect(frame_x + this.x, frame_y + this.y, this.w, this.w);
	}
	
	if(this.status_flag == 2){
		cc.beginPath();
		cc.lineWidth = 2;
		cc.strokeStyle='#ffd700';
		cc.strokeRect(frame_x + this.x-2, frame_y + this.y-2, 34, 34);
	}else{
		cc.beginPath();
		cc.lineWidth = 2;
		cc.strokeStyle='#ffffff';
		cc.strokeRect(frame_x + this.x-2, frame_y + this.y-2, 34, 34);
	}
}

//** Line **//
function Line(_i, _c, _o){
	  this.id = _i;
	  this.x = new Array();
	  this.y = new Array();
	  this.color =  _c;
	  this.status_flag = true;
	  this.ord = _o;
}

/* draw */
Line.prototype.draw = function(_x,_y){
	  this.x.push(_x);
	  this.y.push(_y);
}

/* display */	
	if(this.status_flag){
		cc.beginPath();
		cc.lineWidth = 1;
		if(this.color == "#ffffff"){
			cc.lineWidth = 40;
		}
		cc.strokeStyle = this.color;
		cc.moveTo(this.x[0],this.y[0]);
		for(i = 0; i < this.x.length; i++){
			cc.lineTo(this.x[i], this.y[i]);
		}
		cc.stroke();
	}

Line.prototype.move = function(){
	//console.log(this.speed + this.status_flag);
	for(var i = 0; i < this.y.length; i++){
			this.y[i] = this.y[i] + this.ySpeed;
	}
}

function Log(_l){
	this.date = new Date();
	this.log = lo + "," + this.date.getTime() + "," + _l;
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



