$(function(){
    let currentTurn='blue';
    const resultTexts=['','도','개','걸','윷','모']; //결과를 출력하기 위한 글자 배열
    let turnChangeTimer=null; //timeOut ID 정의 변수

    function updateTurnMessage(){ //info에 턴 안내 메세지 변경 함수
        const teamName=(currentTurn === 'blue') ? '청팀':'홍팀'; //현재 턴이 blue라면 청팀, 아니라면 홍팀으로
        const color=(currentTurn === 'blue') ? '#46e':'#c43'; //현재 턴이 blue라면 색상#46e, 아니라면 #c43
        $('.control>.info').html(teamName+'던질 차례입니다.').css({ 
            'background':currentTurn==='blue' ? '#eef':'#fee', //글자 출력 후 스타일 배경색과 컬러를 정의 하겠다
            'color':color
        })
    }
    updateTurnMessage(); //info출력 초기화
    function changeTurn(){ //턴 변경 blue가 현재 currentTurn이면 'red'로 아니면 'blue'로 갱신 후 info에 결과를 출력, 뭐가 나왔다를 출력하는 것임
        currentTurn=(currentTurn==='blue') ? 'red':'blue';
        updateTurnMassage();
    }
    function showResult(num,extraTurn){// 랜덤 (1~5)값과 추가 턴 판단(true/false)인자로 결과를 출력
        const teamName=(currentTurn==='blue') ? '청팀':'홍팀';
        const color=(currentTurn==='blue') ? '#46e':'#c43'; //현재 턴이 blue면 청팀, 글자색 정의 red면 홍팀, 글자색 정의
        const resultText=resultTexts[num]; //랜덤 값으로 배열 요소 값 호출(1~5번째 '도'~'모'중 하나 임의 호출)
        let message = teamName+' - '+resultText; //팀명-결과 형식의 문자열 구성
        if(extraTurn){ //추가 턴 판단이 있다면 
            message += '(한번 더!)'; //결과 메세지를 뒤에 (한번 더) 추가 
        }
        $('.control>.info').html(message).css({
            'background':(currentTurn==='blue') ? '#eef':'#fee',
            'color':color
        });
    }
    //showResult(4,true); -> 잘나오나 test
    function schedualNextTurn(extraTurn){
        if(turnChangeTimer){ //turnChangeTimer가 null이 아니라면, timeOutId로 정의 되었다면
            clearTimeout(turnChangeTimer); //기존 타이머 제거, 메모리 정리
        }
        if(!extraTurn){ //윷, 모가 아니라 추가 턴 판단 아니라면 3초 뒤 턴 변경
            turnChangeTimer=setTimeout(changeTurn,3000);
        }else{ //윷, 모인 경우 3초 뒤 같은 팀 턴 안내
            turnChangeTimer=setTimeout(updateTurnMessage,3000);
        }
    }

    console.log('chk')
    $('.players span').draggable({stack:'span'});
    //.randombox -> display:none 과 :flex 사이를 걸어줘야 하고
    // .randombox>img src -> "./image/m-1~0?.(확장자)" -> (1~5)
    $('.players span').droppable({
        tolerance:'intersect', /* -> 50%만 겹치면 말을 잡겠다 */
        drop:function(event, ui){
            let droppedPiece=ui.draggable //드래그 된 span
            let targetPiece=$(this); //드롭된 위치의 span
            let droppedTeam= droppedPiece.parent().hasClass('blue') ? 'blue':'red';
            //java는 hass.class가 없음 
            //드래그 된 span 부모 판정
            let targetTeam=targetPiece.parent().hasClass('blue') ? 'blue':'red';
            //드롭된 위치의 span 부모 판정
            if(droppedTeam !== targetTeam){
                targetPiece.css({
                    left:'0px',
                    top:'0px'
                });
                //기존 턴 변경 타이머 취소
                if(turnChangeTimer){ //만약 턴체인지타이머가 정의 되었다면
                    clearTimeout(turnChangeTimer); //턴체인이타이머를 제거하겠다

                }
                alert(droppedTeam+'팀이 '+targetTeam+'팀 말을 잡았습니다.');
                //말을 잡은 팀 추가 기회
                currentTurn=droppedTeam; //드래그된 span의 팀을 현재 턴으로 정의, 잡은 팀이 현재 턴이야
                turnChangeTimer=setTimeout(updateTurnMessage,2000); //턴 변경이 아닌 현재 턴으로 메세지 갱신
            }            
        }
    });
    function randomImg(){
        let num=Math.floor(Math.random()*5)+1; //1~5 랜덤
        let imgsrc=`./image/m${num}.webp`;  console.log(imgsrc)
        $('.randombox').find('img').attr('src',imgsrc);
        $('.randombox').css('display','flex');
        /* setTimeout(()=>{},2000) -> setTimeout(()=>{$('.randombox').hide()},2000)*/
        $('.randombox').delay(2000).fadeOut(150);
        //------------윷, 모가 나오면 추가 기회를 생성해야함----------------
        const extraTurn=(num===4||num===5); //true 반환
        setTimeout(function(){
            showResult(num, extraTurn); //2초 뒤에 결과를 보여줘
            schedualNextturn(extraTurn); //혹시나 다른 턴이 있다면 다른 결과를 보여준다는 걸까?
        },2000);
    }
    $('.btn').on('click',function(){
        $('.randombox').hide();
        setTimeout(randomImg,1500);
    });
    $('.resetbtn').on('click',function(){
        window.location.reload();
    })
});
