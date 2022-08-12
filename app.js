// sever

/*
    express 모듈을 실행해서 app 변수에 할당

    app.set('port', 포트)로 서버가 실행될 포트를 설정. 
    process.env.PORT || 3000
    -> process.env 객체에 PORT 속성이 있다면 그 값을 사용하고, 없다면 3000번 포트를 기본값으로 이용
    app.set(키, 값)을 사용해서 데이터를 저장할 수 있다.
    나중에 app.get(키)로 데이터를 가져올 수 있다.

*/

// express 패키지
const express = require('express');
// 미들웨어 패키지
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// process.env를 관리하기 위해 설치된 패키지, dot(점) + env 
// cookie_secret은 비밀키를 의미함
const dotenv = require('dotenv');
// 경로 패키지
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

// 설치했던 패키지들을 app.use로 연결, req와 res, next 가 보이지 않는 이유는 미들웨어 내부에 들어있기 때문.
/* 
    morgan: 요청과 응답, 응답 속도 등을 출력
    morgan 인수로는 dev, combined, common, short, tiny가 있으며. 개발용: dev, 배포용: combined 주로 사용.

    static: 정적인 파일들을 서버에 연결해주는 라우터 역할.
    public폴더에 js, css, 이미지 등이 담겨있다면 'public'만 지정하면 됨.

    body-parser: 요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어줌
    단 멀티파트(이미지, 동영상, 파일) 데이터는 처리하지 못함. -> multer 모듈 사용
    Json, URL-encoded 형식이 기본이며. raw, text데이터를 추가로 해석할 수 있음.

*/

app.use(morgan('dev'));     //morgan
app.use('/', express.static(path.join(__dirname, 'public')));     //static  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));     //body-parser  
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});