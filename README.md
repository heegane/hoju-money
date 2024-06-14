<div align="center">
  <div>
    <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D"/>
    <img src="https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white"/>
    <img src="https://img.shields.io/badge/jsonserver-%234793D0.svg?style=for-the-badge&logo=json&logoColor=white"/>
  </div>
  <div>
    <img src="https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white"/>
    <img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white"/>
  </div>
  <img src="https://github.com/imdayoung/hoju-money/assets/86220363/3526be3f-cedb-4365-96f1-4b9fd3f09095" width="200px"/>
  <h1>호주머니</h1>
  <strong>당신의 호주머니를 간편하게 관리하는 스마트 가계부</strong>
</div>

## 👨‍👨‍👧‍👦 팀원 소개
<table>
  <tr>
    <td align="center"><img src="https://github.com/imdayoung/hoju-money/assets/86220363/52605d10-cf8b-45c9-be82-e02d1a8cfd1c" alt="notion avatar" width="140px"></td>
    <td align="center"><img src="https://github.com/imdayoung/hoju-money/assets/86220363/3787f359-56e0-4d7e-b446-fdfc6121b35d" alt="notion avatar" width="140px"></td>
    <td align="center"><img src="https://github.com/imdayoung/hoju-money/assets/86220363/9e249514-3988-4c24-947e-2033c2bb2de1" alt="notion avatar" width="140px"></td>
    <td align="center"><img src="https://github.com/imdayoung/hoju-money/assets/86220363/b4e45b4b-989b-43b7-bd36-783278e5ac0e" alt="notion avatar" width="140px"></td>
    <td align="center"><img src="https://github.com/imdayoung/hoju-money/assets/86220363/27d2e738-5fb9-4271-82b7-a88f6dc7a7f0" alt="notion avatar" width="140px"></td>
  </tr>
  <tr>
    <td align="center" style="width: 90px;">
      <a href="https://github.com/find11570">김현수</a>
    </td>
    <td align="center" style="width: 90px;">
      <a href="https://github.com/lgh9776">이가현</a>
    </td>
    <td align="center" style="width: 90px;">
      <a href="https://github.com/imdayoung">이다영</a>
    </td>
    <td align="center" style="width: 90px;">
      <a href="https://github.com/heegane">이현희</a>
    </td>
    <td align="center" style="width: 90px;">
      <a href="https://github.com/Cellocayin">채희재</a>
    </td>
  </tr>
</table>

## 💬 주요 기능
### 로그인, 프로필 조회 및 수정, 설정
#### ❗ 설정 적용되지는 않음
<img src="https://github.com/imdayoung/hoju-money/assets/86220363/d0b10a12-cfdf-4c1a-814f-b55bfedd1267" width="600px"/>

### 수입/지출 내역 조회
<img src="https://github.com/imdayoung/hoju-money/assets/86220363/2d96f8f6-68fd-475e-ae45-81c0b99fc29e" width="600px"/>

### 수입/지출 내역 CRUD
<img src="https://github.com/imdayoung/hoju-money/assets/86220363/25538e57-8da4-4b58-9cd8-79806729ce8c" width="600px"/>

### 카테고리별 및 수입/지출 분석 리포트
<img src="https://github.com/imdayoung/hoju-money/assets/86220363/7c87cbf4-8546-4555-9b83-2ca812d215b9" width="600px"/>

## ✏️ 사용 모듈 리스트
- `axios`
- `pinia`
- `bootstrap`
- `vue3-datepicker`
- `vue3-charts`
- `date-fns`
- `json-server`

### 프로젝트 실행 방법
```
git clone https://github.com/imdayoung/hoju-money
cd hoju-money
npm install
npm run dev
```

### json server 실행 방법
```
cd src/server
json-server --watch MOCK_DATA.json --port 3001
```

## 📜 협업 방식
### ⛓ Branch Strategy
- `main` : 배포 시 사용
- `dev` : 기능을 모아두는 브랜치. 개발이 완료되면 main 브랜치로 merge
- `feature/name` : 각자의 작업 공간을 위한 브랜치. 기능 완성 시 PR 생성 후 dev 브랜치로 merge
  
  - `feature/hs` : 현수
  - `feature/gh` : 가현
  - `feature/dy` : 다영
  - `feature/hh` : 현희
  - `feature/hj` : 희재
### 📤 Commit Convention
- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 내용 변경
- `style` : 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- `refactor` : 코드 리팩토링
- `chore` : 빌드 수정, 패키지 매니저 설정, 운영 코드 변경이 없는 경우
