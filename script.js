async function loadIcons(){

const icons=[
"vig",
"min",
"end",
"str",
"dex",
"int",
"fai",
"arc"
];


for(let i=0;i<icons.length;i++){

let icon=document.getElementById("icon"+i);

let svg=await fetch("icons/"+icons[i]+".svg")
.then(response=>response.text());

icon.innerHTML=svg;

}

}



const names=[
"VIG",
"MIN",
"END",
"STR",
"DEX",
"INT",
"FAI",
"ARC"
];


const colours=[
"red",
"purple",
"green",
"crimson",
"darkblue",
"lightblue",
"orange",
"gold"
];

const classes={

samurai:{
level:9,
stats:[12,11,13,12,15,9,8,8]
},

vagabond:{
level:9,
stats:[15,10,11,14,13,9,9,7]
},

hero:{
level:7,
stats:[14,9,12,16,9,7,8,11]
},

warrior:{
level:8,
stats:[11,12,11,10,16,10,8,9]
},

astrologer:{
level:6,
stats:[9,15,9,8,12,16,7,9]
},

prophet:{
level:7,
stats:[10,14,8,11,10,7,16,10]
},

bandit:{
level:5,
stats:[10,11,10,9,13,9,8,14]
},

confessor:{
level:10,
stats:[10,13,10,12,12,9,14,9]
},

wretch:{
level:1,
stats:[10,10,10,10,10,10,10,10]
}

};

function detectBuild(){


let allMaxed = stats.every(value => value === 99);


if(allMaxed){

return "OMNI-X";

}


const vig=stats[0];
const min=stats[1];
const end=stats[2];
const str=stats[3];
const dex=stats[4];
const int=stats[5];
const fai=stats[6];
const arc=stats[7];


// find highest stats

let highest = Math.max(...stats);

let topStats = stats.filter(value=>value===highest).length;



// HYBRIDS (only if both stats are actually among your strongest)


if(str>=50 && fai>=40 && str>=dex && str>=int && str>=arc && fai>=dex && fai>=int && fai>=arc)

return "Strength/Faith";


if(dex>=50 && arc>=40 && dex>=int && dex>=fai && arc>=int && arc>=fai)

return "Dex/Arcane";


if(int>=50 && dex>=40 && int>=fai && dex>=arc)

return "Spellblade";


if(int>=50 && fai>=40 && int>=fai && fai>=arc)

return "Golden Order";


if(fai>=50 && arc>=40 && fai>=dex && fai>=int)

return "Dragon Communion";



// PURE BUILDS


if(str>=60 && str===highest)

return "Strength";


if(dex>=60 && dex===highest)

return "Dexterity";


if(int>=60 && int===highest)

return "Sorcery";


if(fai>=60 && fai===highest)

return "Faith";


if(arc>=60 && arc===highest)

return "Arcane";



// QUALITY

if(str>=50 && dex>=50 && Math.abs(str-dex)<=15)

return "Quality";



let maxStat = Math.max(...stats);
let minStat = Math.min(...stats);


if(maxStat === minStat){

return "Balanced";

}


return "Custom";


}
let selectedClass =
localStorage.getItem("tarnishedClass") || "samurai";


document.getElementById("classSelect").value = selectedClass;


let stats = JSON.parse(
localStorage.getItem("tarnishedStats")
) || classes[selectedClass].stats;

document.getElementById("characterImage").onchange = function(){

let file = this.files[0];

if(file){

let reader = new FileReader();


reader.onload = function(e){

let image = e.target.result;

document.getElementById("characterPreview").src = image;


// save image

localStorage.setItem(
"tarnishedImage",
image
);

};


reader.readAsDataURL(file);

}

};



// load saved image

let savedImage = localStorage.getItem("tarnishedImage");


if(savedImage){

document.getElementById("characterPreview").src = savedImage;

}

document.getElementById("nameInput").value =
localStorage.getItem("tarnishedName") || "";


document.getElementById("nameInput").oninput=()=>{

localStorage.setItem(
"tarnishedName",
document.getElementById("nameInput").value
);

};

document.getElementById("classSelect").onchange = ()=>{

selectedClass =
document.getElementById("classSelect").value;


localStorage.setItem(
"tarnishedClass",
selectedClass
);


stats = [...classes[selectedClass].stats];


localStorage.setItem(
"tarnishedStats",
JSON.stringify(stats)
);


update();

};


function updateIcons(){


for(let i=0;i<8;i++){

let icon=document.getElementById("icon"+i);

icon.style.opacity=0;

icon.style.color="white";

icon.classList.remove("mastered");

}



let highest=Math.max(...stats);

let lowest=Math.min(...stats);

let highestCount = stats.filter(value=>value===highest).length;


/* ALL STATS 99 */

if(highest===99 && lowest===99){


stats.forEach((value,index)=>{


let icon=document.getElementById("icon"+index);


icon.style.opacity=1;

icon.style.color=colours[index];

icon.classList.add("mastered");


});


return;

}





/* ALL STATS THE SAME */

if(highest===lowest){

return;

}





/* SHOW MAIN STATS */

if(highestCount>3){

return;

}

stats.forEach((value,index)=>{


if(
value===highest ||
(highest-value<=2 && value>lowest)
){


let icon=document.getElementById("icon"+index);


icon.style.opacity=1;



if(value===99){

icon.style.color=colours[index];

icon.classList.add("mastered");

}


}


});


}




function getRank(r){

if(r>=10)return "GODSLAYER";

if(r>=9)return "ELDEN LORD";

if(r>=7)return "DEMIGOD";

if(r>=5)return "CHAMPION";

if(r>=3)return "WARRIOR";

return "TARNISHED";

}





function update(){


let box=document.getElementById("stats");

box.innerHTML="";


stats.forEach((x,i)=>{


box.innerHTML+=`

<div class="stat">


<button
onclick="change(${i},-1)"
onmousedown="startHold(${i},-1)"
onmouseup="stopHold()"
ontouchstart="startHold(${i},-1)"
ontouchend="stopHold()">

-

</button>

${names[i]} : ${x}


<button
onclick="change(${i},1)"
onmousedown="startHold(${i},1)"
onmouseup="stopHold()"
ontouchstart="startHold(${i},1)"
ontouchend="stopHold()">

+

</button>

</div>

`;

});



let total = stats.reduce((a,b)=>a+b,0);


// BASE POWER
// 713 total stat points = 10.00

let rating = Math.pow(total/792,1.35)*10;


// MASTERED STAT BONUS

let mastered = stats.filter(value=>value===99).length;


let masteryBonus = 0;


if(mastered>=1) masteryBonus+=0.15;
if(mastered>=2) masteryBonus+=0.10;
if(mastered>=3) masteryBonus+=0.08;
if(mastered>=4) masteryBonus+=0.05;
if(mastered>=5) masteryBonus+=0.03;
if(mastered>=6) masteryBonus+=0.02;
if(mastered>=7) masteryBonus+=0.01;


rating += masteryBonus;


// CAP

if(rating>10)

rating=10;


document.getElementById("rating").innerHTML=
rating.toFixed(2);


document.getElementById("rank").innerHTML=
getRank(rating);



let startingStats = 88;
let startingLevel = 9;

let level = startingLevel + (total - startingStats);

document.getElementById("level").innerHTML =
"ELDEN LEVEL: " + level;

document.getElementById("build").innerHTML =
"BUILD: " + detectBuild();

chart.data.datasets[0].data=stats;

chart.update();


updateIcons();


localStorage.setItem(
"tarnishedStats",
JSON.stringify(stats)
);


}





let holdTimer;



function startHold(i,amount){


holdTimer=setTimeout(()=>{


holdTimer=setInterval(()=>{


change(i,amount);


},80);


},400);


}



function stopHold(){


clearTimeout(holdTimer);

clearInterval(holdTimer);


}





function change(i,amount){


stats[i]+=amount;



let selectedClass =
document.getElementById("classSelect").value;

let minimum =
classes[selectedClass].stats[i];


if(stats[i]<minimum)

stats[i]=minimum;



if(stats[i]>99)

stats[i]=99;



update();


}






let chart=new Chart(

document.getElementById("chart"),

{

type:"radar",

data:{

labels:names,

datasets:[{

data:stats,

fill:true,

backgroundColor:"rgba(150,0,0,.45)",

borderColor:"red"

}]

},


options:{

plugins:{

legend:{display:false}

},


scales:{

r:{

min:0,

max:99,

ticks:{display:false}

}

}

}

}

);




loadIcons().then(()=>{

update();

});

document.getElementById("saveCard").onclick = function(){


// image

document.getElementById("exportImage").src =
document.getElementById("characterPreview").src;


// rating

document.getElementById("exportRating").innerHTML =
"ABILITY LEVEL: " +
document.getElementById("rating").innerHTML;



// title

document.getElementById("exportTitle").innerHTML =
getRank(
Number(document.getElementById("rating").innerHTML)
);



// chart copy

let chartImage = document.getElementById("chart").toDataURL();

let exportChart = document.getElementById("exportChart");

exportChart.width = 400;
exportChart.height = 400;


let ctx = exportChart.getContext("2d");

let img = new Image();


img.onload = function(){


ctx.drawImage(img,0,0,400,400);



// wait for everything then save

setTimeout(()=>{


html2canvas(document.getElementById("exportCard"),{

backgroundColor:"#000000"

}).then(canvas=>{


let link=document.createElement("a");

link.download="Tarnished_Codex.png";

link.href=canvas.toDataURL();

link.click();


});


},300);


};


img.src = chartImage;



};