//PASSO 1 CRIAR AS VARIÁVEIS
var trex_correndo, trex, trex_parado;
var solo, soloImagem, soloInvisivel;
var nuvemImagem;
//criar as variáveis para os grupos
var cactoGrupo, nuvemGrupo;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//PASSO 1: CRIAR A VARIÁVEL
var somPulo, somCheck, somFim;
var restartImagem, restart;

//CARREGAR ARQUIVOS DE MÍDIA
function preload() {

    //CARREGAR  SONS
    somPulo = loadSound("jump.mp3");
    somCheck = loadSound("checkpoint.mp3"); 
    somFim = loadSound("die.mp3");

    //carregar animações
    trex_correndo = loadAnimation("trex1.png", "trex2.png", "trex3.png");
    trex_parado = loadAnimation("trex1.png");

    //CARREGAR IMAGENS
    soloImagem = loadImage("solo.png");
    nuvemImagem = loadImage("nuvem.png");
     
    obs1 = loadImage("obstaculo1.png");
    obs2 = loadImage("obstaculo2.png");
    obs3 = loadImage("obstaculo3.png");
    obs4 = loadImage("obstaculo4.png");
    obs5 = loadImage("obstaculo5.png");
    obs6 = loadImage("obstaculo6.png");
    gameOverImagem = loadImage("gameOver.png");
    restartImagem = loadImage("restart.png");
}
var score = 0;
function setup() {
    createCanvas(windowWidth, windowHeight);

    //criar os grupos
    cactoGrupo = new Group();
    nuvemGrupo = new Group();

    //gameOver
    gameOver = createSprite(width/2, height/2);
    gameOver.addImage(gameOverImagem);
    gameOver.scale = 0.5;
    gameOver.visible = false;

    //restart
    
    restart = createSprite(width/2,  height/2+25);
    restart.addImage(restartImagem);
    restart.scale = 0.5;
    restart.visible = false;

    //solo
    solo = createSprite(width/2, height-10, width, 20);
    solo.addImage(soloImagem);
    solo.scale = 1.2;    
    solo.velocityX = -3;

    //solo invisível
    soloInvisivel = createSprite(width/2, height-1, width, 2);
    soloInvisivel.visible = false;    

    //trex
    trex = createSprite(50, height-30, 50, 50);
    trex.addAnimation("correndo", trex_correndo);
    trex.addAnimation("parado", trex_parado);
    trex.scale = 0.5;
}

function draw() {
    background("white");

    if(gameState==PLAY){
        trex.changeAnimation("correndo");
    
        if (solo.x < width / 3) {
            solo.x = solo.width / 1.7;
        }
        
        if ((keyDown("space") || touches.length > 0 )  && trex.isTouching(solo)) {
            trex.velocityY = -13;
            somPulo.play();
            touches = [];
        }
        if(!trex.isTouching(solo)){
            trex.changeAnimation("parado");
        }
        //aumenta a pontuação
        //pegar a taxa de quadros por segundo
        score += getFrameRate() / 300;
        textSize(30);
        //mostra na tela
        text(Math.round(score), width/1.2, height/9);
        //aumenta a velocidade
        solo.velocityX = -(3 + score/10);
        cactoGrupo.setVelocityXEach(solo.velocityX);

        criarNuvens();
        criarCactos();

        if(trex.isTouching(cactoGrupo)){
            gameState = END;
        }

    }
    if(gameState == END){

        solo.velocityX = 0;

        cactoGrupo.setVelocityXEach(0)
        nuvemGrupo.setVelocityXEach(0)
        
        cactoGrupo.setLifetimeEach(-1);
        nuvemGrupo.setLifetimeEach(-1);

        trex.changeAnimation("parado"); 

        gameOver.visible = true;
        restart.visible = true;
        //checar se restart foi clicado
        //chamar a função reiniciar()
        if(mousePressedOver(restart) || touches.length>0){
            reiniciar();
            touches=[];
        }

    }
    trex.velocityY += 0.8;   
    trex.collide(soloInvisivel);
    drawSprites();

}
function reiniciar(){
    score = 0;
    cactoGrupo.destroyEach();
    nuvemGrupo.destroyEach();
    gameState=PLAY;
}
//cria a function 
function criarNuvens(){
    if (frameCount % 60 === 0) {
        nuvem = createSprite(width, 100, 40, 10);
        nuvem.y = Math.round(random(10, height-50));
        nuvem.addImage(nuvemImagem);
        nuvem.scale = 0.5;
        nuvem.velocityX = -3;

        //atribuir tempo de vida à sprite
        nuvem.lifetime = width/3;
        //ajustar a profundidade
        trex.depth = nuvem.depth + 1;
        nuvemGrupo.add(nuvem);
    }
}

function criarCactos() {
    if (frameCount % 60 === 0) {
        var cacto = createSprite(width,height-25, 10, 40);
        cacto.velocityX = solo.velocityX;

        //gerar obstáculos aleatórios
        var rand = Math.round(random(1, 6));
        switch (rand) {
            case 1:
                cacto.addImage(obs1);
                break;
            case 2:
                cacto.addImage(obs2);
                break;
            case 3:
                cacto.addImage(obs3);
                break;
            case 4:
                cacto.addImage(obs4);
                break;
            case 5:
                cacto.addImage(obs5);
                break;
            case 6:
                cacto.addImage(obs6);
                break;
            default:
                break;
        }

        //atribuir escala e vida útil ao obstáculo       
        cacto.scale = 0.5;
        cacto.lifetime = width/3;
        cactoGrupo.add(cacto);



    }
}

function reiniciar(){
    gameState = PLAY;
    score = 0;
    cactoGrupo.destroyEach();
    nuvemGrupo.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
}