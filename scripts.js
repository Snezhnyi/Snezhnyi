document.addEventListener('contextmenu',e=>e.preventDefault());
cardsNumber=[16,20,24,36];
colors=['c55','55c','5c5','c5c'];
modal=document.getElementById('modal');
function modalF(){
	modal.classList.remove('none');
};
function modalN(){
	modal.classList.add('none');
};
function menu(){
	modalF();
	(gameOn==true)?c=false:c=' class="disabled"';
	modal.insertAdjacentHTML('afterbegin','<div id="menu"><h1><span>M</span><span>e</span><span>M</span><span>o</span></h1><h3>Игра на память</h3><ul><li data-action="continue"'+c+'>Продолжить</li><li data-action="new-game">Новая игра</li><li data-action="instructions">Инструкция</li><li data-action="author">Автор</li></ul></div>');
	document.querySelectorAll('#menu li').forEach(function(e){
		e.addEventListener('click',function(){
			if (e.classList=='disabled') {
				return;
			}
			modalN();
			document.getElementById('menu').remove();
		});
	});
	document.querySelector('[data-action="new-game"]').addEventListener('click',function(){
		if(gameOn==false) {
			newGame(1);
			return;
		}
		modalF();
		modal.insertAdjacentHTML('afterbegin','<div id="menu"><h2>Вы уверены?</h2><ul><li data-action="yes">Да</li><li data-action="no">Нет</li></ul></div>');
		document.querySelector('[data-action="yes"]').addEventListener('click',function(){
			modalN();
			document.getElementById('menu').remove();
			moves=100;
			newGame(1);
		});
		document.querySelector('[data-action="no"]').addEventListener('click',function(){
			document.getElementById('menu').remove();
			menu();
		});
	});
	document.querySelector('[data-action="instructions"]').addEventListener('click',function(){
		modalF();
		modal.insertAdjacentHTML('afterbegin','<div id="menu" class="instructions"><h2>Инструкция</h2><p>1Переверните две карты назад и запомните, какое число было на них и где оно находилось.</p><p>2. У вас есть определенное количество ходов, чтобы запомнить пары карт и получить очки</p><p>Когда все карты будут соответствовать, текущий уровень будет пройден, и вы перейдете на следующий уровень.</p><p>4. Игра заканчивается, когда последний уровень пройден или у вас не осталось ходов.</p><ul><li data-action="continue">Далее</li></ul></div>');
		document.querySelector('[data-action="continue"]').addEventListener('click',function(){
			document.getElementById('menu').remove();
			menu();
		});
	});
	document.querySelector('[data-action="author"]').addEventListener('click',function(){
		modalF();
		modal.insertAdjacentHTML('afterbegin','<div id="menu" class="author"><h2>Никита Хайрудинов, МКИС-12</h2><ul><li data-action="continue">Continue</li></ul></div>');
		document.querySelector('[data-action="continue"]').addEventListener('click',function(){
			document.getElementById('menu').remove();
			menu();
		});
	});
}
menu();
document.onkeydown=function(e){
	if(!document.getElementById('menu')){
		(e.keyCode==27)?menu():false;
	}
    
};
function cards(){
	n=cardsNumber[level-1];
	cardsSelected=[];
	colorsSelected=[];
	for(let i=0,j=0;i<n/2;i++,j++){
		cardsSelected.push(i+1);
		cardsSelected.push(i+1);
		if(j==colors.length)j=0;
		colorsSelected.push(colors[j]);
		colorsSelected.push(colors[j]);
	}
	for(let i=cardsSelected.length-1;i>0;i--){
		ii=(Math.floor(Math.random()*(i+1)));
		[cardsSelected[i],cardsSelected[ii]]=[cardsSelected[ii],cardsSelected[i]];
		[colorsSelected[i],colorsSelected[ii]]=[colorsSelected[ii],colorsSelected[i]];
	}
	for(let i=0;i<n;i++){
		cl=0;
		cardsT=[];
		document.getElementById('cards').insertAdjacentHTML('beforeend','<div data-cardid='+(i+1)+'" class="card"></div>');
		document.querySelectorAll('.card')[i].addEventListener('click', function(){
			if(cl==2||this.classList.contains('clicked')||this.classList.contains('checked')){
				return;
			} else {
				this.classList.add('clicked');
				this.setAttribute('data-bg',colorsSelected[i]);
				this.insertAdjacentHTML('beforeend','<span>'+cardsSelected[i]+'</span>');
				cardsT.push(cardsSelected[i]);
				cl++;
				if(cl==2){
					if(cardsT[0]==cardsT[1]){
						document.getElementById('moves').innerHTML=moves;
						for(let i=2;i>0;i--){
							document.getElementsByClassName('clicked')[i-1].classList.add('checked');
							document.getElementsByClassName('clicked')[i-1].classList.remove('clicked');
							if(document.querySelectorAll('.checked').length==n-1){
								if(cardsNumber.length==level){
									gameOver();
								} else {
									modalF();
									modal.insertAdjacentHTML('afterbegin','<div id="menu"><h2>Поздравляю!</h2><ul><li data-action="next-level">Следующий уровень</li></ul></div>');
									document.querySelector('[data-action="next-level"]').addEventListener('click',function(){
										modalN();
										document.getElementById('menu').remove();
										level++;
										newGame(level);
									});
								}
							}
						}
						cl=0;
					} else {
						moves--;
						document.getElementById('moves').innerHTML=moves;
						setTimeout(function(){
							for(let i=2;i>0;i--){
								document.querySelectorAll('.clicked span')[i-1].remove();
								document.querySelectorAll('.clicked')[i-1].removeAttribute('data-bg');
								document.getElementsByClassName('clicked')[i-1].classList.remove('clicked');
							}
							cl=0;
						},1000);
					} cardsT=[];
				} 
			}
			if(moves==0){
				gameOver();
			}
		});
	}
	resize();
}
function resize(){
	n=cardsNumber[level-1];
	if (n==16||n==20||(n==24 && window.innerWidth<=window.innerHeight)){
		document.getElementById('cards').setAttribute('data-cols',4);
		cols=4;
	} else {
		document.getElementById('cards').setAttribute('data-cols',6);
		cols=6;
	}
	size=document.getElementById('cards').offsetWidth;
	document.querySelectorAll('.card').forEach(function(e){
		e.style.width=(size/cols-10)+"px";
		e.style.height=(size/cols-10)+"px";
	});
	document.getElementById('cards').style.fontSize=(size/cols/2.5)+"px";
}
function clearBoard(){
	if(document.querySelector('#score p')){
		document.querySelector('#score p').remove();
	}
	for (let i=document.querySelectorAll('.card').length;i>0;i--){
		document.querySelectorAll('.card')[i-1].remove();
	}
}
var gameOn=false, moves;
function newGame(l){
	gameOn=true;
	clearBoard();
	level=l;
	cards();
	(moves)?moves:moves=75;
	document.getElementById('score').insertAdjacentHTML('afterbegin','<p>Осталось ходов: <span id="moves">'+moves+'</span></p>');
	window.addEventListener('resize',resize);
	document.getElementById('board-nav').addEventListener('click',function(){
		if(!document.getElementById('menu')){
			menu();
		}
	});
}
function gameOver(){
	gameOn=false;
	modalF();
	(moves==0)?string='<h2>Game Over!</h2><h3>You lose!</h3>':string='<h2>Поздравляю!</h2><h3>You win!</h3><p>Вы завершили игру в '+(75-moves)+' ходов!</p>';
	modal.insertAdjacentHTML('afterbegin','<div id="menu">'+string+'<ul><li data-action="menu">Menu</li></ul></div>');
	document.querySelector('[data-action="menu"]').addEventListener('click',function(){
		document.getElementById('menu').remove();
		menu();
	});
}