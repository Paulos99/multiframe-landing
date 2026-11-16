(function(){
  var b=document.body, bar=document.querySelector('.bar'), menu=document.querySelector('.bar__menu');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){requestAnimationFrame(function(){requestAnimationFrame(function(){b.classList.remove('is-loading')})})}
  var hi=document.querySelector('.frame--hero img');
  if(hi && !hi.complete){hi.addEventListener('load',start);setTimeout(start,1200)}else start();

  if(menu){menu.addEventListener('click',function(){
    var o=bar.classList.toggle('is-open');menu.setAttribute('aria-expanded',o);menu.textContent=o?'Закрыть':'Меню';
    document.documentElement.style.overflow=o?'hidden':'';
  });
  document.querySelectorAll('.bar__nav a').forEach(function(a){a.addEventListener('click',function(){
    if(bar.classList.contains('is-open')) menu.click();
  })})}

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('[data-r]').forEach(function(el){io.observe(el)});

  var last=0, px=[].slice.call(document.querySelectorAll('.px')), ticking=false;
  function frame(){
    var y=window.scrollY;
    bar.classList.toggle('is-solid',y>40);
    if(!bar.classList.contains('is-open')) bar.classList.toggle('is-hidden',y>last && y>500);
    last=y;
    if(!reduce){var vh=window.innerHeight;px.forEach(function(img){
      var r=img.closest('.frame').getBoundingClientRect(); if(r.bottom<0||r.top>vh) return;
      var p=(r.top+r.height/2-vh/2)/vh; img.style.transform='translate3d(0,'+(p*-5).toFixed(2)+'%,0)';
    })}
    ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
  frame();
})();
